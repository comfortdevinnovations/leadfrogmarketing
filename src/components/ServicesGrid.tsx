import Image from "next/image";
import Link from "next/link";
import LilyPadBadge from "@/components/LilyPadBadge";
import RevealOnScroll from "@/components/RevealOnScroll";
import { ArrowIcon } from "@/components/icons";
import { services } from "@/lib/services";

export default function ServicesGrid() {
  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => {
        const { icon: Icon, slug, title, copy, radius, image } = service;
        return (
          <RevealOnScroll
            key={slug}
            delay={i * 0.08}
            className={i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}
          >
            <Link
              href={`/services/${slug}`}
              className={`group relative flex h-full flex-col ${radius} border border-secondary/60 bg-gradient-to-br from-secondary to-faded-primary/30 p-8 shadow-[0_20px_45px_-25px_rgba(2,83,116,0.35)] transition-shadow duration-500 hover:shadow-[0_30px_60px_-25px_rgba(2,83,116,0.45)] hover:[animation-play-state:paused] focus-visible:[animation-play-state:paused] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 animate-lily-drift`}
              style={{ animationDelay: `${i * 0.8}s` }}
            >
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-5 transition-opacity duration-500 group-hover:opacity-10"
                aria-hidden="true"
              >
                <Image src={image} alt="" fill sizes="33vw" className="object-cover" />
              </div>
              <span
                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, rgba(2,83,116,0.12), transparent 60%)",
                }}
                aria-hidden="true"
              />
              <LilyPadBadge icon={Icon} className="relative h-14 w-14" />
              <h2 className="relative mt-6 font-heading text-xl text-primary">
                {title}
              </h2>
              <p className="relative mt-3 text-sm leading-relaxed text-text/65">
                {copy}
              </p>
              <span className="group/btn relative mt-6 inline-flex w-fit items-center gap-2 font-heading text-sm uppercase tracking-wider text-primary transition-colors duration-300 group-hover:text-alt-primary">
                Learn More
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </RevealOnScroll>
        );
      })}
    </div>
  );
}
