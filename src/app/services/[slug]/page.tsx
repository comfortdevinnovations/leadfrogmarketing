import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RevealOnScroll from "@/components/RevealOnScroll";
import LilyPadBadge from "@/components/LilyPadBadge";
import { ArrowIcon } from "@/components/icons";
import { getService, services } from "@/lib/services";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata(
  props: PageProps<"/services/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) return {};

  const fullTitle = `${service.title} | Lead Frog Marketing`;

  return {
    title: service.title,
    description: service.copy,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: fullTitle,
      description: service.copy,
      url: `${SITE_URL}/services/${service.slug}`,
      images: [{ url: service.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: service.copy,
      images: [service.image],
    },
  };
}

export default async function ServicePage(
  props: PageProps<"/services/[slug]">
) {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) notFound();

  const { icon: Icon, title, description, benefits, idealFor, image } =
    service;

  return (
    <article className="relative w-full max-w-[120rem] mx-auto px-6 md:px-8 pt-12 pb-24 md:pt-16 md:pb-32">
      <nav aria-label="Breadcrumb" className="text-xs text-text/50">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/services" className="hover:text-primary transition-colors">
              Services
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-text/70">{title}</li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_1.1fr] items-start">
        <RevealOnScroll>
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-[2.5rem] border border-secondary/60 shadow-[0_30px_70px_-35px_rgba(2,83,116,0.45)]">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent"
              aria-hidden="true"
            />
            <div className="absolute left-6 top-6">
              <LilyPadBadge icon={Icon} />
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <h1 className="font-heading font-black text-4xl md:text-5xl text-primary leading-[0.95] tracking-[-0.01em]">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text/70">
            {description}
          </p>

          <p className="mt-10 text-xs uppercase tracking-[0.2em] text-alt-primary font-paragraph">
            Key Benefits
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2 text-sm leading-relaxed text-text/70"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden="true"
                />
                {benefit}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-alt-primary font-paragraph">
            Ideal For
          </p>
          <ul className="mt-3 grid gap-2">
            {idealFor.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm leading-relaxed text-text/70"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-alt-primary"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-4">
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
              All Services
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </article>
  );
}
