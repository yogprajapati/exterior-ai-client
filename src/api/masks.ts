import type { MaskData } from "../types";
import { http } from "./client";

export const masksApi = {
  grow: (maskPng: string, pixels: number): Promise<MaskData> => http.sendJson<MaskData>("POST", "/api/masks/grow", { mask_png: maskPng, pixels }),
  erase: (maskPng: string, erasePng: string): Promise<MaskData> => http.sendJson<MaskData>("POST", "/api/masks/erase", { mask_png: maskPng, erase_png: erasePng }),
};
