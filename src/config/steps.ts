export type StepId = "size" | "parts" | "materials" | "results";

export interface StepInfo {
  id: StepId;
  label: string;
}

export const STEPS: StepInfo[] = [
  { id: "size", label: "Set size" },
  { id: "parts", label: "Mark parts" },
  { id: "materials", label: "Choose materials" },
  { id: "results", label: "Results" },
];

export const DEFAULT_PLANE_ID = "main";
