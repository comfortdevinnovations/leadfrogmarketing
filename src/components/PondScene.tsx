'use client';

import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  motionValue,
  type MotionValue,
  type PanInfo,
} from 'framer-motion';
import { LilyPadIcon, RippleIcon } from '@/components/icons';

// Heavy, low-stiffness spring so the pad lags behind the pointer while
// dragged, like it's pushing through water.
const DRAG_SPRING = {
  type: 'spring',
  stiffness: 24,
  damping: 12,
  mass: 1.4,
} as const;
// Noticeably snappier spring for the trip back to center, so it doesn't crawl.
const RETURN_SPRING = {
  type: 'spring',
  stiffness: 10,
  damping: 14,
  mass: 1,
} as const;
// Quick, firm nudge used when a pad gets shoved aside by a neighbor.
const PUSH_SPRING = {
  type: 'spring',
  stiffness: 210,
  damping: 20,
  mass: 0.6,
} as const;
const MAX_DRIFT = 350; // px a pad can be pulled from its resting spot
const RETURN_DELAY = 700; // ms it lingers in place before drifting back
const COLLISION_PADDING = 6; // px of breathing room kept between pad edges

type PadConfig = {
  restCenter: { x: number; y: number }; // px offset from pond center
  radius: number; // px
  rotate: string;
  color: string;
  driftDuration: string;
  driftDelay: string;
  withFlower?: boolean;
};

const PAD_CONFIGS: PadConfig[] = [
  {
    restCenter: { x: -52, y: -68 },
    radius: 40,
    rotate: 'rotate-[15deg]',
    color: 'text-alt-primary/85 drop-shadow-[0_8px_14px_rgba(25,87,64,0.3)]',
    driftDuration: '9s',
    driftDelay: '1.2s',
    withFlower: true,
  },
  {
    restCenter: { x: 20, y: -12 },
    radius: 22,
    rotate: '-rotate-[22deg]',
    color: 'text-[#3f8a63]/80',
    driftDuration: '13s',
    driftDelay: '3s',
  },
  {
    restCenter: { x: -12, y: 28 },
    radius: 14,
    rotate: 'rotate-[48deg]',
    color: 'text-faded-primary',
    driftDuration: '10s',
    driftDelay: '0.6s',
    withFlower: true,
  },
  {
    restCenter: { x: 58, y: 38 },
    radius: 28,
    rotate: '-rotate-[8deg]',
    color: 'text-[#2c5c42]/85',
    driftDuration: '11s',
    driftDelay: '2.4s',
  },
  {
    restCenter: { x: -72, y: 12 },
    radius: 18,
    rotate: 'rotate-[33deg]',
    color: 'text-[#6fae82]/75',
    driftDuration: '8s',
    driftDelay: '1.8s',
    withFlower: true,
  },
  {
    restCenter: { x: 6, y: 72 },
    radius: 17,
    rotate: '-rotate-[40deg]',
    color: 'text-[#83bfa0]/70',
    driftDuration: '14s',
    driftDelay: '0.2s',
  },
  {
    restCenter: { x: -115, y: -20 },
    radius: 24,
    rotate: 'rotate-[60deg]',
    color: 'text-[#1f4d38]/85',
    driftDuration: '12s',
    driftDelay: '0.9s',
  },
  {
    restCenter: { x: 95, y: -45 },
    radius: 12,
    rotate: '-rotate-[15deg]',
    color: 'text-[#4caf7d]/75',
    driftDuration: '9.5s',
    driftDelay: '2.1s',
  },
  {
    restCenter: { x: -10, y: -140 },
    radius: 30,
    rotate: 'rotate-[5deg]',
    color: 'text-[#2f6b4f]/90',
    driftDuration: '15s',
    driftDelay: '0.4s',
    withFlower: true,
  },
  {
    restCenter: { x: 100, y: 90 },
    radius: 15,
    rotate: '-rotate-[35deg]',
    color: 'text-[#9ecfb0]/70',
    driftDuration: '10.5s',
    driftDelay: '1.5s',
    withFlower: true,
  },
  {
    restCenter: { x: -95, y: 75 },
    radius: 20,
    rotate: 'rotate-[27deg]',
    color: 'text-[#5c9c78]/80',
    driftDuration: '13.5s',
    driftDelay: '2.8s',
  },
  {
    restCenter: { x: 35, y: -90 },
    radius: 10,
    rotate: '-rotate-[50deg]',
    color: 'text-faded-primary/90',
    driftDuration: '8.5s',
    driftDelay: '0.1s',
  },
];

