"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowIcon, CloseIcon } from "@/components/icons";
import LilyPadBadge from "@/components/LilyPadBadge";
import type { Service } from "@/components/ServicesGrid";

export default function ServiceModal({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!service) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [service, onClose]);

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
            className="relative flex w-full max-w-2xl max-h-[85vh] flex-col overflow-hidden rounded-[2.5rem] border border-secondary/60 bg-secondary shadow-[0_40px_90px_-30px_rgba(2,83,116,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between px-8 pt-8 md:px-10 md:pt-10">
              <LilyPadBadge icon={service.icon} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-primary/15 text-primary transition-colors duration-200 hover:bg-primary/5"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-2 md:px-10">
              <h2
                id="service-modal-title"
                className="mt-6 font-heading text-2xl md:text-3xl text-primary"
              >
                {service.title}
              </h2>

              <p className="mt-4 text-text/70 leading-relaxed">
                {service.description}
              </p>

              <p className="mt-8 text-xs uppercase tracking-[0.2em] text-alt-primary font-paragraph">
                Key Benefits
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {service.benefits.map((benefit) => (
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
                {service.idealFor.map((item) => (
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
            </div>

            <div className="shrink-0 border-t border-primary/10 bg-secondary px-8 py-6 md:px-10">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-heading text-sm uppercase tracking-wider text-secondary transition-colors duration-300 hover:bg-alt-primary"
              >
                Start a Project
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
