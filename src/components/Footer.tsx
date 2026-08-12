import Image from 'next/image';
import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/site';

const columns = [
  {
    title: 'Navigate',
    links: [
      { href: '/', label: 'Home' },
      { href: '/services', label: 'Services' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: '/services/seo-content-marketing', label: 'SEO & Content Marketing' },
      { href: '/services/paid-advertising', label: 'Paid Advertising' },
      { href: '/services/lead-nurturing-crm', label: 'Lead Nurturing & CRM' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-primary text-secondary">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] grain-overlay"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-alt-primary/40 blur-3xl animate-water-shimmer"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-16 right-0 h-56 w-56 rounded-full bg-accent/20 blur-3xl animate-water-shimmer"
        style={{ animationDelay: '1.5s' }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[120rem] mx-auto px-6 md:px-8 pt-16 pb-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5 font-heading text-xl font-bold">
              <div className="flex h-32 w-32 items-center justify-center rounded-md bg-white p-1.5">
                <Image
                  src="/lead-logo.png"
                  alt="Lead Frog Marketing"
                  width={512}
                  height={512}
                  className="h-full w-full object-contain"
                />
              </div>
              Lead Frog<span className="text-accent">.</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-secondary/70">
              Accelerated growth for brands that refuse to sit still. Lead
              generation, digital strategy, and analytics under one roof.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm uppercase tracking-[0.14em] text-accent">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-secondary/75">
                {col.links.map((link, i) => (
                  <li key={`${col.title}-${i}`}>
                    <Link
                      href={link.href}
                      className="hover:text-secondary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-heading text-sm uppercase tracking-[0.14em] text-accent">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-secondary/75">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="hover:text-secondary transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href="tel:+18005551234"
                  className="hover:text-secondary transition-colors"
                >
                  +1 (800) 555-1234
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse gap-4 border-t border-secondary/15 pt-6 text-xs text-secondary/55 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Lead Frog Marketing. All rights
            reserved.
          </p>
          <p className="italic font-heading text-secondary/70">
            Every pond needs a prince.
          </p>
        </div>
      </div>
    </footer>
  );
}