type PadState = PadConfig & {
  x: MotionValue<number>;
  y: MotionValue<number>;
  dragStart: { x: number; y: number };
  returnTimeout: ReturnType<typeof setTimeout> | null;
};

function createPads(): PadState[] {
  return PAD_CONFIGS.map((cfg) => ({
    ...cfg,
    x: motionValue(0),
    y: motionValue(0),
    dragStart: { x: 0, y: 0 },
    returnTimeout: null,
  }));
}

function scheduleReturn(pad: PadState) {
  if (pad.returnTimeout) clearTimeout(pad.returnTimeout);
  pad.returnTimeout = setTimeout(() => {
    animate(pad.x, 0, RETURN_SPRING);
    animate(pad.y, 0, RETURN_SPRING);
  }, RETURN_DELAY);
}

// Pushes any pad overlapping `movedAbs` out of the way, then checks whether
// that push causes it to overlap a third pad, and so on.
function resolveCollisions(
  pads: PadState[],
  movedIndex: number,
  movedAbs: { x: number; y: number },
  depth = 0
) {
  if (depth > 4) return;
  const moved = pads[movedIndex];

  pads.forEach((other, i) => {
    if (i === movedIndex) return;
    const otherAbs = {
      x: other.restCenter.x + other.x.get(),
      y: other.restCenter.y + other.y.get(),
    };
    const dx = otherAbs.x - movedAbs.x;
    const dy = otherAbs.y - movedAbs.y;
    const dist = Math.hypot(dx, dy) || 0.001;
    const minDist = moved.radius + other.radius + COLLISION_PADDING;
    if (dist >= minDist) return;

    const overlap = minDist - dist;
    const nx = dx / dist;
    const ny = dy / dist;
    const targetAbs = {
      x: otherAbs.x + nx * overlap,
      y: otherAbs.y + ny * overlap,
    };
    let offX = targetAbs.x - other.restCenter.x;
    let offY = targetAbs.y - other.restCenter.y;
    const offDist = Math.hypot(offX, offY);
    if (offDist > MAX_DRIFT) {
      const scale = MAX_DRIFT / offDist;
      offX *= scale;
      offY *= scale;
    }

    if (other.returnTimeout) clearTimeout(other.returnTimeout);
    animate(other.x, offX, PUSH_SPRING);
    animate(other.y, offY, PUSH_SPRING);
    scheduleReturn(other);

    resolveCollisions(
      pads,
      i,
      { x: other.restCenter.x + offX, y: other.restCenter.y + offY },
      depth + 1
    );
  });
}

type DraggableLilyPadProps = PadConfig & {
  x: MotionValue<number>;
  y: MotionValue<number>;
  onPanStart: () => void;
  onPan: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => void;
  onPanEnd: () => void;
};

// How long the drag ripple lingers after the pad is released, so it gets
// to finish its pulse instead of vanishing mid-animation.
const DRAG_RIPPLE_LINGER = 1000;

function DraggableLilyPad({
  x,
  y,
  restCenter,
  radius,
  rotate,
  color,
  driftDuration,
  driftDelay,
  withFlower,
  onPanStart,
  onPan,
  onPanEnd,
}: DraggableLilyPadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePanStart = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setIsDragging(true);
    onPanStart();
  };

  const handlePanEnd = () => {
    onPanEnd();
    hideTimeout.current = setTimeout(
      () => setIsDragging(false),
      DRAG_RIPPLE_LINGER
    );
  };

  useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  return (
    <motion.div
      onPanStart={handlePanStart}
      onPan={onPan}
      onPanEnd={handlePanEnd}
      style={{
        x,
        y,
        width: radius * 2,
        height: radius * 2,
        left: `calc(50% + ${restCenter.x - radius}px)`,
        top: `calc(50% + ${restCenter.y - radius}px)`,
      }}
      className="pointer-events-auto absolute cursor-grab touch-none active:cursor-grabbing"
    >
      {/* single ripple that only appears while this pad is being dragged —
          it shares the pad's transform, so it follows it exactly */}
      {isDragging && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[240%] w-[240%] -translate-x-1/2 -translate-y-1/2 animate-ripple-out"
          aria-hidden="true"
        >
          <RippleIcon className="h-full w-full text-white/45" />
        </div>
      )}

      <div
        className="h-full w-full"
        style={{
          animation: `lily-drift ${driftDuration} ease-in-out infinite`,
          animationDelay: driftDelay,
        }}
      >
        <LilyPadIcon
          withFlower={withFlower}
          className={`h-full w-full ${rotate} ${color}`}
        />
      </div>
    </motion.div>
  );
}

