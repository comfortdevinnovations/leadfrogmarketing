/**
 * Verlet-physics plant growth engine, used to decorate the hero card with a
 * pair of slender, procedurally-growing sprigs. Ported from a Codepen-style
 * canvas sketch and trimmed to what actually affects the rendered frame —
 * the original's energy/sunlight/photosynthesis system never gated growth
 * (the flag that would have enforced it was always off), so it's dropped
 * here rather than carried along as inert bookkeeping.
 */

const GRAVITY = 0.01;
const RIGIDITY = 10; // iterations of position refinement per frame
const FRICTION = 0.999;
const BOUNCE_LOSS = 0.9;
const SKID_LOSS = 0.8;
const BREEZE = 0.4;
const WORLD_SPEED = 2; // frames per growth tick

function randInt(min: number, max: number) {
  return (
    Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
    Math.ceil(min)
  );
}

function randFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

class Point {
  cx: number;
  cy: number;
  px: number;
  py: number;
  mass = 1;
  fixed = false;
  materiality: 'material' | 'immaterial';

  constructor(
    x: number,
    y: number,
    materiality: 'material' | 'immaterial' = 'material',
  ) {
    this.cx = x;
    this.cy = y;
    this.px = x;
    this.py = y;
    this.materiality = materiality;
  }
}

class Span {
  l: number;
  constructor(
    public p1: Point,
    public p2: Point,
  ) {
    this.l = distance(p1, p2);
  }
}

class Skin {
  constructor(
    public points: Point[],
    public color: string,
  ) {}
}

function distance(a: Point, b: Point) {
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  return Math.sqrt(dx * dx + dy * dy);
}

function midpoint(span: Span) {
  return { x: (span.p1.cx + span.p2.cx) / 2, y: (span.p1.cy + span.p2.cy) / 2 };
}

class Plant {
  segments: Segment[] = [];
  segmentCount = 0;
  forwardGrowthRate: number;
  outwardGrowthRate: number;
  maxSegmentWidth: number;
  maxTotalSegments: number;
  firstLeafSegment: number;
  leafFrequency: number;
  maxLeaflength: number;
  leafGrowthRate: number;
  ptB1: Point;
  ptB2: Point;
  spB: Span;

  constructor(sim: PlantFieldSim, xLocation: number) {
    this.forwardGrowthRate = GRAVITY * randFloat(35, 50);
    this.outwardGrowthRate = this.forwardGrowthRate * randFloat(0.18, 0.22);
    this.maxSegmentWidth = randFloat(11, 13);
    this.maxTotalSegments = randInt(10, 20);
    this.firstLeafSegment = randInt(2, 4);
    this.leafFrequency = randInt(2, 3);
    this.maxLeaflength = this.maxSegmentWidth * randFloat(4, 7);
    this.leafGrowthRate = this.forwardGrowthRate * randFloat(1.4, 1.6);

    this.ptB1 = sim.addPoint(xLocation - 0.1, 100);
    this.ptB2 = sim.addPoint(xLocation + 0.1, 100);
    this.ptB1.fixed = true;
    this.ptB2.fixed = true;
    this.spB = sim.addSpan(this.ptB1, this.ptB2);

    sim.createSegment(this, null, this.ptB1, this.ptB2);
  }
}

class Segment {
  id: number;
  childSegment: Segment | null = null;
  hasChildSegment = false;
  hasLeaves = false;
  hasLeafScaffolding = false;
  isBaseSegment: boolean;
  ptB1: Point;
  ptB2: Point;
  ptE1: Point;
  ptE2: Point;
  spL: Span;
  spR: Span;
  spF: Span;
  spCd: Span;
  spCu: Span;
  spCdP?: Span;
  spCuP?: Span;
  ptLf1: Point | null = null;
  ptLf2: Point | null = null;
  spLf1: Span | null = null;
  spLf2: Span | null = null;
  leafTipsTetherSpan: Span | null = null;
  ptLf1ScA?: Point;
  ptLf1ScB?: Point;
  ptLf2ScA?: Point;
  ptLf2ScB?: Point;
  spLf1ScA?: Span;
  spLf1ScB?: Span;
  spLf1ScC?: Span;
  spLf1ScD?: Span;
  spLf2ScA?: Span;
  spLf2ScB?: Span;
  spLf2ScC?: Span;
  spLf2ScD?: Span;
  skins: Skin[] = [];
  forwardGrowthRateVariation: number;

