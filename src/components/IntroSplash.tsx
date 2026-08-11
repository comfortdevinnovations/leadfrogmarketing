'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LilyPadIcon, RippleIcon } from '@/components/icons';
import { useIntro } from '@/components/IntroProvider';
import { BRAND_HEAD, BRAND_TAIL, LOCKUP } from '@/components/brand';

const FULL_NAME = BRAND_HEAD + BRAND_TAIL;

/* ---- timeline (ms) ------------------------------------------------------ */
const LEAD_IN = 240; // still water before the first character
const TYPE_SPEED = 48; // per character
const AFTER_TYPE = 260; // beat once the name is finished
const LOGO_HOLD = 640; // logo sits in the water before take-off
const FLIGHT = 1150; // lockup travels to the header slot
const HANDOFF = 70; // header lockup fades in just before we unmount

/* ---- sizing ------------------------------------------------------------- */
const MAX_SCALE = 3.4; // never blow the wordmark up past this
const MIN_SCALE = 1.12;
const VERTICAL_ANCHOR = 0.46; // where the lockup rests, as a share of viewport height

type Phase = 'measuring' | 'typing' | 'logo' | 'flying' | 'done';

/**
 * Where the splash lockup starts (big, centred) relative to where it ends —
 * the header's own lockup. `left`/`top` pin the element straight onto the
 * header slot, so the flight is just a transform back to identity.
 */
type Layout = {
  left: number;
  top: number;
  scale: number;
  tx: number;
  ty: number;
};

/* ---- pond dressing ------------------------------------------------------ */

type SplashPad = {
  left: string;
  top: string;
  size: string;
  rotate: string;
  color: string;
  duration: string;
  delay: string;
  flower?: boolean;
  exit: { x: number; y: number };
  smallScreen?: boolean;
};

// Pads hug the edges so they never fight the wordmark for space. Sizes are
// viewport-relative and capped, which keeps the arrangement honest on phones.
const SPLASH_PADS: SplashPad[] = [
  {
    left: '6%',
    top: '16%',
    size: 'min(26vw, 150px)',
    rotate: 'rotate-[16deg]',
    color: 'text-alt-primary/70',
    duration: '11s',
    delay: '0s',
    flower: true,
    exit: { x: -150, y: -110 },
    smallScreen: true,
  },
  {
    left: '84%',
    top: '12%',
    size: 'min(22vw, 118px)',
    rotate: '-rotate-[24deg]',
    color: 'text-[#3f8a63]/65',
    duration: '13s',
    delay: '1.4s',
    exit: { x: 170, y: -120 },
    smallScreen: true,
  },
  {
    left: '15%',
    top: '76%',
    size: 'min(24vw, 132px)',
    rotate: 'rotate-[44deg]',
    color: 'text-[#2c5c42]/60',
    duration: '10s',
    delay: '0.7s',
    exit: { x: -140, y: 140 },
    smallScreen: true,
  },
  {
    left: '78%',
    top: '74%',
    size: 'min(20vw, 104px)',
    rotate: '-rotate-[12deg]',
    color: 'text-faded-primary',
    duration: '12s',
    delay: '2.2s',
    flower: true,
    exit: { x: 150, y: 150 },
    smallScreen: true,
  },
  {
    left: '43%',
    top: '6%',
    size: 'min(14vw, 78px)',
    rotate: 'rotate-[60deg]',
    color: 'text-[#6fae82]/55',
    duration: '9s',
    delay: '1.1s',
    exit: { x: 20, y: -150 },
  },
  {
    left: '52%',
    top: '84%',
    size: 'min(16vw, 88px)',
    rotate: '-rotate-[38deg]',
    color: 'text-[#83bfa0]/55',
    duration: '14s',
    delay: '0.3s',
    flower: true,
    exit: { x: 30, y: 160 },
  },
  {
    left: '2%',
    top: '48%',
    size: 'min(15vw, 84px)',
    rotate: 'rotate-[28deg]',
    color: 'text-[#1f4d38]/60',
    duration: '12.5s',
    delay: '1.9s',
    exit: { x: -170, y: 10 },
  },
  {
    left: '92%',
    top: '44%',
    size: 'min(13vw, 70px)',
    rotate: '-rotate-[50deg]',
    color: 'text-[#4caf7d]/55',
    duration: '10.5s',
    delay: '0.5s',
    exit: { x: 180, y: 0 },
  },
];

const RIPPLE_LIFE = 2600; // matches .animate-ripple-once
const RIPPLE_GAP = [220, 620] as const;

type Ripple = { id: number; left: string; top: string; size: number };

