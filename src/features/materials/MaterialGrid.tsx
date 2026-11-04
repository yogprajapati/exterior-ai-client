import { Fragment } from "react";
import { CATEGORY_LABELS } from "../../config/categories";
import type { Category, Material } from "../../types";
import { formatInr } from "../../utils/format";
import { MaterialSwatch } from "./MaterialSwatch";
import "./materials.css";

interface MaterialGridProps {
  materials: Material[];
  selectedId: string | null;
  onSelect: (materialId: string | null) => void;
}

/** The variant part of "Group – Variant", since the category heading already says what group it is. */
const shortName = (material: Material): string => material.name.split(" – ")[1] ?? material.name;

export function MaterialGrid({ materials, selectedId, onSelect }: MaterialGridProps) {
  const categories = [...materials.reduce((groups, m) => groups.set(m.category, [...(groups.get(m.category) ?? []), m]), new Map<Category, Material[]>())];
  return (
    <div className="material-grid" role="listbox" aria-label="Materials">
      <button type="button" role="option" aria-selected={selectedId === null} className="material-card" onClick={() => onSelect(null)}>
        <span className="swatch swatch--none" aria-hidden="true">
          ↺
        </span>
        <span className="material-card__name">Keep original</span>
      </button>
      {categories.map(([category, items]) => (
        <Fragment key={category}>
          <h5 className="material-grid__heading">{CATEGORY_LABELS[category]}</h5>
          {items.map((material) => (
            <button
              key={material.id}
              type="button"
              role="option"
              aria-selected={material.id === selectedId}
              className="material-card"
              title={material.info}
              onClick={() => onSelect(material.id)}
            >
              <MaterialSwatch material={material} />
              <span className="material-card__name">{shortName(material)}</span>
              <span className="muted small">{formatInr(material.rates.material_rate)} / {material.quantity.unit}</span>
            </button>
          ))}
        </Fragment>
      ))}
    </div>
  );
}
