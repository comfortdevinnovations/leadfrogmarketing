import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import {
  getContactBcc,
  getContactRecipients,
  getFromHeader,
  getPrimaryContactRecipient,
  getTransporter,
} from "@/lib/mail";
import {
  renderLeadAutoReply,
  renderLeadNotification,
  type ContactSubmission,
} from "@/lib/emails/contactEmails";

const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  company: 160,
  message: 5000,
  services: 12,
};

// Deliberately conservative: catches typos and header-injection attempts
// (newlines, commas) without trying to fully parse RFC 5322.
const EMAIL_PATTERN = /^[^\s@,;:<>"']+@[^\s@,;:<>"'.]+\.[^\s@,;:<>"']+$/;

const CLIENT_ID_COOKIE = "lf_cid";
const CLIENT_ID_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * Durable per-browser id, issued by us rather than derived from the request.
 *
 * The value is validated as a UUID before use: the cookie is attacker-supplied,
 * and accepting arbitrary strings would let one caller mint unlimited distinct
 * rate-limit keys of unbounded length.
 *
 * Returns null the first time a browser is seen. The cookie is set on the way
 * out, so it starts counting from the *next* request — this one is covered by
 * the IP key alone. That also keeps single-shot bots, which never return a
 * cookie, from each adding a throwaway entry to the limiter map.
 */
async function resolveClientId(): Promise<string | null> {
  const store = await cookies();
  const current = store.get(CLIENT_ID_COOKIE)?.value;

  if (current && UUID_PATTERN.test(current)) return current;

  store.set(CLIENT_ID_COOKIE, randomUUID(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: CLIENT_ID_MAX_AGE,
    path: "/",
  });

  return null;
}

/**
 * Strips control characters, which have no place in form input and are the
 * vector for smuggling extra headers into the outgoing message. Newline and
 * tab survive so the message body can keep its formatting.
 */
function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";

  let out = "";
  for (const char of value) {
    const code = char.codePointAt(0)!;
    const isControl = code < 32 || code === 127;
    const isKeptWhitespace = code === 9 || code === 10; // tab, newline
    if (!isControl || isKeptWhitespace) out += char;
  }

  return out.trim().slice(0, max);
}

/** Single-line fields must not contain newlines at all. */
function cleanLine(value: unknown, max: number): string {
  return clean(value, max).replace(/[\r\n]+/g, " ").trim();
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;

  // Honeypot: a field hidden from humans. Bots fill it in. Return success so
  // they get no signal that the submission was dropped.
  const honeypot = cleanLine(body.subject_ref, 100);
  if (honeypot) {
    // A drop is indistinguishable from a success to the caller, which makes an
    // over-eager honeypot invisible in production. Say so in the dev log, since
    // browser autofill tripping this is the likeliest cause of "the form says
    // it worked but no email arrived".
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `Contact form: honeypot tripped (value: ${JSON.stringify(honeypot)}) — submission dropped, no email sent.`
      );
    }
    return Response.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Both keys share one allowance: clearing cookies still leaves the IP count,
  // and moving networks still leaves the cookie count.
  const clientId = await resolveClientId();
  const limit = checkRateLimit([
    `ip:${ip}`,
    ...(clientId ? [`client:${clientId}`] : []),
  ]);

  if (!limit.allowed) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60);
    return Response.json(
      {
        error: `Too many messages sent. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      }
    );
  }

  const submission: ContactSubmission = {
    name: cleanLine(body.name, LIMITS.name),
    email: cleanLine(body.email, LIMITS.email),
    phone: cleanLine(body.phone, LIMITS.phone) || undefined,
    company: cleanLine(body.company, LIMITS.company) || undefined,
    services: Array.isArray(body.services)
      ? body.services
          .slice(0, LIMITS.services)
          .map((service) => cleanLine(service, 80))
          .filter(Boolean)
      : [],
    message: clean(body.message, LIMITS.message),
  };

  if (!submission.name || !submission.email || !submission.message) {
    return Response.json(
      { error: "Please fill in your name, email, and message." },
      { status: 400 }
    );
  }

  if (!EMAIL_PATTERN.test(submission.email)) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    const transporter = getTransporter();
    const from = getFromHeader();

    const bcc = getContactBcc();

    const notification = renderLeadNotification(submission);
    await transporter.sendMail({
      from,
      to: getContactRecipients(),
      // Omit the key entirely when unset — an empty array still emits a header
      // in some transports.
      ...(bcc.length ? { bcc } : {}),
      replyTo: `"${submission.name.replace(/"/g, "")}" <${submission.email}>`,
      subject: notification.subject,
      text: notification.text,
      html: notification.html,
    });

    // The lead's confirmation is a courtesy — if it fails, the enquiry itself
    // has already been delivered, so don't fail the request over it.
    try {
      const autoReply = renderLeadAutoReply(submission);
      await transporter.sendMail({
        from,
        to: submission.email,
        // Intentionally no bcc here: this goes to the lead, and the team
        // already has the full enquiry from the notification above.
        replyTo: getPrimaryContactRecipient(),
        subject: autoReply.subject,
        text: autoReply.text,
        html: autoReply.html,
        // Marks this as machine-generated so other systems' vacation
        // responders don't reply back and start a loop.
        headers: { "Auto-Submitted": "auto-replied" },
      });
    } catch (error) {
      console.error("Contact auto-reply failed:", error);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Contact form send failed:", error);
    return Response.json(
      { error: "Something went wrong sending your message. Please try again." },
      { status: 500 }
    );
  }
}
