/**
 * Shared class names for the Lead Frog lockup (logo + wordmark).
 *
 * The intro splash flies its own copy of the lockup into the header's slot, so
 * the two must render at *identical* metrics — same gap, same logo box, same
 * type. Keeping the classes in one place is what makes that landing seamless.
 */
export const LOCKUP = {
  root: 'flex items-center gap-2.5 font-heading text-xl text-primary',
  logo: 'h-10 w-10 object-contain',
  word: 'font-bold tracking-tight',
} as const;

/** Split so the splash can fade "Marketing" out and the accent dot in. */
export const BRAND_HEAD = 'Lead Frog';
export const BRAND_TAIL = ' Marketing';
