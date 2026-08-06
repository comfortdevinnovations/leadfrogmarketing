type IconProps = {
  className?: string;
};

/** Three-point crown with a gem — the Lead Frog mark. */
export function CrownIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 20.5L1 8l6.5 5L16 3l8.5 10L31 8l-2 12.5H3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M3 20.5H29" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="12.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function RippleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="6" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="22" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
    </svg>
  );
}

export function LeadGenIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6.5 10.7V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 9v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function StrategyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15.5 8.5 12 12l-3.5 3.5L12 12l3.5-3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.12" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function AnalyticsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 20V10M11 20V4M18 20v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SeoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19.5 19.5 15.2 15.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 10.5c0-2 1-3.2 2.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function PpcIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 10v4l4 1 9 4V5L7 9l-4 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 15v3.5a1.5 1.5 0 0 0 3 0V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 9.5c1 1 1 4 0 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function SocialIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="6" cy="12" r="2.3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6" r="2.3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="18" r="2.3" stroke="currentColor" strokeWidth="1.5" />
      <path d="m8 10.8 7.6-3.7M8 13.2l7.6 3.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function EmailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2c-8 0-14-6-14-14a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CrmIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 4.5c1.7.4 3 2 3 3.9s-1.3 3.5-3 3.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M17.5 14.3c1.9.6 3 2.3 3 4.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Lily pad — a notched disc with radiating veins, viewed from above. */
export function LilyPadIcon({
  className,
  withFlower = false,
}: IconProps & { withFlower?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path d="M32 32 L58.2 21.5 A28 28 0 1 1 31.6 4.02 Z" fill="currentColor" />
      <path
        d="M32 32 21 12M32 32 8 28M32 32 14 46M32 32 30 58"
        stroke="#ffffff"
        strokeOpacity="0.22"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M32 32 L58.2 21.5 A28 28 0 1 1 31.6 4.02 Z"
        stroke="#ffffff"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      {withFlower && (
        <g>
          <circle cx="21" cy="18" r="2.3" fill="#e5c697" />
          <circle cx="16" cy="21.5" r="2.3" fill="#e5c697" />
          <circle cx="16" cy="26.5" r="2.3" fill="#e5c697" />
          <circle cx="21" cy="30" r="2.3" fill="#e5c697" />
          <circle cx="25" cy="24" r="2.3" fill="#e5c697" />
          <circle cx="20.5" cy="24" r="1.4" fill="#fffaf0" />
        </g>
      )}
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
