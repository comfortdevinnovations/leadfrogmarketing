"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LOCKUP } from "@/components/brand";
import { useIntro } from "@/components/IntroProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { brandRevealed } = useIntro();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-secondary/80 backdrop-blur-xl border-b border-primary/10 shadow-[0_1px_0_0_rgba(11,58,68,0.06)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="w-full max-w-[120rem] mx-auto px-6 md:px-8 flex items-center justify-between h-20">
        {/* The intro splash flies its own copy of this lockup into place, so
            ours stays hidden until it has landed (see IntroSplash). */}
        <Link
          href="/"
          data-brand-lockup=""
          className={`group ${LOCKUP.root} transition-opacity duration-200 ${
            brandRevealed ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src="/lead-logo.png"
            alt="Lead Frog Marketing"
            // Matches the splash's copy so both resolve to one optimized URL
            // and the hand-off can't flash an unloaded image.
            width={200}
            height={200}
            priority
            className={`${LOCKUP.logo} transition-transform duration-300 group-hover:scale-105`}
          />
          <span className={LOCKUP.word}>
            Lead Frog<span className="text-accent">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10 font-paragraph text-sm uppercase tracking-[0.14em] text-text/70">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 transition-colors hover:text-primary ${
                  active ? "text-primary" : ""
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-accent transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-heading normal-case tracking-normal text-sm text-secondary bg-primary px-5 py-2.5 rounded-full hover:bg-alt-primary transition-colors duration-300"
          >
            Get Started
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="md:hidden relative h-10 w-10 grid place-items-center text-primary"
        >
          <span className="sr-only">Menu</span>
          <div className="relative h-4 w-6">
            <span
              className={`absolute left-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] w-full bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-[1.5px] w-full bg-current transition-all duration-300 ${
                open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </div>
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out bg-secondary/95 backdrop-blur-xl border-b border-primary/10 ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 py-4 font-paragraph uppercase tracking-[0.14em] text-sm text-text/70">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`py-3 border-b border-primary/5 last:border-none transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
