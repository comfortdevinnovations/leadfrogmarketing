import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="relative w-full max-w-[120rem] mx-auto px-6 md:px-8 py-32 md:py-40 text-center overflow-hidden">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-alt-primary/15 blur-[110px] animate-water-shimmer"
        aria-hidden="true"
      />
      <p className="relative text-xs uppercase tracking-[0.2em] text-alt-primary font-paragraph">
        404
      </p>
      <h1 className="relative mt-3 font-heading font-black text-5xl md:text-6xl text-primary leading-[0.95] tracking-[-0.01em]">
        This pad&rsquo;s gone missing.
      </h1>
      <p className="relative mt-6 max-w-md mx-auto text-text/65 leading-relaxed">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or may have
        moved. Let&rsquo;s get you back on solid ground.
      </p>
      <Link
        href="/"
        className="group relative mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-heading text-sm uppercase tracking-wider text-secondary transition-colors duration-300 hover:bg-alt-primary"
      >
        Back to Home
        <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </section>
  );
}
