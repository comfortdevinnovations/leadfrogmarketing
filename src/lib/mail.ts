import "server-only";
import nodemailer from "nodemailer";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

// One pooled transport per server instance — reconnecting per message is slow
// and Gmail throttles aggressive connection churn.
let transporter: nodemailer.Transporter | null = null;

export function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT ?? 465);

  transporter = nodemailer.createTransport({
    host: required("SMTP_HOST"),
    port,
    // 465 is implicit TLS; 587 upgrades via STARTTLS.
    secure: port === 465,
    auth: {
      user: required("SMTP_USER"),
      pass: required("SMTP_PASSWORD"),
    },
    pool: true,
    maxConnections: 3,
  });

  return transporter;
}

export function getFromHeader(): string {
  const name = process.env.MAIL_FROM_NAME ?? "Lead Frog Marketing";
  const address = required("MAIL_FROM_ADDRESS");
  return `"${name.replace(/"/g, "")}" <${address}>`;
}

/** Accepts a comma- or semicolon-separated list, so one env var can fan out. */
function parseAddressList(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[,;]/)
    .map((address) => address.trim())
    .filter(Boolean);
}

export function getContactRecipients(): string[] {
  const recipients = parseAddressList(process.env.CONTACT_TO_EMAIL);
  if (!recipients.length) {
    throw new Error("Missing required environment variable: CONTACT_TO_EMAIL");
  }
  return recipients;
}

/** Silent copies of inbound enquiries. Optional — empty when unset. */
export function getContactBcc(): string[] {
  return parseAddressList(process.env.CONTACT_BCC_EMAIL);
}

/** The inbox replies should land in, used as Reply-To on the auto-reply. */
export function getPrimaryContactRecipient(): string {
  return getContactRecipients()[0];
}