const AMBIENT_RIPPLE_RADIUS = 280; // px — how far from center ripples may spawn
const AMBIENT_RIPPLE_SIZE = [60, 150] as const; // px diameter range of a ripple ring
const AMBIENT_RIPPLE_LIFE = 3200; // ms — matches the ripple-out animation length
const AMBIENT_RIPPLE_GAP = [200, 650] as const; // ms range between spawns
const AMBIENT_RIPPLE_BURST = [1, 3] as const; // how many ripples pop up per tick

type AmbientRipple = { id: number; x: number; y: number; size: number };

function useAmbientRipples() {
  const [ripples, setRipples] = useState<AmbientRipple[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    let alive = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const spawnOne = () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * AMBIENT_RIPPLE_RADIUS;
      const [minSize, maxSize] = AMBIENT_RIPPLE_SIZE;
      const id = nextId.current++;
      setRipples((prev) => [
        ...prev,
        {
          id,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          size: minSize + Math.random() * (maxSize - minSize),
        },
      ]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, AMBIENT_RIPPLE_LIFE);
    };

    const tick = () => {
      const [minBurst, maxBurst] = AMBIENT_RIPPLE_BURST;
      const burst =
        minBurst + Math.floor(Math.random() * (maxBurst - minBurst + 1));
      for (let i = 0; i < burst; i++) spawnOne();

      const [min, max] = AMBIENT_RIPPLE_GAP;
      timeoutId = setTimeout(() => {
        if (alive) tick();
      }, min + Math.random() * (max - min));
    };

    timeoutId = setTimeout(tick, 300);
    return () => {
      alive = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return ripples;
}

export default function PondScene() {
  const [pads] = useState(createPads);
  const ambientRipples = useAmbientRipples();

  useEffect(() => {
    return () => {
      pads.forEach((pad) => {
        if (pad.returnTimeout) clearTimeout(pad.returnTimeout);
      });
    };
  }, [pads]);

  return (
    <div
      className="pointer-events-none absolute -right-16 -bottom-40 z-10 hidden h-[48rem] w-[48rem] lg:block"
      aria-hidden="true"
    >
      {/* water body */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-faded-primary/60 via-primary/15 to-alt-primary/25 shadow-[inset_0_30px_70px_rgba(2,83,116,0.18)]" />
      <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-primary/10 via-transparent to-white/50" />
      <div className="absolute inset-10 rounded-full opacity-[0.06] grain-overlay" />
      <div className="absolute inset-x-16 top-10 h-px bg-white/50" />

      {/* random ripples popping up across the water, independent of the pads */}
      {ambientRipples.map((ripple) => (
        <div
          key={ripple.id}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-ripple-out"
          style={{
            width: ripple.size,
            height: ripple.size,
            left: `calc(50% + ${ripple.x}px)`,
            top: `calc(50% + ${ripple.y}px)`,
          }}
          aria-hidden="true"
        >
          <RippleIcon className="h-full w-full text-white/30" />
        </div>
      ))}

      {/* lily pads — clustered near the center, varied in size/rotation/shade.
          Drag one and a ripple follows it exactly; if it bumps into a
          neighbor, that pad gets shoved aside before both slowly drift
          back home. */}
      {pads.map((pad, index) => {
        const onPanStart = () => {
          if (pad.returnTimeout) clearTimeout(pad.returnTimeout);
          pad.dragStart = { x: pad.x.get(), y: pad.y.get() };
        };

        const onPan = (
          _event: MouseEvent | TouchEvent | PointerEvent,
          info: PanInfo
        ) => {
          let nextX = pad.dragStart.x + info.offset.x;
          let nextY = pad.dragStart.y + info.offset.y;
          const dist = Math.hypot(nextX, nextY);
          if (dist > MAX_DRIFT) {
            const scale = MAX_DRIFT / dist;
            nextX *= scale;
            nextY *= scale;
          }
          animate(pad.x, nextX, DRAG_SPRING);
          animate(pad.y, nextY, DRAG_SPRING);
          resolveCollisions(pads, index, {
            x: pad.restCenter.x + nextX,
            y: pad.restCenter.y + nextY,
          });
        };

        const onPanEnd = () => scheduleReturn(pad);

        return (
          <DraggableLilyPad
            key={index}
            {...pad}
            onPanStart={onPanStart}
            onPan={onPan}
            onPanEnd={onPanEnd}
          />
        );
      })}
    </div>
  );
}
