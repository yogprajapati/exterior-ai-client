import { useState } from "react";
import { REGION_ORDER, REGION_TYPES } from "../../config/regionTypes";
import type { Design, Material, Region, RegionType } from "../../types";
import { canStyle, indexById, materialsForType, type Slot } from "../../utils/catalog";
import { pluralize } from "../../utils/format";
import { sharedMaterial } from "./designs";
import { MaterialGrid } from "./MaterialGrid";
import { PartMaterialRow } from "./PartMaterialRow";
import "./materials.css";

interface PartsMaterialsProps {
  regions: Region[];
  catalog: Material[];
  design: Design;
  onAssign: (regionIds: string[], materialId: string | null, slot: Slot) => void;
}

interface Choice {
  slot: Slot;
  title?: string; // overrides the part type's own name
}

/** Windows are two choices (frame and glass); every other part is one. */
const choicesFor = (type: RegionType): Choice[] =>
  type === "window"
    ? [
        { slot: "assignments", title: "Window frames" },
        { slot: "glass", title: "Window glass" },
      ]
    : [{ slot: "assignments" }];

/** Every part type that can be restyled, with a picker for the whole group and for individual parts. */
export function PartsMaterials({ regions, catalog, design, onAssign }: PartsMaterialsProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const byId = indexById(catalog);
  const toggle = (key: string) => setOpenKey((current) => (current === key ? null : key));
  const resolve = (ids: string[], slot: Slot) => {
    const shared = sharedMaterial(design, ids, slot);
    return typeof shared === "string" && shared !== "mixed" ? (byId.get(shared) ?? null) : shared;
  };
  const selectedId = (ids: string[], slot: Slot) => {
    const shared = sharedMaterial(design, ids, slot);
    return shared === "mixed" ? null : shared;
  };

  const groups = REGION_ORDER.filter((type) => canStyle(catalog, type))
    .map((type) => ({ type, parts: regions.filter((r) => r.type === type) }))
    .filter((group) => group.parts.length > 0);

  return (
    <div className="stack">
      {groups.map(({ type, parts }) => {
        const ids = parts.map((p) => p.id);
        const { label } = REGION_TYPES[type];
        return choicesFor(type).map(({ slot, title }) => {
          const options = materialsForType(catalog, type, slot);
          const key = `${type}:${slot}`;
          return (
            <div key={key} className="stack">
              <PartMaterialRow title={parts.length > 1 ? `${title ?? pluralize(label)} (all ${parts.length})` : (title ?? label)} material={resolve(ids, slot)} open={openKey === key} onToggle={() => toggle(key)}>
                <MaterialGrid materials={options} selectedId={selectedId(ids, slot)} onSelect={(materialId) => onAssign(ids, materialId, slot)} />
              </PartMaterialRow>
              {parts.length > 1 && (
                <details className="part-details">
                  <summary>Choose differently for individual {pluralize(label).toLowerCase()}</summary>
                  <div className="stack">
                    {parts.map((part, index) => (
                      <PartMaterialRow key={part.id} title={`${label} ${index + 1}`} material={resolve([part.id], slot)} open={openKey === `${key}:${part.id}`} onToggle={() => toggle(`${key}:${part.id}`)}>
                        <MaterialGrid materials={options} selectedId={selectedId([part.id], slot)} onSelect={(materialId) => onAssign([part.id], materialId, slot)} />
                      </PartMaterialRow>
                    ))}
                  </div>
                </details>
              )}
            </div>
          );
        });
      })}
    </div>
  );
}
