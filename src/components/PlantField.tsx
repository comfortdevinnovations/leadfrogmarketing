'use client';

import { useEffect, useRef } from 'react';
import {
  PlantFieldSim,
  type PlantFieldColors,
} from '@/components/plantFieldSim';

// Fixed simulation resolution — the canvas is scaled visually via CSS, so
// this only needs to keep the same aspect ratio as the rendered box.
const SIM_WIDTH = 112;
const SIM_HEIGHT = 336;

export default function PlantField({
  className,
  plantCount = 3,
  xRange,
  colors,
}: {
  className?: string;
  plantCount?: number;
  xRange?: [number, number];
  colors?: Partial<PlantFieldColors>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sim = new PlantFieldSim(canvas, { plantCount, xRange, colors });
    sim.start();
    return () => sim.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={SIM_WIDTH}
      height={SIM_HEIGHT}
      className={className}
      aria-hidden="true"
    />
  );
}
