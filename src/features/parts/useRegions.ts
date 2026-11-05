import { useState } from "react";
import type { Region } from "../../types";

export function useRegions(initial: Region[]) {
  const [regions, setRegions] = useState(initial);
  const [removed, setRemoved] = useState<Region[]>([]);

  const remove = (id: string) => {
    const target = regions.find((region) => region.id === id);
    if (!target) return;
    setRegions((current) => current.filter((region) => region.id !== id));
    setRemoved((current) => [...current, target]);
  };

  const undoRemove = () => {
    const restored = removed.at(-1);
    if (!restored) return;
    setRemoved((current) => current.slice(0, -1));
    setRegions((current) => [...current, restored]);
  };

  return {
    regions,
    canUndoRemove: removed.length > 0,
    add: (added: Region[]) => setRegions((current) => [...current, ...added]),
    update: (id: string, patch: Partial<Region>) => setRegions((current) => current.map((region) => (region.id === id ? { ...region, ...patch } : region))),
    remove,
    undoRemove,
  };
}
