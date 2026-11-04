import type { RegionType } from "../types";

interface RegionTypeInfo {
  label: string;
  icon: string;
  color: string;
  example: string; // a phrase that finds this kind of part by name
}

export const REGION_TYPES: Record<RegionType, RegionTypeInfo> = {
  wall: { label: "Wall", icon: "🧱", color: "#2f80ed", example: "compound wall" },
  window: { label: "Window", icon: "🪟", color: "#27ae60", example: "window" },
  door: { label: "Door", icon: "🚪", color: "#8e5a2b", example: "door" },
  balcony: { label: "Balcony", icon: "🏠", color: "#e2a31b", example: "balcony" },
  railing: { label: "Railing", icon: "🛡️", color: "#e74c3c", example: "grill" },
  pillar: { label: "Pillar", icon: "🏛️", color: "#9b51e0", example: "pillar" },
  parapet: { label: "Parapet", icon: "🔲", color: "#00a3a3", example: "terrace edge wall" },
  gate: { label: "Gate", icon: "⛩️", color: "#d35400", example: "gate" },
  roof_edge: { label: "Roof edge", icon: "📐", color: "#5d6d7e", example: "roof edge" },
};

export const REGION_ORDER = Object.keys(REGION_TYPES) as RegionType[];
