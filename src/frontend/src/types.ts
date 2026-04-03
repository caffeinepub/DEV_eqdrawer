export interface Equation {
  id: bigint;
  owner: string;
  name: string;
  canvasData: string;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface CreateEquationArgs {
  name: string;
  canvasData: string;
}

export interface UpdateEquationArgs {
  id: bigint;
  name?: string;
  canvasData?: string;
}

/** A single plotted equation line within a canvas */
export interface EquationEntry {
  id: string;
  expression: string;
  label: string;
}
