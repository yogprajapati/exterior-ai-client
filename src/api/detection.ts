import type { JobStatus, Region, RegionType } from "../types";
import { http } from "./client";

export const detectionApi = {
  status: (projectId: string): Promise<JobStatus> => http.json<JobStatus>(`/api/projects/${projectId}/detect`),
  start: (projectId: string): Promise<JobStatus> => http.json<JobStatus>(`/api/projects/${projectId}/detect`, { method: "POST" }),
  parts: (projectId: string): Promise<Region[]> => http.json<Region[]>(`/api/projects/${projectId}/detect/parts`),
  find: (projectId: string, phrase: string, type: RegionType): Promise<Region[]> =>
    http.sendJson<Region[]>("POST", `/api/projects/${projectId}/find`, { phrase, type }),
};
