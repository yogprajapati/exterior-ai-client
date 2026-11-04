import type { Estimate, RenderStatus } from "../types";
import { http } from "./client";

const designPath = (projectId: string, designId: string) => `/api/projects/${projectId}/designs/${designId}`;

export const outputsApi = {
  estimate: (projectId: string, designId: string): Promise<Estimate> => http.json<Estimate>(`${designPath(projectId, designId)}/estimate`),
  preview: (projectId: string, designId: string): Promise<Blob> => http.blob(`${designPath(projectId, designId)}/preview`),
  render: (projectId: string, designId: string): Promise<Blob> => http.blob(`${designPath(projectId, designId)}/render`),
  renderStatus: (projectId: string, designId: string): Promise<RenderStatus> => http.json<RenderStatus>(`${designPath(projectId, designId)}/render/status`),
  startRender: (projectId: string, designId: string): Promise<RenderStatus> => http.json<RenderStatus>(`${designPath(projectId, designId)}/render`, { method: "POST" }),
  report: (projectId: string, designId: string): Promise<Blob> => http.blob(`${designPath(projectId, designId)}/report`),
};
