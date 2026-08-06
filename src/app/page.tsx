import Image from 'next/image';
import Link from 'next/link';
import RevealOnScroll from '@/components/RevealOnScroll';
import StatCounter from '@/components/StatCounter';
import {
  AnalyticsIcon,
  ArrowIcon,
  LeadGenIcon,
  StrategyIcon,
} from '@/components/icons';

const expertise = [
  {
    icon: LeadGenIcon,
    title: 'Lead Generation',
    copy: 'Full-funnel campaigns engineered to fill your pipeline with buyers who are ready to talk, not just browse.',
  },
  {
    icon: StrategyIcon,
    title: 'Digital Strategy',
    copy: 'A roadmap built around your market position, not a generic playbook — channel mix, messaging, and pacing tailored to you.',
  },
  {
    icon: AnalyticsIcon,
    title: 'Analytics',
    copy: 'Clear reporting that ties every dollar spent to revenue generated, so decisions are made on evidence, not instinct.',
  },
];

const whyPartner = [
  {
    title: 'Data-driven, always',
    copy: 'Every recommendation is backed by performance data, not a hunch.',
  },
  {
    title: 'One dedicated team',
    copy: 'No hand-offs, no call centers — the strategists you meet are the ones doing the work.',
  },
  {
    title: 'Radical transparency',
    copy: 'Live dashboards and plain-English reporting, so you always know where growth is coming from.',
  },
  {
    title: 'Retention we earn',
    copy: '98% of clients stay year over year because the results keep compounding.',
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-alt-primary/25 blur-[110px] animate-water-shimmer"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-10 right-[-6rem] h-[24rem] w-[24rem] rounded-full bg-accent/25 blur-[100px] animate-water-shimmer"
          style={{ animationDelay: '1.5s' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05] grain-overlay"
          aria-hidden="true"
        />

        <div className="relative w-full max-w-[120rem] mx-auto px-6 md:px-8 pt-20 pb-24 md:pt-28 md:pb-32 grid gap-16 lg:grid-cols-[1.15fr_0.85fr] items-center">
          <div>
            <RevealOnScroll>
              <span className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-alt-primary font-paragraph">
                <span className="h-px w-10 bg-accent" aria-hidden="true" />
                Lead Generation &middot; Strategy &middot; Analytics
              </span>
            </RevealOnScroll>

            <h1 className="font-heading font-black uppercase text-6xl md:text-8xl lg:text-[7.5rem] leading-[0.86] tracking-[-0.02em] text-primary mb-8 md:mb-12 mt-6">
              <RevealOnScroll delay={0.05}>
                <span className="block">Accelerated</span>
              </RevealOnScroll>
              <RevealOnScroll delay={0.15}>
                <span className="block text-alt-primary">Growth</span>
              </RevealOnScroll>
            </h1>

            <RevealOnScroll delay={0.25} className="max-w-xl">
              <p className="text-lg leading-relaxed text-text/70">
                Lead Frog is the{' '}
                <span className="relative inline-block whitespace-nowrap rounded-[0.9rem] bg-accent px-3 py-1 text-text shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_6px_14px_-6px_rgba(2,83,116,0.4)]">
                  trusted partner
                </span>{' '}
                growth teams call when pipeline needs to move — and stay moved.
              </p>
            </RevealOnScroll>

            <RevealOnScroll
              delay={0.35}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-heading text-sm uppercase tracking-wider text-secondary transition-colors duration-300 hover:bg-alt-primary"
              >
                Start a Project
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 px-7 py-4 font-heading text-sm uppercase tracking-wider text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/5"
              >
                View Services
              </Link>
            </RevealOnScroll>
          </div>

          <RevealOnScroll
            delay={0.2}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="relative aspect-square rounded-[3rem] border border-secondary/60 bg-gradient-to-br from-secondary/70 via-faded-primary/40 to-alt-primary/20 backdrop-blur-2xl shadow-[0_40px_90px_-40px_rgba(2,83,116,0.5)] overflow-hidden">
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.55),transparent_60%)] animate-water-shimmer"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 grid place-items-center"
                aria-hidden="true"
              >
                <span className="absolute h-16 w-16 rounded-full border-2 border-primary/40 animate-ripple-out" />
                <span
                  className="absolute h-16 w-16 rounded-full border-2 border-alt-primary/35 animate-ripple-out"
                  style={{ animationDelay: '1.05s' }}
                />
                <span
                  className="absolute h-16 w-16 rounded-full border-2 border-accent/50 animate-ripple-out"
                  style={{ animationDelay: '2.1s' }}
                />
              </div>
              <div className="absolute inset-x-0 top-0 h-px bg-white/70" />
              <div className="absolute left-1/2 top-8 grid h-20 w-20 -translate-x-1/2 place-items-center rounded-full border border-white/60 bg-secondary/80 shadow-[0_10px_30px_-10px_rgba(2,83,116,0.4)] backdrop-blur-xl">
                <Image
                  src="/green-logo.png"
                  alt="Lead Frog Marketing"
                  width={64}
                  height={64}
                  className="h-14 w-14 object-contain"
                />
              </div>
              <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/50 bg-secondary/70 p-4 backdrop-blur-xl">
                <p className="font-heading italic text-2xl text-primary">
                  $210M+
                </p>
                <p className="text-xs uppercase tracking-[0.14em] text-text/60">
                  Lead value created
                </p>
              </div>
            </div>
            <div
              className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-accent/20 blur-2xl animate-water-shimmer"
              aria-hidden="true"
            />
          </RevealOnScroll>
        </div>
      </section>

      {/* Proven Results */}
      <section className="relative w-full max-w-[120rem] mx-auto px-6 md:px-8 py-20 md:py-28">
        <RevealOnScroll className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-alt-primary font-paragraph">
            Proven Results
          </p>
          <h2 className="mt-3 font-heading italic text-4xl md:text-5xl text-primary">
            Results that speak, and a{' '}
            <span className="not-italic rounded-xl bg-accent px-2.5 py-0.5">
              trusted partner
            </span>{' '}
            that sticks around.
          </h2>
        </RevealOnScroll>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 max-w-3xl">
          <RevealOnScroll delay={0.1}>
            <StatCounter
              value={210}
              prefix="$"
              suffix="M"
              label="Lead Value Created"
            />
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <StatCounter value={98} suffix="%" label="Client Retention" />
          </RevealOnScroll>
        </div>
      </section>

      {/* Our Expertise */}
      <section className="relative bg-faded-primary/25 py-20 md:py-28 overflow-hidden">
        <div
          className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-alt-primary/15 blur-[100px] animate-water-shimmer"
          aria-hidden="true"
        />
        <div className="relative w-full max-w-[120rem] mx-auto px-6 md:px-8">
          <RevealOnScroll className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-alt-primary font-paragraph">
              Our Expertise
            </p>
            <h2 className="mt-3 font-heading italic text-4xl md:text-5xl text-primary">
              Three disciplines. One compounding growth engine.
            </h2>
          </RevealOnScroll>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {expertise.map(({ icon: Icon, title, copy }, i) => (
              <RevealOnScroll key={title} delay={i * 0.12}>
                <div className="group relative h-full rounded-[2rem] bg-secondary p-8 shadow-[6px_6px_16px_rgba(2,83,116,0.12),-6px_-6px_16px_rgba(255,255,255,0.9)] transition-transform duration-300 hover:-translate-y-1.5">
                  <span className="absolute right-7 top-7 font-heading italic text-3xl text-primary/10">
                    0{i + 1}
                  </span>
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-alt-primary text-secondary shadow-[inset_0_2px_3px_rgba(255,255,255,0.35),0_10px_18px_-8px_rgba(25,87,64,0.6)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-heading text-xl text-primary">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text/65">
                    {copy}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner with Lead Frog */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <Image
          src="/green-logo.png"
          alt=""
          width={800}
          height={800}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.05]"
        />
        <div className="relative w-full max-w-[120rem] mx-auto px-6 md:px-8 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] items-start">
          <RevealOnScroll>
            <p className="text-xs uppercase tracking-[0.2em] text-alt-primary font-paragraph">
              Why Partner With Lead Frog
            </p>
            <h2 className="mt-3 font-heading italic text-4xl md:text-5xl text-primary max-w-md">
              Because growth partners should feel like an extension of your
              team.
            </h2>
            <p className="mt-6 max-w-md text-text/65 leading-relaxed">
              We keep client rosters intentionally small so every account gets
              senior attention — the kind that catches problems before they cost
              you pipeline.
            </p>
          </RevealOnScroll>

          <div className="grid gap-5 sm:grid-cols-2">
            {whyPartner.map((item, i) => (
              <RevealOnScroll key={item.title} delay={i * 0.1}>
                <div className="relative h-full rounded-2xl border border-primary/10 bg-secondary/70 backdrop-blur-xl p-6 overflow-hidden">
                  <span className="absolute right-2 top-2 font-heading font-black text-5xl text-primary/6">
                    0{i + 1}
                  </span>
                  <div className="h-1 w-8 bg-accent" aria-hidden="true" />
                  <h3 className="mt-4 font-heading text-lg text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text/65">
                    {item.copy}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="w-full max-w-[120rem] mx-auto px-6 md:px-8 pb-24">
        <RevealOnScroll>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-14 md:px-16 md:py-20 text-center">
            <div
              className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-alt-primary/50 blur-3xl animate-water-shimmer"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-accent/25 blur-3xl animate-water-shimmer"
              style={{ animationDelay: '1.2s' }}
              aria-hidden="true"
            />
            <h2 className="relative font-heading italic text-4xl md:text-5xl text-secondary max-w-2xl mx-auto">
              Ready to make growth the least of your worries?
            </h2>
            <p className="relative mt-4 text-secondary/70 max-w-lg mx-auto">
              Tell us where the pipeline is stuck. We&rsquo;ll show you where
              the leaks are and how fast we can close them.
            </p>
            <Link
              href="/contact"
              className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-heading text-sm uppercase tracking-wider text-text transition-transform duration-300 hover:scale-[1.03]"
            >
              Contact Us Today
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}
