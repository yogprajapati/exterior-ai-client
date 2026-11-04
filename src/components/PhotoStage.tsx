import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { ImageSize, Point } from "../types";
import { photoFrameStyle } from "./photoFrame";
import { Spinner } from "./ui/Spinner";
import "./PhotoStage.css";

interface PhotoStageProps {
  src: string;
  size: ImageSize;
  /** Draws on the overlay in photo pixels; `pixelRatio` is photo pixels per screen pixel, for constant-size marks. */
  draw: (ctx: CanvasRenderingContext2D, pixelRatio: number) => void;
  onPointerDown?: (point: Point, pixelRatio: number) => void;
  onPointerMove?: (point: Point) => void;
  onPointerUp?: () => void;
  busyLabel?: string;
}

/** The house photo with a transparent drawing layer on top and click/drag input in photo coordinates. */
export function PhotoStage({ src, size, draw, onPointerDown, onPointerMove, onPointerUp, busyLabel }: PhotoStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pixelRatio, setPixelRatio] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const observer = new ResizeObserver(() => setPixelRatio(size.width / canvas.clientWidth));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [size.width]);

  useEffect(() => {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.clearRect(0, 0, size.width, size.height);
    draw(ctx, pixelRatio);
  }, [draw, pixelRatio, size]);

  const toPhotoPoint = (event: PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return [((event.clientX - rect.left) * size.width) / rect.width, ((event.clientY - rect.top) * size.height) / rect.height];
  };

  return (
    <div className="stage photo-frame photo-shape" style={photoFrameStyle(size)}>
      <img src={src} alt="Your house" draggable={false} />
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          onPointerDown?.(toPhotoPoint(e), pixelRatio);
        }}
        onPointerMove={(e) => onPointerMove?.(toPhotoPoint(e))}
        onPointerUp={onPointerUp}
      />
      {busyLabel && (
        <div className="stage__busy">
          <Spinner label={busyLabel} />
        </div>
      )}
    </div>
  );
}
