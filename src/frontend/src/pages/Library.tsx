import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { FunctionSquare, LogIn, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  EQUATION_COLORS,
  buildImplicit,
  drawExplicit,
  drawGrid,
  drawImplicit,
  isImplicit,
  parseExplicit,
} from "../components/canvasUtils";
import {
  useCreateEquation,
  useDeleteEquation,
  useEquations,
} from "../hooks/useEquations";
import type { Equation, EquationEntry } from "../types";

// ── Thumbnail ──────────────────────────────────────────────────────────────────

const THUMB_W = 240;
const THUMB_H = 135;
const THUMB_VIEW = { originX: 0, originY: 0, scale: 28 };

function EquationThumbnail({ canvasData }: { canvasData: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let entries: EquationEntry[] = [];
    if (canvasData) {
      try {
        entries = JSON.parse(canvasData) as EquationEntry[];
      } catch {
        entries = [];
      }
    }

    const isDark = document.documentElement.classList.contains("dark");
    drawGrid(ctx, THUMB_VIEW, THUMB_W, THUMB_H, isDark);

    entries.forEach((entry, idx) => {
      const color = EQUATION_COLORS[idx % EQUATION_COLORS.length];
      const explicit = parseExplicit(entry.expression);
      if (explicit) {
        drawExplicit(ctx, explicit, color, THUMB_VIEW, THUMB_W, THUMB_H);
      } else if (isImplicit(entry.expression)) {
        drawImplicit(
          ctx,
          buildImplicit(entry.expression),
          color,
          THUMB_VIEW,
          THUMB_W,
          THUMB_H,
        );
      }
    });
  }, [canvasData]);

  const hasEntries =
    canvasData &&
    (() => {
      try {
        const parsed = JSON.parse(canvasData) as EquationEntry[];
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return false;
      }
    })();

  if (!hasEntries) {
    return <FunctionSquare className="w-10 h-10 text-muted-foreground/30" />;
  }

  return (
    <canvas
      ref={ref}
      width={THUMB_W}
      height={THUMB_H}
      className="w-full h-full"
      aria-label="equation preview"
    />
  );
}

// ── Card ───────────────────────────────────────────────────────────────────────

interface EquationCardProps {
  eq: Equation;
  onDelete: (eq: Equation) => void;
}

function EquationCard({ eq, onDelete }: EquationCardProps) {
  const navigate = useNavigate();
  const updatedDate = new Date(
    Number(eq.updatedAt) / 1_000_000,
  ).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete(eq);
  }

  return (
    <button
      type="button"
      onClick={() =>
        navigate({ to: "/equations/$id", params: { id: eq.id.toString() } })
      }
      className="group relative flex flex-col rounded-xl border border-border bg-card hover:border-accent/50 hover:shadow-md transition-smooth text-left overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      data-ocid="library-eq-card"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-muted/60 flex items-center justify-center border-b border-border overflow-hidden relative">
        <EquationThumbnail canvasData={eq.canvasData} />
        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-smooth" />
        {/* Delete button */}
        <button
          type="button"
          aria-label={`Delete ${eq.name}`}
          onClick={handleDelete}
          className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-md bg-card/80 border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 opacity-0 group-hover:opacity-100 transition-smooth backdrop-blur-sm"
          data-ocid="library-eq-delete-btn"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="text-sm font-medium text-foreground truncate leading-tight">
          {eq.name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{updatedDate}</p>
      </div>
    </button>
  );
}

// ── Skeleton grid ──────────────────────────────────────────────────────────────

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

function LoadingGrid() {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      data-ocid="library-loading"
    >
      {SKELETON_KEYS.map((k) => (
        <div
          key={k}
          className="rounded-xl overflow-hidden border border-border"
        >
          <Skeleton className="aspect-video w-full" />
          <div className="px-3 py-2.5 space-y-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyLibrary({
  onNew,
  isCreating,
}: { onNew: () => void; isCreating: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-5 py-24 text-center"
      data-ocid="library-empty-state"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20">
        <FunctionSquare className="w-8 h-8 text-accent" />
      </div>
      <div className="space-y-1.5">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Start your equation library
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Type 2D equations, save them, and access from any device.
        </p>
      </div>
      <Button
        onClick={onNew}
        disabled={isCreating}
        className="gap-2 transition-smooth"
        data-ocid="library-new-cta"
      >
        <Plus className="w-4 h-4" />
        {isCreating ? "Creating…" : "New equation"}
      </Button>
    </div>
  );
}

// ── Empty search state ─────────────────────────────────────────────────────────

function NoResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
      data-ocid="library-no-results"
    >
      <Search className="w-8 h-8 text-muted-foreground/40" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          No equations match "{query}"
        </p>
        <p className="text-xs text-muted-foreground">Try a different name.</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onClear}>
        Clear search
      </Button>
    </div>
  );
}

// ── Login gate ─────────────────────────────────────────────────────────────────

function LoginGate({ onLogin }: { onLogin: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 py-32 text-center px-4"
      data-ocid="library-login-gate"
    >
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20">
        <FunctionSquare className="w-10 h-10 text-accent" />
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Welcome to EqDrawer
        </h1>
        <p className="text-base text-muted-foreground max-w-sm">
          Type and visualize 2D equations. Sign in to save and resume from any
          device.
        </p>
      </div>
      <Button
        size="lg"
        onClick={onLogin}
        className="gap-2 transition-smooth"
        data-ocid="library-login-btn"
      >
        <LogIn className="w-5 h-5" />
        Sign in with Internet Identity
      </Button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export function LibraryPage() {
  const { login, identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const navigate = useNavigate();

  const { data: equations, isLoading } = useEquations();
  const createEquation = useCreateEquation();
  const deleteEquation = useDeleteEquation();

  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<Equation | null>(null);

  async function handleNew() {
    const eq = await createEquation.mutateAsync({
      name: "Untitled equation",
      canvasData: "",
    });
    navigate({ to: "/equations/$id", params: { id: eq.id.toString() } });
  }

  async function handleConfirmDelete() {
    if (!toDelete) return;
    await deleteEquation.mutateAsync(toDelete.id);
    setToDelete(null);
  }

  const filtered = (equations ?? []).filter((eq) =>
    eq.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (!isLoggedIn) {
    return <LoginGate onLogin={login} />;
  }

  return (
    <div className="p-6 max-w-screen-2xl mx-auto" data-ocid="library-page">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <h1 className="font-display text-2xl font-semibold text-foreground flex-1">
          My Equations
        </h1>

        {/* Search */}
        <div className="relative w-full sm:w-64" data-ocid="library-search">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search equations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card"
            data-ocid="library-search-input"
          />
        </div>

        <Button
          onClick={handleNew}
          size="sm"
          disabled={createEquation.isPending}
          className="gap-2 transition-smooth shrink-0"
          data-ocid="library-new-btn"
        >
          <Plus className="w-4 h-4" />
          {createEquation.isPending ? "Creating…" : "New"}
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingGrid />
      ) : (equations ?? []).length === 0 ? (
        <EmptyLibrary onNew={handleNew} isCreating={createEquation.isPending} />
      ) : filtered.length === 0 ? (
        <NoResults query={search} onClear={() => setSearch("")} />
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          data-ocid="library-grid"
        >
          {filtered.map((eq) => (
            <EquationCard
              key={eq.id.toString()}
              eq={eq}
              onDelete={setToDelete}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <AlertDialogContent data-ocid="library-delete-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete equation?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong className="text-foreground">{toDelete?.name}</strong> will
              be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="library-delete-cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="library-delete-confirm"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
