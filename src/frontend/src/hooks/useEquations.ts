import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  CreateEquationArgs,
  Equation,
  UpdateEquationArgs,
} from "../types";

// Actor interface reflecting the backend contract
interface BackendActor {
  listEquations: () => Promise<Equation[]>;
  getEquation: (id: bigint) => Promise<Equation | null>;
  createEquation: (args: CreateEquationArgs) => Promise<Equation>;
  updateEquation: (args: UpdateEquationArgs) => Promise<Equation | null>;
  deleteEquation: (id: bigint) => Promise<boolean>;
}

function useBackendActor() {
  return useActor(createActor) as {
    actor: BackendActor | null;
    isFetching: boolean;
  };
}

export function useEquations() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Equation[]>({
    queryKey: ["equations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEquations();
    },
    enabled: !isFetching,
  });
}

export function useEquation(id: bigint | undefined) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Equation | null>({
    queryKey: ["equation", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) return null;
      return actor.getEquation(id);
    },
    enabled: !isFetching && id !== undefined,
  });
}

export function useCreateEquation() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation<Equation, Error, CreateEquationArgs>({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createEquation(args);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equations"] });
    },
  });
}

export function useUpdateEquation() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation<Equation | null, Error, UpdateEquationArgs>({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateEquation(args);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["equations"] });
      queryClient.invalidateQueries({
        queryKey: ["equation", vars.id.toString()],
      });
    },
  });
}

export function useDeleteEquation() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteEquation(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equations"] });
    },
  });
}
