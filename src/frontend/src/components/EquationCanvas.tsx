import { useCallback, useEffect, useRef, useState } from "react";
import type { EquationEntry } from "../types";
import {
  EQUATION_COLORS,
  type ViewState,
  buildImplicit,
  drawExplicit,
  drawGrid,
  drawImplicit,
  fromCanvas,
  isImplicit,
  parseExplicit,
} from "./canvasUtils";

interface Props {
  equations: EquationEntry[];
}

export { EQUATION_COLORS } from "./canvasUtils";

export function EquationCanvas({ equations }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ViewState>({
    originX: 0,
    originY: 0,
    scale: 60,
  });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTouch = useRef({ x: 0, y: 0, dist: 0 });
  const animRef = useRef<number>(0);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const dark = document.documentElement.classList.contains("dark");
    drawGrid(ctx, view, w, h, dark);
    for (let idx = 0; idx < equations.length; idx++) {
      const eq = equations[idx];
      if (!eq.expression.trim()) continue;
      const color = EQUATION_COLORS[idx % EQUATION_COLORS.length];
      const expr = eq.expression.trim();
      if (isImplicit(expr)) {
        drawImplicit(ctx, buildImplicit(expr), color, view, w, h);
      } else {
        const rhs = parseExplicit(expr);
        if (rhs) drawExplicit(ctx, rhs, color, view, w, h);
      }
    }
  }, [view, equations]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [render]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame(render);
    });
    ro.observe(container);
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    return () => ro.disconnect();
  }, [render]);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setView((v) => ({
      ...v,
      originX: v.originX - dx / v.scale,
      originY: v.originY + dy / v.scale,
    }));
  };
  const onMouseUp = () => {
    dragging.current = false;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      lastTouch.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        dist: 0,
      };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouch.current.dist = Math.hypot(dx, dy);
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastTouch.current.x;
      const dy = e.touches[0].clientY - lastTouch.current.y;
      lastTouch.current = {
        ...lastTouch.current,
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      setView((v) => ({
        ...v,
        originX: v.originX - dx / v.scale,
        originY: v.originY + dy / v.scale,
      }));
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const factor = dist / (lastTouch.current.dist || dist);
      lastTouch.current.dist = dist;
      setView((v) => ({
        ...v,
        scale: Math.max(5, Math.min(2000, v.scale * factor)),
      }));
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { x: wx, y: wy } = fromCanvas(
      mx,
      my,
      view,
      canvas.width,
      canvas.height,
    );
    setView((v) => {
      const newScale = Math.max(5, Math.min(2000, v.scale * factor));
      return {
        scale: newScale,
        originX: wx - (mx - canvas.width / 2) / newScale,
        originY: wy + (my - canvas.height / 2) / newScale,
      };
    });
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
      data-ocid="equation-canvas-container"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={() => {
          lastTouch.current.dist = 0;
        }}
        style={{ touchAction: "none" }}
        data-ocid="equation-canvas"
      />
    </div>
  );
}
