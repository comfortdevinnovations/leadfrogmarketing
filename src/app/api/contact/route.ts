import type { NextRequest } from "next/server";
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

// Best-effort throttle. Resets on cold start and is per-instance, so treat it
// as friction for casual abuse rather than a hard guarantee.
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(
    (at) => now - at < RATE_LIMIT.windowMs
  );
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 5000) hits.clear();

  return recent.length > RATE_LIMIT.max;
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
  if (cleanLine(body.website, 100)) {
    return Response.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many messages sent. Please try again later." },
      { status: 429 }
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
