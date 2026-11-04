import type { ReactNode } from "react";
import { Button } from "../../components/ui/Button";
import type { Material } from "../../types";
import { MIXED } from "./designs";
import { MaterialSwatch } from "./MaterialSwatch";
import "./materials.css";

interface PartMaterialRowProps {
  title: string;
  material: Material | null | typeof MIXED;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

/** One part (or group of parts) with its current material; opens to a material picker. */
export function PartMaterialRow({ title, material, open, onToggle, children }: PartMaterialRowProps) {
  return (
    <div className="part-row">
      <div className="part-row__head">
        <strong>{title}</strong>
        <span className="part-row__current">
          {material === MIXED ? "Mixed" : material ? (<><MaterialSwatch material={material} /> {material.name}</>) : <span className="muted">Original</span>}
        </span>
        <Button size="small" variant="secondary" aria-expanded={open} onClick={onToggle}>
          {open ? "Done" : "Change"}
        </Button>
      </div>
      {open && children}
    </div>
  );
}
