import type { Design } from "../../types";
import type { Slot } from "../../utils/catalog";

export const MIXED = "mixed";

/** The first unused letter, so names stay tidy even after designs are deleted. */
export function nextDesignName(designs: Design[]): string {
  const used = new Set(designs.map((d) => d.name));
  for (let code = 65; code < 91; code++) {
    const name = `Design ${String.fromCharCode(code)}`;
    if (!used.has(name)) return name;
  }
  return `Design ${designs.length + 1}`;
}

export const emptyDesign = (id: string, name: string): Design => ({ id, name, assignments: {}, glass: {} });

export function assignMaterial(design: Design, regionIds: string[], materialId: string | null, slot: Slot): Design {
  const choices = { ...design[slot] };
  for (const id of regionIds) {
    if (materialId) choices[id] = materialId;
    else delete choices[id];
  }
  return { ...design, [slot]: choices };
}

/** The shared material of some parts, null when none are changed, or MIXED when they differ. */
export function sharedMaterial(design: Design, regionIds: string[], slot: Slot): string | null | typeof MIXED {
  const ids = new Set(regionIds.map((id) => design[slot][id] ?? null));
  return ids.size === 1 ? [...ids][0] : MIXED;
}

export const isStyled = (design: Design): boolean => Object.keys(design.assignments).length + Object.keys(design.glass).length > 0;
export const hasAssignments = (designs: Design[]): boolean => designs.some(isStyled);
