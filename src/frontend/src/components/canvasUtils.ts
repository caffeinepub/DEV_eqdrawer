import { all, create } from "mathjs";

const math = create(all, {});

export const EQUATION_COLORS = [
  "#c0392b",
  "#2980b9",
  "#27ae60",
  "#8e44ad",
  "#d35400",
  "#16a085",
  "#e74c3c",
  "#1abc9c",
];

export interface ViewState {
  originX: number;
  originY: number;
  scale: number;
}

export function toCanvas(
  x: number,
  y: number,
  v: ViewState,
  w: number,
  h: number,
) {
  return {
    cx: w / 2 + (x - v.originX) * v.scale,
    cy: h / 2 - (y - v.originY) * v.scale,
  };
}

export function fromCanvas(
  cx: number,
  cy: number,
  v: ViewState,
  w: number,
  h: number,
) {
  return {
    x: v.originX + (cx - w / 2) / v.scale,
    y: v.originY - (cy - h / 2) / v.scale,
  };
}

export function parseExplicit(expr: string): string | null {
  const s = expr.trim();
  const yEq = s.match(/^y\s*=\s*(.+)$/i);
  if (yEq) return yEq[1];
  if (s.includes("x") && !s.includes("y") && !s.includes("=")) return s;
  return null;
}

export function isImplicit(expr: string): boolean {
  const s = expr.trim();
  if (/^y\s*=/i.test(s)) return false;
  if (s.includes("y") || s.includes("=")) return true;
  return false;
}

export function buildImplicit(expr: string): string {
  const s = expr.trim();
  if (s.includes("=")) {
    const eqIdx = s.indexOf("=");
    const lhs = s.slice(0, eqIdx);
    const rhs = s.slice(eqIdx + 1);
    return `(${lhs}) - (${rhs})`;
  }
  return s;
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  v: ViewState,
  w: number,
  h: number,
  isDark: boolean,
) {
  ctx.clearRect(0, 0, w, h);
  const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const axisColor = isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)";
  const textColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  const rawStep = 80 / v.scale;
  const mag = 10 ** Math.floor(Math.log10(rawStep));
  const nice = rawStep / mag < 2 ? mag : rawStep / mag < 5 ? 2 * mag : 5 * mag;
  const step = nice;
  const xMin = fromCanvas(0, 0, v, w, h).x;
  const xMax = fromCanvas(w, 0, v, w, h).x;
  const yMin = fromCanvas(0, h, v, w, h).y;
  const yMax = fromCanvas(0, 0, v, w, h).y;
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.font = "11px GeistMono, monospace";
  ctx.fillStyle = textColor;
  const axisLabelY = h / 2 + v.originY * v.scale + 13;
  const axisLabelX = w / 2 - v.originX * v.scale + 4;
  const x0 = Math.ceil(xMin / step) * step;
  for (let xi = x0; xi <= xMax; xi += step) {
    const { cx } = toCanvas(xi, 0, v, w, h);
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();
    if (Math.abs(xi) > step * 0.01) {
      ctx.fillText(
        xi % 1 === 0 ? xi.toString() : xi.toFixed(1),
        cx + 3,
        axisLabelY,
      );
    }
  }
  const y0 = Math.ceil(yMin / step) * step;
  for (let yi = y0; yi <= yMax; yi += step) {
    const { cy } = toCanvas(0, yi, v, w, h);
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();
    if (Math.abs(yi) > step * 0.01) {
      ctx.fillText(
        yi % 1 === 0 ? yi.toString() : yi.toFixed(1),
        axisLabelX,
        cy - 4,
      );
    }
  }
  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 1.5;
  const { cx: ox } = toCanvas(0, 0, v, w, h);
  const { cy: oy } = toCanvas(0, 0, v, w, h);
  ctx.beginPath();
  ctx.moveTo(ox, 0);
  ctx.lineTo(ox, h);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, oy);
  ctx.lineTo(w, oy);
  ctx.stroke();
}

export function drawExplicit(
  ctx: CanvasRenderingContext2D,
  rhs: string,
  color: string,
  v: ViewState,
  w: number,
  h: number,
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.lineJoin = "round";
  ctx.beginPath();
  let started = false;
  const steps = w * 2;
  try {
    for (let i = 0; i <= steps; i++) {
      const cx = (i / steps) * w;
      const x = fromCanvas(cx, 0, v, w, h).x;
      let y: number;
      try {
        y = Number(math.evaluate(rhs, { x }));
      } catch {
        started = false;
        continue;
      }
      if (!Number.isFinite(y) || Number.isNaN(y) || Math.abs(y) > 1e7) {
        started = false;
        continue;
      }
      const { cy } = toCanvas(x, y, v, w, h);
      if (!started) {
        ctx.moveTo(cx, cy);
        started = true;
      } else {
        ctx.lineTo(cx, cy);
      }
    }
  } catch {
    return;
  }
  ctx.stroke();
}

function evalGrid(
  expr: string,
  cols: number,
  rows: number,
  v: ViewState,
  w: number,
  h: number,
) {
  const vals: number[][] = [];
  for (let r = 0; r <= rows; r++) {
    vals[r] = [];
    for (let c = 0; c <= cols; c++) {
      const { x, y } = fromCanvas((c / cols) * w, (r / rows) * h, v, w, h);
      try {
        const val = Number(math.evaluate(expr, { x, y }));
        vals[r][c] = Number.isFinite(val) ? val : Number.NaN;
      } catch {
        vals[r][c] = Number.NaN;
      }
    }
  }
  return vals;
}

export function drawImplicit(
  ctx: CanvasRenderingContext2D,
  fExpr: string,
  color: string,
  v: ViewState,
  w: number,
  h: number,
) {
  try {
    math.parse(fExpr);
  } catch {
    return;
  }
  const cols = Math.floor(w / 3);
  const rows = Math.floor(h / 3);
  const vals = evalGrid(fExpr, cols, rows, v, w, h);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  const lerp = (a: number, b: number, va: number, vb: number) =>
    a + (Math.abs(va) / (Math.abs(va) + Math.abs(vb))) * (b - a);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v00 = vals[r][c];
      const v10 = vals[r][c + 1];
      const v01 = vals[r + 1][c];
      const v11 = vals[r + 1][c + 1];
      if ([v00, v10, v01, v11].some(Number.isNaN)) continue;
      const sign =
        (v00 > 0 ? 8 : 0) |
        (v10 > 0 ? 4 : 0) |
        (v11 > 0 ? 2 : 0) |
        (v01 > 0 ? 1 : 0);
      if (sign === 0 || sign === 15) continue;
      const x0 = (c / cols) * w;
      const x1 = ((c + 1) / cols) * w;
      const y0 = (r / rows) * h;
      const y1 = ((r + 1) / rows) * h;
      const pts: [number, number][] = [];
      if (v00 > 0 !== v10 > 0) pts.push([lerp(x0, x1, v00, v10), y0]);
      if (v01 > 0 !== v11 > 0) pts.push([lerp(x0, x1, v01, v11), y1]);
      if (v00 > 0 !== v01 > 0) pts.push([x0, lerp(y0, y1, v00, v01)]);
      if (v10 > 0 !== v11 > 0) pts.push([x1, lerp(y0, y1, v10, v11)]);
      if (pts.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        ctx.lineTo(pts[1][0], pts[1][1]);
        ctx.stroke();
      }
    }
  }
}
