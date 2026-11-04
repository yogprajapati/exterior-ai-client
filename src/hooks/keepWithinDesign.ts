import type { Query } from "@tanstack/react-query";

/** Placeholder data for outputs: reuse the previous result only while viewing the same design, so a design switch never shows another design's figures. */
export const keepWithinDesign =
  <T>(designId: string) =>
  (previous: T | undefined, previousQuery: Query<T> | undefined): T | undefined =>
    previousQuery?.queryKey[2] === designId ? previous : undefined;