  constructor(
    sim: PlantFieldSim,
    public plant: Plant,
    public parentSegment: Segment | null,
    basePoint1: Point,
    basePoint2: Point,
  ) {
    this.id = plant.segmentCount;
    this.isBaseSegment = parentSegment === null;
    this.forwardGrowthRateVariation = randFloat(0.95, 1.05);
    this.ptB1 = basePoint1;
    this.ptB2 = basePoint2;

    const originX = (this.ptB1.cx + this.ptB2.cx) / 2;
    const originY = (this.ptB1.cy + this.ptB2.cy) / 2;
    this.ptE1 = sim.addPoint(sim.pctX(originX) - 0.1, sim.pctY(originY) - 0.1);
    this.ptE2 = sim.addPoint(sim.pctX(originX) + 0.1, sim.pctY(originY) - 0.1);
    this.ptE1.mass = 0.5;
    this.ptE2.mass = 0.5;

    this.spL = sim.addSpan(this.ptB1, this.ptE1);
    this.spR = sim.addSpan(this.ptB2, this.ptE2);
    this.spF = sim.addSpan(this.ptE1, this.ptE2);
    this.spCd = sim.addSpan(this.ptE1, this.ptB2);
    this.spCu = sim.addSpan(this.ptB1, this.ptE2);

    if (parentSegment) {
      this.spCdP = sim.addSpan(this.ptE1, parentSegment.ptB2);
      this.spCuP = sim.addSpan(parentSegment.ptB1, this.ptE2);
    }

    this.skins.push(
      sim.addSkin(
        [this.ptE1, this.ptE2, this.ptB2, this.ptB1],
        sim.colors.stalk,
      ),
    );
  }
}

export type PlantFieldColors = {
  stalk: string;
  stalkEdge: string;
  stalkHighlight: string;
  leafFill: string;
  leafStroke: string;
  leafVein: string;
};

export const DEFAULT_PLANT_COLORS: PlantFieldColors = {
  stalk: '#195740',
  stalkEdge: '#025374',
  stalkHighlight: '#ffffff',
  leafFill: '#e5c697',
  leafStroke: '#195740',
  leafVein: '#025374',
};

export type PlantFieldOptions = {
  plantCount?: number;
  xRange?: [number, number];
  colors?: Partial<PlantFieldColors>;
};

export class PlantFieldSim {
  private ctx: CanvasRenderingContext2D;
  private points: Point[] = [];
  private spans: Span[] = [];
  private plants: Plant[] = [];
  private worldTime = 0;
  private rafId: number | null = null;
  colors: PlantFieldColors;

  constructor(
    private canvas: HTMLCanvasElement,
    options: PlantFieldOptions = {},
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('PlantFieldSim: canvas 2d context unavailable');
    this.ctx = ctx;
    this.colors = { ...DEFAULT_PLANT_COLORS, ...options.colors };

    const plantCount = options.plantCount ?? 3;
    const [xMin, xMax] = options.xRange ?? [15, 85];
    for (let i = 0; i < plantCount; i++) {
      this.plants.push(new Plant(this, randFloat(xMin, xMax)));
    }
  }

  // ---- percent/pixel conversion (canvas resolution is fixed; only the
  // CSS box scales, so growth math stays in a stable coordinate space) ----
  pctX(x: number) {
    return (x * 100) / this.canvas.width;
  }
  pctY(y: number) {
    return (y * 100) / this.canvas.height;
  }
  private xVal(percent: number) {
    return (percent * this.canvas.width) / 100;
  }
  private yVal(percent: number) {
    return (percent * this.canvas.height) / 100;
  }

  addPoint(
    xPercent: number,
    yPercent: number,
    materiality?: 'material' | 'immaterial',
  ) {
    const p = new Point(this.xVal(xPercent), this.yVal(yPercent), materiality);
    this.points.push(p);
    return p;
  }

  addSpan(p1: Point, p2: Point) {
    const s = new Span(p1, p2);
    this.spans.push(s);
    return s;
  }

  addSkin(points: Point[], color: string) {
    const s = new Skin(points, color);
    return s;
  }

  private removeSpan(span: Span) {
    const i = this.spans.indexOf(span);
    if (i !== -1) this.spans.splice(i, 1);
  }

