import type { Point } from "../../types";
import type { MaskLayer } from "../../hooks/useMaskLayers";

const OUTLINE = "#ff9f1c";

/** Draws the confirmed parts and the outline being drawn. */
export function drawParts(ctx: CanvasRenderingContext2D, pixelRatio: number, layers: Iterable<MaskLayer>, outline: Point[]): void {
  ctx.globalAlpha = 0.45;
  for (const { canvas, x, y } of layers) ctx.drawImage(canvas, x, y);
  ctx.globalAlpha = 1;
  if (outline.length === 0) return;

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
