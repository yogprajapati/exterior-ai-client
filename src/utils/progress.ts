import { isStyled } from "../features/materials/designs";
import type { Project } from "../types";

/** Index of the furthest step a project can open, based on what has been saved so far. */
export function reachableStepIndex(project: Project): number {
  if (project.planes.length === 0) return 0;
  if (project.regions.length === 0) return 1;
  return project.designs.some(isStyled) ? 3 : 2;
}