  createSegment(
    plant: Plant,
    parentSegment: Segment | null,
    p1: Point,
    p2: Point,
  ) {
    plant.segmentCount++;
    const segment = new Segment(this, plant, parentSegment, p1, p2);
    plant.segments.unshift(segment);
    if (parentSegment) {
      parentSegment.childSegment = segment;
      parentSegment.hasChildSegment = true;
    }
  }

  // ---- verlet step ----
  private updatePoints() {
    for (const p of this.points) {
      if (p.fixed) continue;
      let xv = (p.cx - p.px) * FRICTION;
      const yv = (p.cy - p.py) * FRICTION;
      if (p.py >= this.canvas.height - 1 && p.py <= this.canvas.height) {
        xv *= SKID_LOSS;
      }
      p.px = p.cx;
      p.py = p.cy;
      p.cx += xv;
      p.cy += yv;
      p.cy += GRAVITY * p.mass;
      if (this.worldTime % randInt(100, 200) === 0) {
        p.cx += randFloat(-BREEZE, BREEZE);
      }
    }
  }

  private applyConstraints() {
    const { width, height } = this.canvas;
    for (const p of this.points) {
      if (p.materiality !== 'material') continue;
      if (p.cx > width) {
        p.cx = width;
        p.px = p.cx + (p.cx - p.px) * BOUNCE_LOSS;
      }
      if (p.cx < 0) {
        p.cx = 0;
        p.px = p.cx + (p.cx - p.px) * BOUNCE_LOSS;
      }
      if (p.cy > height) {
        p.cy = height;
        p.py = p.cy + (p.cy - p.py) * BOUNCE_LOSS;
      }
      if (p.cy < 0) {
        p.cy = 0;
        p.py = p.cy + (p.cy - p.py) * BOUNCE_LOSS;
      }
    }
  }

  private updateSpans() {
    for (const s of this.spans) {
      const dx = s.p2.cx - s.p1.cx;
      const dy = s.p2.cy - s.p1.cy;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
      const r = s.l / d;
      const mx = s.p1.cx + dx / 2;
      const my = s.p1.cy + dy / 2;
      const ox = (dx / 2) * r;
      const oy = (dy / 2) * r;
      if (!s.p1.fixed) {
        s.p1.cx = mx - ox;
        s.p1.cy = my - oy;
      }
      if (!s.p2.fixed) {
        s.p2.cx = mx + ox;
        s.p2.cy = my + oy;
      }
    }
  }

  private refinePositions() {
    for (let j = 0; j < RIGIDITY; j++) {
      this.updateSpans();
      this.applyConstraints();
    }
  }

  // ---- growth ----
  private growPlants() {
    for (const plant of this.plants) {
      for (const segment of [...plant.segments]) {
        if (
          segment.spF.l < plant.maxSegmentWidth &&
          plant.segments.length < plant.maxTotalSegments
        ) {
          this.lengthenSegmentSpans(plant, segment);
        }
        if (this.readyForChildSegment(plant, segment)) {
          this.createSegment(plant, segment, segment.ptE1, segment.ptE2);
        }
        if (!segment.hasLeaves) {
          this.generateLeavesWhenReady(plant, segment);
        } else if (plant.segments.length < plant.maxTotalSegments) {
          this.growLeaves(plant, segment);
        }
      }
    }
  }

  private lengthenSegmentSpans(plant: Plant, segment: Segment) {
    if (segment.isBaseSegment) {
      segment.ptB1.cx -= plant.outwardGrowthRate / 2;
      segment.ptB2.cx += plant.outwardGrowthRate / 2;
      plant.spB.l = distance(segment.ptB1, segment.ptB2);
      segment.spCd.l =
        distance(segment.ptE1, segment.ptB2) + plant.forwardGrowthRate / 3;
      segment.spCu.l = segment.spCd.l;
    } else if (segment.parentSegment && segment.spCdP && segment.spCuP) {
      segment.spCdP.l =
        distance(segment.ptE1, segment.parentSegment.ptB2) +
        plant.forwardGrowthRate;
      segment.spCuP.l = segment.spCdP.l * segment.forwardGrowthRateVariation;
      segment.spCd.l = distance(segment.ptE1, segment.ptB2);
      segment.spCu.l = distance(segment.ptB1, segment.ptE2);
    }
    segment.spF.l += plant.outwardGrowthRate;
    segment.spL.l = distance(segment.ptB1, segment.ptE1);
    segment.spR.l = distance(segment.ptB2, segment.ptE2);
  }

