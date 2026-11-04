import { useEffect, useRef, useState } from "react";
import { tintMask, type TintedMask } from "../utils/masks";

export type MaskLayer = TintedMask;

interface MaskItem {
  id: string;
  maskPng: string;
  color: string;
}

const cacheKey = (item: MaskItem) => `${item.color}|${item.maskPng}`;

/** Coloured overlay canvases for a list of masks, keyed by id. Each canvas is built once per mask and colour, and dropped when no longer used. */
export function useMaskLayers(items: MaskItem[]): Map<string, MaskLayer> {
  const cache = useRef(new Map<string, MaskLayer>());
  const [layers, setLayers] = useState(new Map<string, MaskLayer>());

  useEffect(() => {
    let active = true;
    Promise.all(items.map(async (item) => [item, cache.current.get(cacheKey(item)) ?? (await tintMask(item.maskPng, item.color))] as const)).then((built) => {
      if (!active) return;
      cache.current = new Map(built.map(([item, canvas]) => [cacheKey(item), canvas]));
      setLayers(new Map(built.map(([item, canvas]) => [item.id, canvas])));
    });
    return () => {
      active = false;
    };
  }, [items]);

  return layers;
}
