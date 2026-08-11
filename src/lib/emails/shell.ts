import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Email HTML is assembled by string concatenation, so every interpolated value
 * that originated from a form submission MUST pass through here first.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Mirrors globals.css so mail matches the site.
export const palette = {
  primary: "#025374",
  altPrimary: "#195740",
  accent: "#e5c697",
  fadedPrimary: "#b7cec5",
  page: "#f2f6f7",
  card: "#ffffff",
  text: "#1a1a1a",
  muted: "#5b6b72",
  hairline: "#e4ebee",
};

// Fraunces/Instrument Sans aren't available in mail clients; these are the
// closest widely-installed stand-ins and keep the serif/sans contrast intact.
export const fonts = {
  heading: "Georgia, 'Times New Roman', Times, serif",
  body: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

/**
 * Wraps content in a table-based, inline-styled shell. Tables (not flex/grid)
 * because Outlook's Word renderer ignores modern CSS layout entirely.
 */
export function renderShell({
  preheader,
  heading,
  content,
  footerNote,
}: {
  preheader: string;
  heading: string;
  content: string;
  footerNote: string;
}): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0; padding:0; width:100%; background-color:${palette.page}; -webkit-font-smoothing:antialiased;">
  <!-- Preheader: the grey preview line after the subject in most inboxes. -->
  <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">
    ${escapeHtml(preheader)}
  </div>
  <!-- Padding characters stop clients from pulling body copy into the preview. -->
  <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">
    &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${palette.page};">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:100%; background-color:${palette.card}; border-radius:20px; overflow:hidden; border:1px solid ${palette.hairline};">

          <!-- Brand band. Text lockup rather than an image, so the email still
               reads correctly when a client blocks remote images by default. -->
          <tr>
            <td style="background-color:${palette.primary}; padding:28px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:${fonts.heading}; font-size:22px; font-weight:bold; color:#ffffff; letter-spacing:-0.01em;">
                    Lead Frog<span style="color:${palette.accent};">.</span>
                  </td>
                  <td align="right" style="font-family:${fonts.body}; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,255,255,0.65);">
                    Accelerated Growth
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gold hairline, echoing the accent rule used across the site. -->
          <tr><td style="height:3px; background-color:${palette.accent}; font-size:0; line-height:0;">&nbsp;</td></tr>

          <tr>
            <td style="padding:40px 40px 8px 40px;">
              <h1 style="margin:0; font-family:${fonts.heading}; font-size:26px; line-height:1.25; color:${palette.primary}; font-weight:bold;">
                ${escapeHtml(heading)}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 36px 40px; font-family:${fonts.body}; font-size:15px; line-height:1.65; color:${palette.text};">
              ${content}
            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px 32px 40px; border-top:1px solid ${palette.hairline}; font-family:${fonts.body}; font-size:12px; line-height:1.6; color:${palette.muted};">
              <p style="margin:0 0 10px 0;">${footerNote}</p>
              <p style="margin:0 0 10px 0;">
                <a href="${SITE_URL}" style="color:${palette.primary}; text-decoration:underline;">${SITE_URL.replace(/^https:\/\//, "")}</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:hello@leadfrogmarketing.com" style="color:${palette.primary}; text-decoration:underline;">hello@leadfrogmarketing.com</a>
              </p>
              <p style="margin:0; color:${palette.muted};">
                &copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Bulletproof-ish CTA: a padded table cell, not a styled <a>, for Outlook. */
export function renderButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;">
    <tr>
      <td align="center" bgcolor="${palette.primary}" style="border-radius:999px;">
        <a href="${href}" style="display:inline-block; padding:14px 30px; font-family:${fonts.body}; font-size:13px; font-weight:bold; letter-spacing:0.08em; text-transform:uppercase; color:#ffffff; text-decoration:none; border-radius:999px;">
          ${escapeHtml(label)}
        </a>
      </td>
    </tr>
  </table>`;
}
