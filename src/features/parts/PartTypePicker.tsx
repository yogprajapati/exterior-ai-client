import { REGION_ORDER, REGION_TYPES } from "../../config/regionTypes";
import type { Region, RegionType } from "../../types";
import "./parts.css";

interface PartTypePickerProps {
  value: RegionType;
  regions: Region[];
  onChange: (type: RegionType) => void;
}

export function PartTypePicker({ value, regions, onChange }: PartTypePickerProps) {
  return (
    <div className="type-picker" role="radiogroup" aria-label="What are you marking?">
      {REGION_ORDER.map((type) => {
        const { label, icon, color } = REGION_TYPES[type];
        const count = regions.filter((r) => r.type === type).length;
        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={type === value}
            className="type-picker__option"
            style={{ borderColor: type === value ? color : undefined }}
            onClick={() => onChange(type)}
          >
            <span aria-hidden="true">{icon}</span>
            <span>{label}</span>
            {count > 0 && <span className="type-picker__count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
