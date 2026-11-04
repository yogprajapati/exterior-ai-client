import { useState } from "react";
import type { ImageSize } from "../types";
import { photoFrameStyle } from "./photoFrame";
import "./BeforeAfter.css";

interface BeforeAfterProps {
  before: string;
  after: string | null;
  size: ImageSize;
  afterLabel?: string;
}

/** Drag the divider to compare the original photo (left) with the redesigned one (right). */
export function BeforeAfter({ before, after, size, afterLabel = "Redesigned" }: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  return (
    <div className="compare photo-frame" style={photoFrameStyle(size)}>
      <div className="compare__frame photo-shape">
        <img src={before} alt="Original house" />
        {after && <img src={after} alt="Redesigned house" style={{ clipPath: `inset(0 0 0 ${position}%)` }} />}
        {after && <div className="compare__divider" style={{ left: `${position}%` }} />}
        <span className="compare__tag compare__tag--left">Original</span>
        {after && <span className="compare__tag compare__tag--right">{afterLabel}</span>}
      </div>
      {after && (
        <input
          className="compare__slider"
          type="range"
          min={0}
          max={100}
          value={position}
          aria-label="Compare original and redesigned"
          onChange={(e) => setPosition(Number(e.target.value))}
        />
      )}
    </div>
  );
}
