import type { Plane, Point } from "../../types";

/** A surface being edited: its reference rectangle may still have fewer than four corners. */
export interface DraftPlane {
  id: string;
  name: string;
  corners: Point[];
  heightFt: number; // 0 until the user enters it
  widthFt: number; // only used for surfaces at an angle; otherwise the box's own proportions give the width
  perspective: boolean;
}

/** Things the user can box to give the photo a scale. Only the height is asked for: the box gives the proportions. */
export const REFERENCES = [
  { id: "door", label: "A door", help: "Most doors are about 7 ft tall.", heightFt: 7 },
  { id: "window", label: "A window", help: "Many windows are around 4 ft tall.", heightFt: 4 },
  { id: "other", label: "Something else", help: "A wall, a floor or anything you know the height of.", heightFt: 0 },
] as const;

export type ReferenceId = (typeof REFERENCES)[number]["id"];

/** The choice a saved height belongs to: a standard door or window height, otherwise the user's own. */
export const referenceOf = (heightFt: number): ReferenceId => REFERENCES.find((r) => r.id !== "other" && r.heightFt === heightFt)?.id ?? "other";

const MIN_BOX_PX = 12;

export const newPlane = (id: string, name: string): DraftPlane => ({
  id,
  name,
  corners: [],
  heightFt: REFERENCES[0].heightFt,
  widthFt: 0,
  perspective: false,
});

/** The four corners (top-left, top-right, bottom-right, bottom-left) of the rectangle dragged from `a` to `b`. */
export const rectangleCorners = ([ax, ay]: Point, [bx, by]: Point): Point[] => {
  const [x0, x1, y0, y1] = [Math.min(ax, bx), Math.max(ax, bx), Math.min(ay, by), Math.max(ay, by)];
  return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
};

export const isTinyBox = (corners: Point[]): boolean => corners.length === 4 && (corners[1][0] - corners[0][0] < MIN_BOX_PX || corners[2][1] - corners[1][1] < MIN_BOX_PX);

export const toDraft = (plane: Plane): DraftPlane => ({
  id: plane.id,
  name: plane.name,
  corners: plane.reference_quad.map(([x, y]): Point => [x, y]),
  heightFt: plane.ref_height_ft,
  widthFt: plane.ref_width_ft ?? 0,
  perspective: plane.perspective,
});

export const toPlane = (draft: DraftPlane): Plane => ({
  id: draft.id,
  name: draft.name,
  reference_quad: draft.corners as Plane["reference_quad"],
  ref_height_ft: draft.heightFt,
  ref_width_ft: draft.perspective ? draft.widthFt : null,
  perspective: draft.perspective,
});

export const isComplete = (draft: DraftPlane): boolean => draft.corners.length === 4 && draft.heightFt > 0 && (!draft.perspective || draft.widthFt > 0);
