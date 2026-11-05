import type { MaskLayer } from "../../hooks/useMaskLayers";
import type { Point } from "../../types";

const OUTLINE = "#ff9f1c";

interface PartsOverlay {
  layers: Map<string, MaskLayer>;
  selectedId: string | null;
  outline: Point[];
}

function drawOutline(ctx: CanvasRenderingContext2D, pixelRatio: number, outline: Point[]): void {
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 3 * pixelRatio;
  ctx.beginPath();
  outline.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.stroke();
  ctx.fillStyle = OUTLINE;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2 * pixelRatio;
  for (const [x, y] of outline) {
    ctx.beginPath();
    ctx.arc(x, y, 7 * pixelRatio, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

export function drawParts(ctx: CanvasRenderingContext2D, pixelRatio: number, { layers, selectedId, outline }: PartsOverlay): void {
  ctx.globalAlpha = 0.45;
  for (const [id, { canvas, x, y }] of layers) {
    ctx.drawImage(canvas, x, y);
    if (id === selectedId) ctx.drawImage(canvas, x, y);
  }
  ctx.globalAlpha = 1;
  if (outline.length > 0) drawOutline(ctx, pixelRatio, outline);
}
