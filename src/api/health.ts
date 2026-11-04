import { http } from "./client";

export const healthApi = {
  check: (): Promise<{ status: string; db: boolean }> => http.json("/health"),
};
