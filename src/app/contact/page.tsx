import type { Metadata } from "next";
import RevealOnScroll from "@/components/RevealOnScroll";
import ContactForm from "@/components/ContactForm";
import { EmailIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact | Lead Frog Marketing",
  description:
    "Tell Lead Frog Marketing about your growth goals and a strategist will follow up within one business day.",
};

export default function ContactPage() {
  return (
    <section className="relative w-full max-w-[120rem] mx-auto pt-32 pb-24 px-8 overflow-hidden">
      <div
        className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-alt-primary/15 blur-[110px] animate-water-shimmer"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-accent/15 blur-[100px] animate-water-shimmer"
        style={{ animationDelay: "1.5s" }}
        aria-hidden="true"
      />

      <div className="relative grid gap-14 lg:grid-cols-[0.85fr_1.15fr] items-start">
        <RevealOnScroll>
          <p className="text-xs uppercase tracking-[0.2em] text-alt-primary font-paragraph">
            Get In Touch
          </p>
          <h1 className="mt-3 font-heading font-black text-5xl md:text-6xl text-primary leading-[0.95] tracking-[-0.01em]">
            Let&rsquo;s get your pipeline moving.
          </h1>
          <p className="mt-6 max-w-md text-text/65 leading-relaxed">
            Whether you need one service or the whole engine running, tell us
            where things stand today. We&rsquo;ll follow up within one
            business day with next steps.
          </p>

          <div className="mt-10 space-y-4 text-sm text-text/70">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-alt-primary/10 text-alt-primary">
                <EmailIcon className="h-4 w-4" />
              </span>
              <a
                href="mailto:hello@leadfrogmarketing.com"
                className="hover:text-primary transition-colors"
              >
                hello@leadfrogmarketing.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-alt-primary/10 text-alt-primary">
                <PhoneIcon className="h-4 w-4" />
              </span>
              <a
                href="tel:+18005551234"
                className="hover:text-primary transition-colors"
              >
                +1 (800) 555-1234
              </a>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.15}>
          <div className="relative rounded-[2.5rem] border border-secondary/60 bg-secondary/70 backdrop-blur-2xl p-8 md:p-12 shadow-[0_40px_90px_-40px_rgba(2,83,116,0.4)]">
            <div className="absolute inset-x-8 top-0 h-px bg-white/70" aria-hidden="true" />
            <ContactForm />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