  private readyForChildSegment(plant: Plant, segment: Segment) {
    return (
      segment.spF.l > plant.maxSegmentWidth * 0.333 &&
      !segment.hasChildSegment &&
      plant.segmentCount < plant.maxTotalSegments
    );
  }

  private generateLeavesWhenReady(plant: Plant, segment: Segment) {
    const readyBySchedule =
      segment.id >= plant.firstLeafSegment &&
      segment.id % plant.leafFrequency === 0 &&
      segment.spF.l > plant.maxSegmentWidth * 0.1;
    const isFinalSegment = segment.id === plant.maxTotalSegments - 1;
    if (!readyBySchedule && !isFinalSegment) return;

    const mid = midpoint(segment.spF);
    segment.ptLf1 = this.addPoint(this.pctX(mid.x), this.pctY(mid.y - 1));
    segment.ptLf2 = this.addPoint(this.pctX(mid.x), this.pctY(mid.y - 1));
    segment.spLf1 = this.addSpan(segment.ptB1, segment.ptLf1);
    segment.spLf2 = this.addSpan(segment.ptB2, segment.ptLf2);
    segment.leafTipsTetherSpan = this.addSpan(segment.ptLf1, segment.ptLf2);
    segment.hasLeaves = true;
  }

  private addLeafScaffolding(segment: Segment) {
    if (!segment.leafTipsTetherSpan || !segment.ptLf1 || !segment.ptLf2) return;
    this.removeSpan(segment.leafTipsTetherSpan);
    segment.ptLf1.cx -= GRAVITY * 100;
    segment.ptLf2.cx += GRAVITY * 100;

    let x = segment.ptE1.cx + (segment.ptE1.cx - segment.ptE2.cx) * 0.5;
    let y = segment.ptE1.cy + (segment.ptE1.cy - segment.ptE2.cy) * 0.5;
    segment.ptLf1ScA = this.addPoint(this.pctX(x), this.pctY(y), 'immaterial');
    segment.ptLf1ScA.mass = 0;
    x = (segment.ptLf1.cx + segment.ptLf1ScA.cx) / 2;
    y = (segment.ptLf1.cy + segment.ptLf1ScA.cy) / 2;
    segment.ptLf1ScB = this.addPoint(this.pctX(x), this.pctY(y), 'immaterial');
    segment.ptLf1ScB.mass = 0;

    x = segment.ptE2.cx + (segment.ptE2.cx - segment.ptE1.cx) * 0.5;
    y = segment.ptE2.cy + (segment.ptE2.cy - segment.ptE1.cy) * 0.5;
    segment.ptLf2ScA = this.addPoint(this.pctX(x), this.pctY(y), 'immaterial');
    segment.ptLf2ScA.mass = 0;
    x = (segment.ptLf2.cx + segment.ptLf2ScA.cx) / 2;
    y = (segment.ptLf2.cy + segment.ptLf2ScA.cy) / 2;
    segment.ptLf2ScB = this.addPoint(this.pctX(x), this.pctY(y), 'immaterial');
    segment.ptLf2ScB.mass = 0;

    segment.spLf1ScA = this.addSpan(segment.ptE1, segment.ptLf1ScA);
    segment.spLf1ScB = this.addSpan(segment.ptB1, segment.ptLf1ScA);
    segment.spLf1ScC = this.addSpan(segment.ptLf1ScA, segment.ptLf1ScB);
    segment.spLf1ScD = this.addSpan(segment.ptLf1ScB, segment.ptLf1);

    segment.spLf2ScA = this.addSpan(segment.ptE2, segment.ptLf2ScA);
    segment.spLf2ScB = this.addSpan(segment.ptB2, segment.ptLf2ScA);
    segment.spLf2ScC = this.addSpan(segment.ptLf2ScA, segment.ptLf2ScB);
    segment.spLf2ScD = this.addSpan(segment.ptLf2ScB, segment.ptLf2);

    segment.hasLeafScaffolding = true;
  }

