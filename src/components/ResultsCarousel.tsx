'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const SLIDES = [
  {
    src: '/results-carousel-1.jpg',
    alt: 'A growth team collaborating across laptops during a strategy session',
  },
  {
    src: '/results-carousel-2.jpg',
    alt: 'A strategist walking the team through campaign milestones on a flip chart',
  },
  {
    src: '/results-carousel-3.jpg',
    alt: 'The Lead Frog team planning a campaign around a whiteboard',
  },
];

const SLIDE_DURATION = 4500;

export default function ResultsCarousel({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-[2.5rem] border border-secondary/20 shadow-[0_40px_90px_-40px_rgba(1,20,28,0.6)] ${className ?? ''}`}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={SLIDES[index].src}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[index].src}
            alt={SLIDES[index].alt}
            fill
            sizes="(min-width: 1024px) 32rem, 90vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div
        className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-alt-primary/25 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div className="absolute inset-x-6 bottom-6 flex items-center justify-between">
        <span className="font-heading italic text-sm text-secondary/90">
          Inside the work
        </span>
        <div className="flex gap-2">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-accent' : 'w-1.5 bg-secondary/50 hover:bg-secondary/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
