import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import { FunctionSquare } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { EquationCanvas } from "../components/EquationCanvas";
import { EquationToolbar } from "../components/EquationToolbar";
import { useEquation, useUpdateEquation } from "../hooks/useEquations";
import type { EquationEntry } from "../types";

function makeEntry(expression = ""): EquationEntry {
  return { id: `${Date.now()}-${Math.random()}`, expression, label: "" };
}

function parseCanvasData(json: string): EquationEntry[] {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed) && parsed.length > 0)
      return parsed as EquationEntry[];
  } catch {
    // fall through
  }
  return [makeEntry()];
}

export function EditorPage() {
  const { id } = useParams({ from: "/equations/$id" });
  const equationId = BigInt(id);
  const { data: equation, isLoading } = useEquation(equationId);
  const updateEquation = useUpdateEquation();

  const [name, setName] = useState("");
  const [equations, setEquations] = useState<EquationEntry[]>([makeEntry()]);
  const [initialized, setInitialized] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync from backend on load
  useEffect(() => {
    if (equation && !initialized) {
      setName(equation.name);
      setEquations(parseCanvasData(equation.canvasData));
      setInitialized(true);
    }
  }, [equation, initialized]);

  const scheduleSave = useCallback(
    (nextName: string, nextEqs: EquationEntry[]) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        updateEquation.mutate({
          id: equationId,
          name: nextName,
          canvasData: JSON.stringify(nextEqs),
        });
      }, 800);
    },
    [equationId, updateEquation],
  );

  const handleNameChange = (val: string) => {
    setName(val);
    scheduleSave(val, equations);
  };

  const handleAddEquation = () => {
    const next = [...equations, makeEntry()];
    setEquations(next);
    scheduleSave(name, next);
  };

  const handleDeleteEquation = (entryId: string) => {
    const next = equations.filter((e) => e.id !== entryId);
    const safe = next.length > 0 ? next : [makeEntry()];
    setEquations(safe);
    scheduleSave(name, safe);
  };

  const handleChangeExpression = (entryId: string, value: string) => {
    const next = equations.map((e) =>
      e.id === entryId ? { ...e, expression: value } : e,
    );
    setEquations(next);
    scheduleSave(name, next);
  };

  if (isLoading) {
    return (
      <div
        className="flex flex-col h-full p-6 gap-4"
        data-ocid="editor-loading"
      >
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="flex-1 rounded-lg" />
      </div>
    );
  }

  if (!equation) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 h-full text-center"
        data-ocid="editor-not-found"
      >
        <FunctionSquare className="w-12 h-12 text-muted-foreground/30" />
        <p className="text-muted-foreground">Equation canvas not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-ocid="editor-page">
      {/* Name bar */}
      <div className="px-4 py-2 border-b border-border bg-card flex items-center gap-2 shrink-0">
        <FunctionSquare className="w-4 h-4 text-accent shrink-0" />
        <Input
          className="h-7 text-sm font-display font-semibold border-transparent bg-transparent shadow-none
            focus-visible:border-input focus-visible:bg-card px-1"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Untitled canvas"
          data-ocid="canvas-name-input"
        />
        {updateEquation.isPending && (
          <span className="text-xs text-muted-foreground shrink-0 animate-pulse">
            Saving…
          </span>
        )}
      </div>

      {/* Canvas area */}
      <div className="flex-1 relative bg-background" data-ocid="canvas-area">
        <EquationCanvas equations={equations} />
        <EquationToolbar
          equations={equations}
          onAdd={handleAddEquation}
          onDelete={handleDeleteEquation}
          onChangeExpression={handleChangeExpression}
        />
      </div>
    </div>
  );
}
