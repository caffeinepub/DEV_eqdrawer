import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FunctionSquare, Plus, Trash2 } from "lucide-react";
import { useRef } from "react";
import type { EquationEntry } from "../types";
import { EQUATION_COLORS } from "./EquationCanvas";

interface Props {
  equations: EquationEntry[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onChangeExpression: (id: string, value: string) => void;
}

export function EquationToolbar({
  equations,
  onAdd,
  onDelete,
  onChangeExpression,
}: Props) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[min(480px,calc(100vw-2rem))] bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg flex flex-col overflow-hidden"
      data-ocid="equation-toolbar"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
          Equations
        </span>
        <Button
          size="sm"
          variant="default"
          className="h-6 px-2 gap-1 text-xs"
          onClick={onAdd}
          data-ocid="add-equation-btn"
        >
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>

      {/* Equation list */}
      <ScrollArea className="max-h-52">
        {equations.length === 0 ? (
          <div
            className="flex flex-col items-center gap-1 py-5 text-center"
            data-ocid="empty-equations"
          >
            <FunctionSquare className="w-6 h-6 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              No equations yet — click Add to start
            </p>
          </div>
        ) : (
          <ul className="py-1">
            {equations.map((eq, idx) => {
              const color = EQUATION_COLORS[idx % EQUATION_COLORS.length];
              return (
                <li
                  key={eq.id}
                  className="flex items-center gap-2 px-3 py-1.5 group"
                  data-ocid={`equation-row-${eq.id}`}
                >
                  {/* Color swatch */}
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-border"
                    style={{ background: color }}
                    aria-hidden="true"
                  />
                  {/* Expression input */}
                  <Input
                    ref={(el) => {
                      inputRefs.current[eq.id] = el;
                    }}
                    className="h-7 text-sm font-mono flex-1 bg-transparent border-border"
                    placeholder="e.g. y = x^2, sin(x), x^2 + y^2 = 9"
                    value={eq.expression}
                    onChange={(e) => onChangeExpression(eq.id, e.target.value)}
                    data-ocid={`equation-input-${eq.id}`}
                    spellCheck={false}
                    autoComplete="off"
                  />
                  {/* Delete */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    onClick={() => onDelete(eq.id)}
                    aria-label="Delete equation"
                    data-ocid={`delete-equation-${eq.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}
