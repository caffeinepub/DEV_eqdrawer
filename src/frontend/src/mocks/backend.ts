import type { backendInterface } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

const sampleEquations = [
  {
    id: BigInt(1),
    name: "Parabola",
    canvasData: JSON.stringify([{ expr: "y = x^2", color: "#e07b39" }]),
    owner: { _arr: new Uint8Array(29), _isPrincipal: true } as any,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: BigInt(2),
    name: "Sine Wave",
    canvasData: JSON.stringify([{ expr: "y = sin(x)", color: "#4a90d9" }]),
    owner: { _arr: new Uint8Array(29), _isPrincipal: true } as any,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: BigInt(3),
    name: "Circle",
    canvasData: JSON.stringify([{ expr: "x^2 + y^2 = 9", color: "#5b9a6e" }]),
    owner: { _arr: new Uint8Array(29), _isPrincipal: true } as any,
    createdAt: now,
    updatedAt: now,
  },
];

export const mockBackend: backendInterface = {
  createEquation: async (args) => ({
    id: BigInt(4),
    name: args.name,
    canvasData: args.canvasData,
    owner: { _arr: new Uint8Array(29), _isPrincipal: true } as any,
    createdAt: now,
    updatedAt: now,
  }),
  deleteEquation: async () => true,
  getEquation: async (id) =>
    sampleEquations.find((e) => e.id === id) ?? null,
  listEquations: async () => sampleEquations,
  updateEquation: async (args) =>
    sampleEquations.find((e) => e.id === args.id) ?? null,
};
