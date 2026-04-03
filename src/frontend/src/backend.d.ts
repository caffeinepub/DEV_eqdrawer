import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export interface UpdateEquationArgs {
    id: EquationId;
    canvasData?: string;
    name?: string;
}
export type Timestamp = bigint;
export interface CreateEquationArgs {
    canvasData: string;
    name: string;
}
export interface Equation {
    id: EquationId;
    canvasData: string;
    owner: UserId;
    name: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
export type EquationId = bigint;
export interface backendInterface {
    createEquation(args: CreateEquationArgs): Promise<Equation>;
    deleteEquation(id: EquationId): Promise<boolean>;
    getEquation(id: EquationId): Promise<Equation | null>;
    listEquations(): Promise<Array<Equation>>;
    updateEquation(args: UpdateEquationArgs): Promise<Equation | null>;
}
