import type { Metadata } from 'next';
import Link from 'next/link';
import PondScene from '@/components/PondScene';
import RevealOnScroll from '@/components/RevealOnScroll';
import ServicesGrid from '@/components/ServicesGrid';
import { ArrowIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Services | Lead Frog Marketing',
  description:
    'SEO, paid advertising, social, email automation, and CRM-driven lead nurturing — five disciplines working as one growth engine.',
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-x-hidden overflow-hidden">
        <div
          className="pointer-events-none absolute -top-32 right-[-8rem] h-[26rem] w-[26rem] rounded-full bg-alt-primary/20 blur-[110px] animate-water-shimmer"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/2 left-[-10rem] h-[22rem] w-[22rem] rounded-full bg-accent/20 blur-[100px] animate-water-shimmer"
          style={{ animationDelay: '1.5s' }}
          aria-hidden="true"
        />

        <PondScene />

        <div className="relative w-full max-w-[120rem] mx-auto px-6 md:px-8 pt-20 pb-6 md:pt-28 ">
          <RevealOnScroll className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-alt-primary font-paragraph">
              What We Do
            </p>
            <h1 className="z-99 mt-3 font-heading font-black text-5xl md:text-7xl text-primary leading-[0.95] tracking-[-0.01em]">
              Five disciplines, scattered like pads on a pond.
            </h1>
            <p className="mt-6 text-lg text-text/65 max-w-xl leading-relaxed">
              Each service stands on its own — but the real growth shows up
              where they overlap. Pick one, or let Lead Frog run the whole pond.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="relative w-full max-w-[120rem] mx-auto px-6 md:px-8 py-14 md:py-20">
        <ServicesGrid />
      </section>

      <section className="w-full max-w-[120rem] mx-auto px-6 md:px-8 pb-24 md:pb-32">
        <RevealOnScroll className="flex flex-col items-center gap-6 rounded-[2.5rem] bg-faded-primary/25 px-8 py-16 text-center">
          <h2 className="font-heading italic text-3xl md:text-4xl text-primary max-w-lg">
            Not sure which pad to start on? We&rsquo;ll map it out together.
          </h2>
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-2 overflow-hidden font-heading uppercase text-sm tracking-wider text-primary border-2 border-primary px-8 py-4 transition-colors duration-300 hover:text-secondary"
          >
            <span className="absolute inset-0 -z-10 -translate-x-full bg-primary transition-transform duration-500 group-hover:translate-x-0" />
            <span className="relative">Contact Us Today</span>
            <ArrowIcon className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </RevealOnScroll>
      </section>
    </>
  );
}
