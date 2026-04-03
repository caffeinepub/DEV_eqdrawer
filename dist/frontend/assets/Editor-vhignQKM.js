import { d as useParams, e as useEquation, j as jsxRuntimeExports, c as Skeleton, S as SquareFunction } from "./index-D8HcYmpe.js";
function EditorPage() {
  const { id } = useParams({ from: "/equations/$id" });
  const equationId = BigInt(id);
  const { data: equation, isLoading } = useEquation(equationId);
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Equation not found." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "editor-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-3 border-b border-border bg-card flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquareFunction, { className: "w-5 h-5 text-accent shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-semibold text-foreground truncate", children: equation.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center bg-muted/20 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquareFunction, { className: "w-10 h-10 mx-auto text-muted-foreground/40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Canvas editor coming soon" })
    ] }) })
  ] });
}
export {
  EditorPage
};
