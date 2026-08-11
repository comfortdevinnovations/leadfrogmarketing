import { SITE_URL } from "@/lib/site";
import {
  escapeHtml,
  fonts,
  palette,
  renderButton,
  renderShell,
} from "@/lib/emails/shell";

export type ContactSubmission = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  services: string[];
  message: string;
};

function renderField(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0; border-bottom:1px solid ${palette.hairline}; font-family:${fonts.body}; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${palette.muted}; width:150px; vertical-align:top;">
      ${escapeHtml(label)}
    </td>
    <td style="padding:10px 0; border-bottom:1px solid ${palette.hairline}; font-family:${fonts.body}; font-size:15px; color:${palette.text}; vertical-align:top;">
      ${value}
    </td>
  </tr>`;
}

/** Internal email to the team. Reply-To is set to the lead so a reply just works. */
export function renderLeadNotification(submission: ContactSubmission) {
  const { name, email, phone, company, services, message } = submission;

  const rows = [
    renderField(
      "Name",
      `<strong style="color:${palette.primary};">${escapeHtml(name)}</strong>`
    ),
    renderField(
      "Email",
      `<a href="mailto:${escapeHtml(email)}" style="color:${palette.primary};">${escapeHtml(email)}</a>`
    ),
    phone
      ? renderField(
          "Phone",
          `<a href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ""))}" style="color:${palette.primary};">${escapeHtml(phone)}</a>`
        )
      : "",
    company ? renderField("Company", escapeHtml(company)) : "",
    services.length
      ? renderField(
          "Interested in",
          services
            .map(
              (service) =>
                `<span style="display:inline-block; margin:0 6px 6px 0; padding:4px 12px; background-color:${palette.fadedPrimary}; border-radius:999px; font-size:13px; color:${palette.altPrimary};">${escapeHtml(service)}</span>`
            )
            .join("")
        )
      : "",
  ]
    .filter(Boolean)
    .join("");

  const content = `
    <p style="margin:0 0 24px 0;">A new enquiry just came in through the website contact form.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;">
      ${rows}
    </table>

    <p style="margin:0 0 8px 0; font-family:${fonts.body}; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${palette.muted};">
      Their message
    </p>
    <div style="padding:18px 20px; background-color:${palette.page}; border-left:3px solid ${palette.accent}; border-radius:0 10px 10px 0; white-space:pre-wrap; font-size:15px; line-height:1.65;">${escapeHtml(message)}</div>

    <p style="margin:28px 0 0 0;">Replying to this email goes straight to ${escapeHtml(name)}.</p>
  `;

  const text = [
    "New enquiry from the Lead Frog Marketing website.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    company ? `Company: ${company}` : null,
    services.length ? `Interested in: ${services.join(", ")}` : null,
    "",
    "Message:",
    message,
    "",
    `Replying to this email goes straight to ${name}.`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return {
    // Plain and factual — no marketing language in an internal notification,
    // which also keeps it clear of promotional spam filters.
    subject: `New enquiry — ${name}${company ? ` (${company})` : ""}`,
    html: renderShell({
      preheader: `${name} got in touch${company ? ` from ${company}` : ""}.`,
      heading: "New enquiry from the website",
      content,
      footerNote:
        "You are receiving this because it was sent to the Lead Frog Marketing contact inbox.",
    }),
    text,
  };
}

/** Confirmation sent to the person who filled in the form. */
export function renderLeadAutoReply(submission: ContactSubmission) {
  const { name, services, message } = submission;

  const firstName = name.trim().split(/\s+/)[0] || name;

  const content = `
    <p style="margin:0 0 18px 0;">Hi ${escapeHtml(firstName)},</p>

    <p style="margin:0 0 18px 0;">
      Thanks for reaching out to Lead Frog Marketing. Your message landed with our
      team and a strategist will follow up within one business day &mdash; a real
      reply from a real person, not an automated sequence.
    </p>

    ${
      services.length
        ? `<p style="margin:0 0 8px 0; font-family:${fonts.body}; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${palette.muted};">You told us you're interested in</p>
           <p style="margin:0 0 22px 0;">${services
             .map(
               (service) =>
                 `<span style="display:inline-block; margin:0 6px 6px 0; padding:5px 14px; background-color:${palette.fadedPrimary}; border-radius:999px; font-size:13px; color:${palette.altPrimary};">${escapeHtml(service)}</span>`
             )
             .join("")}</p>`
        : ""
    }

    <p style="margin:0 0 8px 0; font-family:${fonts.body}; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:${palette.muted};">
      What you sent us
    </p>
    <div style="margin:0 0 26px 0; padding:18px 20px; background-color:${palette.page}; border-left:3px solid ${palette.accent}; border-radius:0 10px 10px 0; white-space:pre-wrap; font-size:15px; line-height:1.65; color:${palette.muted};">${escapeHtml(message)}</div>

    <p style="margin:0 0 22px 0;">
      In the meantime, you're welcome to look through how we approach growth &mdash;
      lead generation, digital strategy, and the analytics that tie it together.
    </p>

    ${renderButton(`${SITE_URL}/services`, "Explore our services")}

    <p style="margin:26px 0 0 0;">
      If anything's changed or you'd like to add detail, just reply to this
      email &mdash; it comes straight to us.
    </p>

    <p style="margin:22px 0 0 0;">
      Talk soon,<br>
      <strong style="color:${palette.primary};">The Lead Frog team</strong>
    </p>
  `;

  const text = [
    `Hi ${firstName},`,
    "",
    "Thanks for reaching out to Lead Frog Marketing. Your message landed with our team and a strategist will follow up within one business day - a real reply from a real person, not an automated sequence.",
    "",
    services.length ? `You told us you're interested in: ${services.join(", ")}` : null,
    services.length ? "" : null,
    "What you sent us:",
    message,
    "",
    `In the meantime, you're welcome to look through how we approach growth: ${SITE_URL}/services`,
    "",
    "If anything's changed or you'd like to add detail, just reply to this email - it comes straight to us.",
    "",
    "Talk soon,",
    "The Lead Frog team",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return {
    // Descriptive, no false urgency, no ALL CAPS, no exclamation marks — the
    // subject line is the single biggest spam-score lever.
    subject: "We received your message — Lead Frog Marketing",
    html: renderShell({
      preheader:
        "Thanks for getting in touch. A strategist will reply within one business day.",
      heading: "Thanks for getting in touch",
      content,
      footerNote:
        "You are receiving this one-off confirmation because this address was used to contact us through our website. You are not subscribed to any mailing list.",
    }),
    text,
  };
}
