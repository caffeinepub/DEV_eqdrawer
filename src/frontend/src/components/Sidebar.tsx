import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { FileEdit, FunctionSquare, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteEquation, useEquations } from "../hooks/useEquations";
import type { Equation } from "../types";

function EquationItem({
  eq,
  isActive,
  onDelete,
}: {
  eq: Equation;
  isActive: boolean;
  onDelete: (id: bigint) => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-smooth",
        isActive
          ? "bg-accent/15 text-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground",
      )}
      data-ocid="sidebar-eq-item"
    >
      <Link
        to="/equations/$id"
        params={{ id: eq.id.toString() }}
        className="flex items-center gap-2 flex-1 min-w-0"
      >
        <FunctionSquare
          className={cn(
            "w-4 h-4 shrink-0",
            isActive ? "text-accent" : "text-muted-foreground",
          )}
        />
        <span className="truncate text-sm font-body">{eq.name}</span>
      </Link>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(eq.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-destructive transition-smooth"
        aria-label={`Delete ${eq.name}`}
        data-ocid="sidebar-eq-delete"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function Sidebar() {
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const { data: equations, isLoading } = useEquations();
  const deleteMutation = useDeleteEquation();
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { id?: string };
  const activeId = params.id;

  async function handleNewEquation() {
    navigate({ to: "/" });
  }

  async function handleDelete(id: bigint) {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Equation deleted");
      if (activeId === id.toString()) {
        navigate({ to: "/" });
      }
    } catch {
      toast.error("Failed to delete equation");
    }
  }

  return (
    <aside
      className="w-64 shrink-0 flex flex-col border-r border-border bg-sidebar h-full"
      data-ocid="sidebar"
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Library
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 hover:bg-accent/15 hover:text-accent transition-smooth"
          onClick={handleNewEquation}
          disabled={!isLoggedIn}
          aria-label="New equation"
          data-ocid="sidebar-new-btn"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Equation list */}
      <ScrollArea className="flex-1">
        <div className="px-2 py-2 space-y-0.5">
          {!isLoggedIn ? (
            <div
              className="px-3 py-8 text-center"
              data-ocid="sidebar-empty-auth"
            >
              <FileEdit className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">
                Sign in to save equations
              </p>
            </div>
          ) : isLoading ? (
            ["s1", "s2", "s3", "s4"].map((key) => (
              <div key={key} className="px-3 py-2">
                <Skeleton className="h-4 w-full rounded" />
              </div>
            ))
          ) : equations && equations.length > 0 ? (
            equations.map((eq) => (
              <EquationItem
                key={eq.id.toString()}
                eq={eq}
                isActive={activeId === eq.id.toString()}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div
              className="px-3 py-8 text-center"
              data-ocid="sidebar-empty-state"
            >
              <FunctionSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">
                No equations yet.
                <br />
                Type your first one!
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Sidebar footer */}
      <div className="px-4 py-2 border-t border-sidebar-border">
        <p className="text-[10px] text-muted-foreground/60 text-center">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-200"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </aside>
  );
}
