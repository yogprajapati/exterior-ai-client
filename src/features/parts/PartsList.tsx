import { REGION_ORDER, REGION_TYPES } from "../../config/regionTypes";
import type { Plane, Region, RegionType } from "../../types";
import "./parts.css";

interface PartsListProps {
  regions: Region[];
  planes: Plane[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onChange: (id: string, patch: Partial<Pick<Region, "type" | "plane_id">>) => void;
  onDelete: (id: string) => void;
}

/** Marked parts, numbered per type, with controls to relabel, move to another surface, or remove. */
export function PartsList({ regions, planes, selectedId, onSelect, onChange, onDelete }: PartsListProps) {
  const seen: Partial<Record<RegionType, number>> = {};
  return (
    <ul className="parts-list">
      {regions.map((region) => {
        const number = (seen[region.type] = (seen[region.type] ?? 0) + 1);
        const { label, color } = REGION_TYPES[region.type];
        return (
          <li key={region.id} className={region.id === selectedId ? "parts-list__item parts-list__item--selected" : "parts-list__item"}>
            <span className="parts-list__dot" style={{ background: color }} aria-hidden="true" />
            <button type="button" className="parts-list__name" aria-pressed={region.id === selectedId} onClick={() => onSelect(region.id)}>
              {label} {number}
            </button>
            <select
              className="input parts-list__select"
              aria-label={`Type of ${label} ${number}`}
              value={region.type}
              onChange={(e) => onChange(region.id, { type: e.target.value as RegionType })}
            >
              {REGION_ORDER.map((type) => (
                <option key={type} value={type}>
                  {REGION_TYPES[type].label}
                </option>
              ))}
            </select>
            {planes.length > 1 && (
              <select
                className="input parts-list__select"
                aria-label={`Surface of ${label} ${number}`}
                value={region.plane_id}
                onChange={(e) => onChange(region.id, { plane_id: e.target.value })}
              >
                {planes.map((plane) => (
                  <option key={plane.id} value={plane.id}>
                    {plane.name}
                  </option>
                ))}
              </select>
            )}
            <button type="button" className="parts-list__delete" aria-label={`Remove ${label} ${number}`} onClick={() => onDelete(region.id)}>
              ✕
            </button>
          </li>
        );
      })}
    </ul>
  );
}
