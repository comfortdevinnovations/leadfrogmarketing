/**
 * Single source of truth for the deployment's public identity.
 *
 * Set `SITE_ADDRESS` in `.env.local` (e.g. `leadfrogmarketing.com`) and every
 * absolute link — metadata/canonicals, sitemap, robots, and the links inside
 * outbound email — follows it, so moving domains is a one-line change.
 *
 * Server-only: `SITE_ADDRESS` carries no `NEXT_PUBLIC_` prefix, so it is not
 * inlined into the browser bundle. Every module here is imported from server
 * components, metadata routes, or the mail layer. If a `"use client"` module
 * ever needs the domain, pass it down as a prop rather than importing this.
 *
 * Note that `sitemap.ts`, `robots.ts`, and static metadata are evaluated at
 * build time, so `SITE_ADDRESS` must be present in the build environment — not
 * only at runtime.
 */

/** Used when `SITE_ADDRESS` is unset, so a bare `next build` still succeeds. */
const FALLBACK_DOMAIN = "leadfrogmarketing.com";

/**
 * Accepts either a bare host (`example.com`) or a full URL
 * (`https://example.com/`). Protocol, trailing slash, and any path are stripped
 * so callers can append paths to `SITE_URL` without doubling separators.
 */
function resolveDomain(): string {
  const raw = process.env.SITE_ADDRESS?.trim();
  if (!raw) return FALLBACK_DOMAIN;

  const host = raw
    .replace(/^[a-z][a-z0-9+.-]*:\/\//i, "") // scheme
    .replace(/\/.*$/, "") // path, and with it the trailing slash
    .toLowerCase();

  return host || FALLBACK_DOMAIN;
}

/** Canonical host, exactly as configured — `www.` is kept if you set it. */
export const SITE_DOMAIN = resolveDomain();

/** Canonical origin, no trailing slash. Always https. */
export const SITE_URL = `https://${SITE_DOMAIN}`;

export const SITE_NAME = "Lead Frog Marketing";

/**
 * The address shown publicly (footer, contact page, email signatures). Mailboxes
 * live on the apex, so `www.` is dropped here even when the canonical URL keeps
 * it. This is the *displayed* address — where submissions are actually delivered
 * is configured separately via `CONTACT_TO_EMAIL`.
 */
export const CONTACT_EMAIL = `hello@${SITE_DOMAIN.replace(/^www\./, "")}`;
