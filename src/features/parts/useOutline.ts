import { useState } from "react";
import type { ImageSize, Point } from "../../types";
import { polygonToMask } from "../../utils/masks";

const MIN_OUTLINE_POINTS = 3;

/** A part being drawn by hand: click around its edge, then take the finished mask. */
export function useOutline(size: ImageSize) {
  const [points, setPoints] = useState<Point[]>([]);
  return {
    points,
    canAdd: points.length >= MIN_OUTLINE_POINTS,
    addPoint: (point: Point) => setPoints((current) => [...current, point]),
    undo: () => setPoints((current) => current.slice(0, -1)),
    reset: () => setPoints([]),
    /** The finished mask; clears the outline so the next part can start. */
    take: (): string => {
      const mask = polygonToMask(points, size);
      setPoints([]);
      return mask;
    },
  };
}
