import { u as useInternetIdentity, a as useNavigate, b as useEquations, j as jsxRuntimeExports, S as SquareFunction, B as Button, L as LogIn, P as Plus, c as Skeleton } from "./index-D8HcYmpe.js";
function EquationCard({ eq }) {
  const navigate = useNavigate();
  const preview = eq.canvasData ? "has-drawing" : "empty";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => navigate({ to: "/equations/$id", params: { id: eq.id.toString() } }),
      className: "group flex flex-col rounded-lg border border-border bg-card hover:border-accent/40 hover:shadow-xs transition-smooth text-left overflow-hidden",
      "data-ocid": "library-eq-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-video bg-muted flex items-center justify-center border-b border-border relative overflow-hidden", children: [
          preview === "has-drawing" ? /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { className: "w-full h-full object-contain" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SquareFunction, { className: "w-10 h-10 text-muted-foreground/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-smooth" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: eq.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: new Date(Number(eq.updatedAt) / 1e6).toLocaleDateString() })
        ] })
      ]
    }
  );
}
function EmptyLibrary({ onNew }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center gap-4 py-24 text-center",
      "data-ocid": "library-empty-state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquareFunction, { className: "w-8 h-8 text-accent" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Start your equation library" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Draw 2D equations, save them, and access from any device." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: onNew,
            className: "gap-2 transition-smooth",
            "data-ocid": "library-new-cta",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "New equation"
            ]
          }
        )
      ]
    }
  );
}
function LibraryPage() {
  const { loginStatus: _ls, login, identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const navigate = useNavigate();
  const { data: equations, isLoading } = useEquations();
  function handleNew() {
    navigate({ to: "/" });
  }
  if (!isLoggedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-6 py-32 text-center px-4",
        "data-ocid": "library-login-gate",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquareFunction, { className: "w-10 h-10 text-accent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-semibold text-foreground", children: "Welcome to EqDrawer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-muted-foreground max-w-sm", children: "Type and draw 2D equations. Sign in to save and access your work from any device." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "lg",
              onClick: login,
              className: "gap-2 transition-smooth",
              "data-ocid": "library-login-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-5 h-5" }),
                "Sign in with Internet Identity"
              ]
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold text-foreground", children: "My Equations" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleNew,
          size: "sm",
          className: "gap-2 transition-smooth",
          "data-ocid": "library-new-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "New"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",
        "data-ocid": "library-loading",
        children: ["l1", "l2", "l3", "l4", "l5", "l6"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg overflow-hidden border border-border",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-video w-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2.5 space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
              ] })
            ]
          },
          k
        ))
      }
    ) : equations && equations.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",
        "data-ocid": "library-grid",
        children: equations.map((eq) => /* @__PURE__ */ jsxRuntimeExports.jsx(EquationCard, { eq }, eq.id.toString()))
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyLibrary, { onNew: handleNew })
  ] });
}
export {
  LibraryPage
};
