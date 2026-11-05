import { useState } from "react";
import type { ImageSize, Point } from "../../types";
import { polygonToMask } from "../../utils/masks";

const MIN_OUTLINE_POINTS = 3;

export function useOutline(size: ImageSize) {
  const [points, setPoints] = useState<Point[]>([]);
  const reset = () => setPoints([]);
  const toMask = () => polygonToMask(points, size);

  return {
    points,
    canAdd: points.length >= MIN_OUTLINE_POINTS,
    addPoint: (point: Point) => setPoints((current) => [...current, point]),
    undo: () => setPoints((current) => current.slice(0, -1)),
    reset,
    toMask,
    take: () => {
      const mask = toMask();
      reset();
      return mask;
    },
  };
}
