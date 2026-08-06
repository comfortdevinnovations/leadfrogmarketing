"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function StatCounter({
  value,
  prefix = "",
  suffix = "",
  label,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 30, stiffness: 60 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => setDisplay(Math.round(latest)));
  }, [spring]);

  return (
    <div
      ref={ref}
      className="group relative rounded-[2rem] border border-secondary/50 bg-secondary/60 p-8 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(2,83,116,0.35)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[2rem] before:border-t before:border-white/60 before:content-['']"
    >
      <div className="absolute -bottom-3 left-1/2 h-6 w-2/3 -translate-x-1/2 rounded-full bg-primary/10 blur-lg" />
      <p className="font-heading italic text-5xl md:text-6xl text-primary">
        {prefix}
        {display.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-3 font-paragraph text-sm uppercase tracking-[0.16em] text-text/60">
        {label}
      </p>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="mt-5 block h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-accent via-accent to-transparent"
      />
    </div>
  );
}
