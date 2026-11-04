import type { Material, RegionType } from "../types";

/** A design chooses a finish (or window frame) per part, and for windows a glass as well. */
export type Slot = "assignments" | "glass";

export const materialsForType = (catalog: Material[], type: RegionType, slot: Slot = "assignments"): Material[] =>
  catalog.filter((m) => m.applies_to.includes(type) && (m.category === "glass") === (slot === "glass"));

/** Part types that have no materials in the catalog are only measured, never restyled. */
export const canStyle = (catalog: Material[], type: RegionType): boolean => catalog.some((m) => m.applies_to.includes(type));

export const indexById = (catalog: Material[]): Map<string, Material> => new Map(catalog.map((m) => [m.id, m]));
