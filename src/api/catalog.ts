import type { Material } from "../types";
import { apiUrl, http } from "./client";

export const catalogApi = {
  list: (): Promise<Material[]> => http.json<Material[]>("/api/catalog"),
  textureUrl: (file: string): string => apiUrl(`/textures/${file}`),
};