/** Random rings blooming across the whole surface while the splash is up. */
function useSurfaceRipples(active: boolean) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    if (!active) return;
    let alive = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const burst = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < burst; i++) {
        const id = nextId.current++;
        setRipples((prev) => [
          ...prev,
          {
            id,
            left: `${6 + Math.random() * 88}%`,
            top: `${8 + Math.random() * 84}%`,
            size: 70 + Math.random() * 150,
          },
        ]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, RIPPLE_LIFE);
      }

      const [min, max] = RIPPLE_GAP;
      timeoutId = setTimeout(() => {
        if (alive) tick();
      }, min + Math.random() * (max - min));
    };

    timeoutId = setTimeout(tick, 200);
    return () => {
      alive = false;
      clearTimeout(timeoutId);
    };
  }, [active]);

  return ripples;
}

export default function IntroSplash() {
  const { revealBrand } = useIntro();
  const skip = useReducedMotion() === true;
  const [phase, setPhase] = useState<Phase>('measuring');
  const [layout, setLayout] = useState<Layout | null>(null);
  const [typed, setTyped] = useState('');
  const lockupRef = useRef<HTMLDivElement>(null);

  const flying = phase === 'flying';
  const active = phase !== 'done' && !skip;
  const ripples = useSurfaceRipples(active && !flying);

  /* Measure the header's lockup and work out the centred starting pose. */
  const measure = useCallback(() => {
    const target = document.querySelector<HTMLElement>('[data-brand-lockup]');
    const node = lockupRef.current;
    if (!target || !node) return;

    const rect = target.getBoundingClientRect();
    // offsetWidth/Height are layout metrics, so they ignore our own transform.
    const width = node.offsetWidth;
    const height = node.offsetHeight || rect.height;
    if (!width || !height) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const fill = vw < 640 ? 0.9 : 0.78;
    const scale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, (vw * fill) / width)
    );

    setLayout({
      left: rect.left,
      top: rect.top,
      scale,
      // transform-origin is left/center, so the element's left-center point is
      // what we're placing: centre the scaled box horizontally, anchor high.
      tx: vw / 2 - (width * scale) / 2 - rect.left,
      ty: vh * VERTICAL_ANCHOR - (rect.top + height / 2),
    });
  }, []);

  /* Reduced motion gets no splash at all — hand the lockup straight over. */
  useEffect(() => {
    if (skip) revealBrand();
  }, [skip, revealBrand]);

  useEffect(() => {
    if (skip) return;
    measure();
    // Fraunces changes the wordmark's width once it swaps in.
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, skip]);

  /* Freeze the page behind the splash without letting the layout jump. */
  useEffect(() => {
    if (!active) return;
    const { body } = document;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [active]);

  /* Once we know where things go, start typing. */
  useEffect(() => {
    if (phase !== 'measuring' || !layout) return;
    const id = setTimeout(() => setPhase('typing'), LEAD_IN);
    return () => clearTimeout(id);
  }, [phase, layout]);

  /* Failsafe: if the header slot never resolves, don't trap the visitor
     behind an overlay that can't start. */
  useEffect(() => {
    if (skip || phase !== 'measuring') return;
    const id = setTimeout(() => {
      revealBrand();
      setPhase('done');
    }, 2500);
    return () => clearTimeout(id);
  }, [skip, phase, revealBrand]);

  useEffect(() => {
    if (phase !== 'typing') return;
    const id = setInterval(() => {
      setTyped((prev) => {
        if (prev.length >= FULL_NAME.length) return prev;
        return FULL_NAME.slice(0, prev.length + 1);
      });
    }, TYPE_SPEED);
    return () => clearInterval(id);
  }, [phase]);

  /* Name finished → drop the logo → fly the lockup home. */
  useEffect(() => {
    if (phase !== 'typing' || typed.length < FULL_NAME.length) return;
    const id = setTimeout(() => setPhase('logo'), AFTER_TYPE);
    return () => clearTimeout(id);
  }, [phase, typed]);

  useEffect(() => {
    if (phase !== 'logo') return;
    const id = setTimeout(() => setPhase('flying'), LOGO_HOLD);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'flying') return;
    const handoff = setTimeout(revealBrand, FLIGHT - HANDOFF);
    const finish = setTimeout(() => setPhase('done'), FLIGHT + 80);
    return () => {
      clearTimeout(handoff);
      clearTimeout(finish);
    };
  }, [phase, revealBrand]);

  if (!active) return null;

  const showLogo = phase === 'logo' || flying;
  const head = typed.slice(0, Math.min(typed.length, BRAND_HEAD.length));
  const tail = typed.slice(BRAND_HEAD.length);

  return (
    <div data-intro-overlay="" className="fixed inset-0 z-[100]">
      {/* ---- the pond ---- */}
      <motion.div
        className="absolute inset-0 overflow-hidden bg-secondary"
        animate={{ opacity: flying ? 0 : 1 }}
        transition={{ duration: FLIGHT / 1000, ease: [0.4, 0, 0.2, 1] }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(115% 85% at 50% 44%, rgba(183,206,197,0.62) 0%, rgba(2,83,116,0.12) 46%, rgba(255,255,255,0) 78%)',
          }}
        />
        <div
          className="absolute inset-0 animate-water-shimmer"
          style={{
            background:
              'radial-gradient(70% 55% at 50% 46%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%)',
          }}
        />
        <div className="absolute inset-0 opacity-[0.05] grain-overlay" />

        {/* Each of these nests "centre on the point" inside its own element:
            the ripple keyframes and framer both write `transform`, which would
            otherwise wipe out a -translate-x-1/2 sitting on the same node. */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: ripple.left,
              top: ripple.top,
              width: ripple.size,
              height: ripple.size,
            }}
          >
            <div className="h-full w-full animate-ripple-once">
              <RippleIcon className="h-full w-full text-primary/25" />
            </div>
          </div>
        ))}

        {SPLASH_PADS.map((pad, i) => (
          <div
            key={i}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${
              pad.smallScreen ? '' : 'hidden sm:block'
            }`}
            style={{ left: pad.left, top: pad.top }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.55 }}
              animate={
                flying
                  ? { opacity: 0, scale: 0.5, x: pad.exit.x, y: pad.exit.y }
                  : { opacity: 1, scale: 1, x: 0, y: 0 }
              }
              transition={
                flying
                  ? { duration: FLIGHT / 1000, ease: [0.4, 0, 0.2, 1] }
                  : { duration: 0.9, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }
              }
            >
              <div
                style={{
                  width: pad.size,
                  height: pad.size,
                  animation: `lily-drift ${pad.duration} ease-in-out infinite`,
                  animationDelay: pad.delay,
                }}
              >
                <LilyPadIcon
                  withFlower={pad.flower}
                  className={`h-full w-full ${pad.rotate} ${pad.color}`}
                />
              </div>
            </motion.div>
          </div>
        ))}
      </motion.div>

      {/* ---- the lockup: pinned to the header slot, transformed out to the
              middle of the pond, then released back to identity ---- */}
      <motion.div
        ref={lockupRef}
        className={`${LOCKUP.root} pointer-events-none fixed z-10`}
        style={{
          left: layout?.left ?? 0,
          top: layout?.top ?? 0,
          transformOrigin: 'left center',
        }}
        initial={false}
        animate={
          !layout
            ? { opacity: 0 }
            : flying
              ? {
                  opacity: 1,
                  x: [layout.tx, layout.tx, 0],
                  y: [layout.ty, layout.ty - 28, 0],
                  scale: [layout.scale, layout.scale * 1.07, 1],
                }
              : {
                  opacity: 1,
                  x: layout.tx,
                  y: layout.ty,
                  scale: layout.scale,
                }
        }
        transition={
          flying
            ? {
                duration: FLIGHT / 1000,
                times: [0, 0.2, 1],
                ease: [
                  [0.34, 0, 0.64, 1],
                  [0.72, 0, 0.16, 1],
                ],
              }
            : { duration: 0 }
        }
      >
        {/* logo slot — a pulsing ring holds the space, then the logo drops in */}
        <div className="relative h-10 w-10 shrink-0">
          {!showLogo && (
            <div className="absolute inset-[-35%] animate-ripple-out">
              <RippleIcon className="h-full w-full text-primary/35" />
            </div>
          )}
          {showLogo && (
            <>
              <div className="absolute inset-[-60%] animate-drop-splash">
                <RippleIcon className="h-full w-full text-primary/45" />
              </div>
              <motion.div
                className="absolute inset-0"
                initial={{ y: -70, scale: 1.7, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 16,
                  mass: 0.8,
                }}
              >
                <Image
                  src="/lead-logo.png"
                  alt=""
                  width={200}
                  height={200}
                  priority
                  className={LOCKUP.logo}
                />
              </motion.div>
            </>
          )}
        </div>

        {/* wordmark — full string reserves the width so nothing reflows as it
            types, as the dot appears, or as "Marketing" dissolves */}
        <span className={`${LOCKUP.word} relative block`}>
          <span className="invisible whitespace-pre">{FULL_NAME}</span>
          <span className="absolute left-0 top-0 whitespace-pre">
            {head}
            {/* zero-width so the dot lands exactly where the header's does */}
            <span className="inline-block w-0">
              <motion.span
                className="text-accent"
                initial={{ opacity: 0 }}
                animate={{ opacity: flying ? 1 : 0 }}
                transition={{ duration: 0.35, delay: flying ? 0.28 : 0 }}
              >
                .
              </motion.span>
            </span>
            <motion.span
              className="inline-block whitespace-pre"
              animate={{
                opacity: flying ? 0 : 1,
                filter: flying ? 'blur(7px)' : 'blur(0px)',
              }}
              transition={{ duration: 0.4, ease: [0.4, 0, 1, 1] }}
            >
              {tail}
            </motion.span>
            {!flying && (
              <span className="ml-[0.09em] inline-block h-[0.92em] w-[0.07em] translate-y-[0.09em] animate-caret bg-accent align-middle" />
            )}
          </span>
        </span>
      </motion.div>
    </div>
  );
}
