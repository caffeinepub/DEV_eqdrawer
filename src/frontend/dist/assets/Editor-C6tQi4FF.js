import { r as reactExports, j as jsxRuntimeExports, B as Button, v as Plus, x as ScrollArea, S as SquareFunction, T as Trash2, y as useParams, z as useEquation, A as useUpdateEquation, w as Skeleton } from "./index-dkC_vG9A.js";
import { d as drawGrid, i as isImplicit, b as drawImplicit, c as buildImplicit, p as parseExplicit, a as drawExplicit, E as EQUATION_COLORS, f as fromCanvas, I as Input } from "./canvasUtils-Bt--7fPj.js";
function EquationCanvas({ equations }) {
  const canvasRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  const [view, setView] = reactExports.useState({
    originX: 0,
    originY: 0,
    scale: 60
  });
  const dragging = reactExports.useRef(false);
  const lastPos = reactExports.useRef({ x: 0, y: 0 });
  const lastTouch = reactExports.useRef({ x: 0, y: 0, dist: 0 });
  const animRef = reactExports.useRef(0);
  const render = reactExports.useCallback(() => {
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
  reactExports.useEffect(() => {
    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [render]);
  reactExports.useEffect(() => {
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
  const onMouseDown = (e) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setView((v) => ({
      ...v,
      originX: v.originX - dx / v.scale,
      originY: v.originY + dy / v.scale
    }));
  };
  const onMouseUp = () => {
    dragging.current = false;
  };
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      lastTouch.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        dist: 0
      };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouch.current.dist = Math.hypot(dx, dy);
    }
  };
  const onTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastTouch.current.x;
      const dy = e.touches[0].clientY - lastTouch.current.y;
      lastTouch.current = {
        ...lastTouch.current,
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      setView((v) => ({
        ...v,
        originX: v.originX - dx / v.scale,
        originY: v.originY + dy / v.scale
      }));
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const factor = dist / (lastTouch.current.dist || dist);
      lastTouch.current.dist = dist;
      setView((v) => ({
        ...v,
        scale: Math.max(5, Math.min(2e3, v.scale * factor))
      }));
    }
  };
  const onWheel = (e) => {
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
      canvas.height
    );
    setView((v) => {
      const newScale = Math.max(5, Math.min(2e3, v.scale * factor));
      return {
        scale: newScale,
        originX: wx - (mx - canvas.width / 2) / newScale,
        originY: wy + (my - canvas.height / 2) / newScale
      };
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: containerRef,
      className: "w-full h-full relative overflow-hidden",
      "data-ocid": "equation-canvas-container",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          className: "absolute inset-0 cursor-grab active:cursor-grabbing",
          onMouseDown,
          onMouseMove,
          onMouseUp,
          onMouseLeave: onMouseUp,
          onWheel,
          onTouchStart,
          onTouchMove,
          onTouchEnd: () => {
            lastTouch.current.dist = 0;
          },
          style: { touchAction: "none" },
          "data-ocid": "equation-canvas"
        }
      )
    }
  );
}
function EquationToolbar({
  equations,
  onAdd,
  onDelete,
  onChangeExpression
}) {
  const inputRefs = reactExports.useRef({});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[min(480px,calc(100vw-2rem))] bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg flex flex-col overflow-hidden",
      "data-ocid": "equation-toolbar",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground tracking-wide uppercase", children: "Equations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "default",
              className: "h-6 px-2 gap-1 text-xs",
              onClick: onAdd,
              "data-ocid": "add-equation-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                "Add"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-52", children: equations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center gap-1 py-5 text-center",
            "data-ocid": "empty-equations",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquareFunction, { className: "w-6 h-6 text-muted-foreground/30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No equations yet — click Add to start" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "py-1", children: equations.map((eq, idx) => {
          const color = EQUATION_COLORS[idx % EQUATION_COLORS.length];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "flex items-center gap-2 px-3 py-1.5 group",
              "data-ocid": `equation-row-${eq.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-border",
                    style: { background: color },
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    ref: (el) => {
                      inputRefs.current[eq.id] = el;
                    },
                    className: "h-7 text-sm font-mono flex-1 bg-transparent border-border",
                    placeholder: "e.g. y = x^2, sin(x), x^2 + y^2 = 9",
                    value: eq.expression,
                    onChange: (e) => onChangeExpression(eq.id, e.target.value),
                    "data-ocid": `equation-input-${eq.id}`,
                    spellCheck: false,
                    autoComplete: "off"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "icon",
                    variant: "ghost",
                    className: "h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive",
                    onClick: () => onDelete(eq.id),
                    "aria-label": "Delete equation",
                    "data-ocid": `delete-equation-${eq.id}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ]
            },
            eq.id
          );
        }) }) })
      ]
    }
  );
}
function makeEntry(expression = "") {
  return { id: `${Date.now()}-${Math.random()}`, expression, label: "" };
}
function parseCanvasData(json) {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed) && parsed.length > 0)
      return parsed;
  } catch {
  }
  return [makeEntry()];
}
function EditorPage() {
  const { id } = useParams({ from: "/equations/$id" });
  const equationId = BigInt(id);
  const { data: equation, isLoading } = useEquation(equationId);
  const updateEquation = useUpdateEquation();
  const [name, setName] = reactExports.useState("");
  const [equations, setEquations] = reactExports.useState([makeEntry()]);
  const [initialized, setInitialized] = reactExports.useState(false);
  const saveTimer = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (equation && !initialized) {
      setName(equation.name);
      setEquations(parseCanvasData(equation.canvasData));
      setInitialized(true);
    }
  }, [equation, initialized]);
  const scheduleSave = reactExports.useCallback(
    (nextName, nextEqs) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        updateEquation.mutate({
          id: equationId,
          name: nextName,
          canvasData: JSON.stringify(nextEqs)
        });
      }, 800);
    },
    [equationId, updateEquation]
  );
  const handleNameChange = (val) => {
    setName(val);
    scheduleSave(val, equations);
  };
  const handleAddEquation = () => {
    const next = [...equations, makeEntry()];
    setEquations(next);
    scheduleSave(name, next);
  };
  const handleDeleteEquation = (entryId) => {
    const next = equations.filter((e) => e.id !== entryId);
    const safe = next.length > 0 ? next : [makeEntry()];
    setEquations(safe);
    scheduleSave(name, safe);
  };
  const handleChangeExpression = (entryId, value) => {
    const next = equations.map(
      (e) => e.id === entryId ? { ...e, expression: value } : e
    );
    setEquations(next);
    scheduleSave(name, next);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col h-full p-6 gap-4",
        "data-ocid": "editor-loading",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "flex-1 rounded-lg" })
        ]
      }
    );
  }
  if (!equation) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-4 h-full text-center",
        "data-ocid": "editor-not-found",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SquareFunction, { className: "w-12 h-12 text-muted-foreground/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Equation canvas not found." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "editor-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-b border-border bg-card flex items-center gap-2 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquareFunction, { className: "w-4 h-4 text-accent shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          className: "h-7 text-sm font-display font-semibold border-transparent bg-transparent shadow-none\n            focus-visible:border-input focus-visible:bg-card px-1",
          value: name,
          onChange: (e) => handleNameChange(e.target.value),
          placeholder: "Untitled canvas",
          "data-ocid": "canvas-name-input"
        }
      ),
      updateEquation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0 animate-pulse", children: "Saving…" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative bg-background", "data-ocid": "canvas-area", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(EquationCanvas, { equations }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        EquationToolbar,
        {
          equations,
          onAdd: handleAddEquation,
          onDelete: handleDeleteEquation,
          onChangeExpression: handleChangeExpression
        }
      )
    ] })
  ] });
}
export {
  EditorPage
};