  private growLeaves(plant: Plant, segment: Segment) {
    if (!segment.spLf1 || !segment.spLf2) return;
    if (segment.spLf1.l >= plant.maxLeaflength) return;

    segment.spLf1.l += plant.leafGrowthRate;
    segment.spLf2.l = segment.spLf1.l;

    if (
      segment.spF.l > plant.maxSegmentWidth * 0.6 &&
      !segment.hasLeafScaffolding
    ) {
      this.addLeafScaffolding(segment);
    } else if (segment.hasLeafScaffolding) {
      segment.spLf1ScA!.l += plant.leafGrowthRate * 1.25;
      segment.spLf1ScB!.l += plant.leafGrowthRate * 1.5;
      segment.spLf1ScC!.l += plant.leafGrowthRate * 0.06;
      segment.spLf1ScD!.l += plant.leafGrowthRate * 0.06;
      segment.spLf2ScA!.l += plant.leafGrowthRate * 1.25;
      segment.spLf2ScB!.l += plant.leafGrowthRate * 1.5;
      segment.spLf2ScC!.l += plant.leafGrowthRate * 0.06;
      segment.spLf2ScD!.l += plant.leafGrowthRate * 0.06;
    }
  }

  // ---- render ----
  private renderLeaf(p1: Point, p2: Point) {
    const ctx = this.ctx;
    const mpx = (p1.cx + p2.cx) / 2;
    const mpy = (p1.cy + p2.cy) / 2;
    const ah = 0.35;

    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = this.colors.leafStroke;
    ctx.fillStyle = this.colors.leafFill;

    let ccpx = mpx + (p2.cy - p1.cy) * ah;
    let ccpy = mpy + (p1.cx - p2.cx) * ah;
    ctx.beginPath();
    ctx.moveTo(p1.cx, p1.cy);
    ctx.quadraticCurveTo(ccpx, ccpy, p2.cx, p2.cy);
    ctx.stroke();
    ctx.fill();

    ccpx = mpx + (p1.cy - p2.cy) * ah;
    ccpy = mpy + (p2.cx - p1.cx) * ah;
    ctx.beginPath();
    ctx.moveTo(p1.cx, p1.cy);
    ctx.quadraticCurveTo(ccpx, ccpy, p2.cx, p2.cy);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.colors.leafVein;
    ctx.moveTo(p1.cx, p1.cy);
    ctx.lineTo(p2.cx, p2.cy);
    ctx.stroke();
  }

  private renderStalks(segment: Segment) {
    const ctx = this.ctx;
    for (const skin of segment.skins) {
      ctx.beginPath();
      ctx.fillStyle = skin.color;
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.colors.stalkHighlight;
      ctx.moveTo(skin.points[0].cx, skin.points[0].cy);
      for (let j = 1; j < skin.points.length; j++) {
        ctx.lineTo(skin.points[j].cx, skin.points[j].cy);
      }
      ctx.lineTo(skin.points[0].cx, skin.points[0].cy);
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.colors.stalkEdge;
      ctx.moveTo(skin.points[3].cx, skin.points[3].cy);
      ctx.lineTo(skin.points[0].cx, skin.points[0].cy);
      ctx.moveTo(skin.points[2].cx, skin.points[2].cy);
      ctx.lineTo(skin.points[1].cx, skin.points[1].cy);
      ctx.stroke();
      if (!segment.hasChildSegment) {
        ctx.beginPath();
        ctx.moveTo(skin.points[3].cx, skin.points[3].cy);
        ctx.lineTo(skin.points[2].cx, skin.points[2].cy);
        ctx.stroke();
      }
    }
  }

  private renderPlants() {
    for (const plant of this.plants) {
      for (const segment of plant.segments) {
        this.renderStalks(segment);
        if (segment.hasLeaves && segment.spLf1 && segment.spLf2) {
          this.renderLeaf(segment.spLf1.p1, segment.spLf1.p2);
          this.renderLeaf(segment.spLf2.p1, segment.spLf2.p2);
        }
      }
    }
  }

  private tick = () => {
    this.updatePoints();
    this.refinePositions();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.worldTime++;
    if (this.worldTime % WORLD_SPEED === 0) this.growPlants();
    this.renderPlants();
    this.rafId = requestAnimationFrame(this.tick);
  };

  start() {
    if (this.rafId === null) this.rafId = requestAnimationFrame(this.tick);
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
