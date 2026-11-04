import type { Point } from "../../types";
import type { DraftPlane } from "./planeDraft";

const ACTIVE_COLOR = "#ff9f1c";
const INACTIVE_COLOR = "rgb(255 255 255 / 0.7)";

/** Draws every surface's reference rectangle; the active one is highlighted with numbered, draggable corners. */
export function drawPlanes(ctx: CanvasRenderingContext2D, planes: DraftPlane[], activeId: string, pixelRatio: number): void {
  for (const plane of planes) {
    const active = plane.id === activeId;
    ctx.strokeStyle = active ? ACTIVE_COLOR : INACTIVE_COLOR;
    ctx.fillStyle = active ? "rgb(255 159 28 / 0.2)" : "rgb(255 255 255 / 0.1)";
    ctx.lineWidth = 3 * pixelRatio;
    ctx.beginPath();
    plane.corners.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    if (plane.corners.length === 4) ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (active) plane.corners.forEach((corner, i) => drawHandle(ctx, corner, i, pixelRatio));
  }
}

function drawHandle(ctx: CanvasRenderingContext2D, [x, y]: Point, index: number, pixelRatio: number): void {
  const radius = 13 * pixelRatio;
  ctx.fillStyle = ACTIVE_COLOR;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2 * pixelRatio;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#1d2b32";
  ctx.font = `bold ${15 * pixelRatio}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(index + 1), x, y + pixelRatio);
}
