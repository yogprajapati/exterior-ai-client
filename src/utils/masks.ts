import type { ImageSize, Point } from "../types";

// the server writes URL-safe base64, which a data URL does not accept
const pngDataUrl = (base64: string): string => `data:image/png;base64,${base64.replaceAll("-", "+").replaceAll("_", "/")}`;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load image"));
    image.src = src;
  });
}

function hexToRgb(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
}

export interface TintedMask {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
}

/** The mask's white area filled with `color`, cropped to its bounding box (a part is small next to the photo, and a photo can have a hundred parts). */
export async function tintMask(maskPng: string, color: string): Promise<TintedMask> {
  const image = await loadImage(pngDataUrl(maskPng));
  const { naturalWidth: width, naturalHeight: height } = image;
  const source = document.createElement("canvas");
  source.width = width;
  source.height = height;
  const sourceCtx = source.getContext("2d", { willReadFrequently: true })!;
  sourceCtx.drawImage(image, 0, 0);
  const { data } = sourceCtx.getImageData(0, 0, width, height);

  let [x0, y0, x1, y1] = [width, height, -1, -1];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4] <= 127) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(x1 - x0 + 1, 1);
  canvas.height = Math.max(y1 - y0 + 1, 1);
  if (x1 < 0) return { canvas, x: 0, y: 0 };
  const ctx = canvas.getContext("2d")!;
  const pixels = ctx.createImageData(canvas.width, canvas.height);
  const [r, g, b] = hexToRgb(color);
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const out = (y * canvas.width + x) * 4;
      pixels.data[out] = r;
      pixels.data[out + 1] = g;
      pixels.data[out + 2] = b;
      pixels.data[out + 3] = data[((y0 + y) * width + x0 + x) * 4] > 127 ? 255 : 0;
    }
  }
  ctx.putImageData(pixels, 0, 0);
  return { canvas, x: x0, y: y0 };
}

/** White polygon on black, as the base64 PNG mask format the server expects. */
export function polygonToMask(points: Point[], { width, height }: ImageSize): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.closePath();
  ctx.fill();
  return canvas.toDataURL("image/png").split(",")[1];
}
