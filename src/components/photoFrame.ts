import type { CSSProperties } from "react";
import type { ImageSize } from "../types";

/** The photo's shape for `.photo-frame` (narrows to fit the screen height) and `.photo-shape` (keeps that shape). */
export const photoFrameStyle = ({ width, height }: ImageSize): CSSProperties => ({ "--photo-ratio": width / height }) as CSSProperties;
