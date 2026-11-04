export const queryKeys = {
  health: ["health"] as const,
  catalog: ["catalog"] as const,
  project: (id: string) => ["project", id] as const,
  detection: (id: string) => ["detection", id] as const,
  detectedParts: (id: string) => ["detected-parts", id] as const,
  renderStatus: (id: string, designId: string, version: string) => ["render-status", id, designId, version] as const,
  scale: (id: string, plane: unknown) => ["scale", id, plane] as const,
  // `version` is the project's updated_at, so outputs refetch after every saved change
  estimate: (id: string, designId: string, version: string) => ["estimate", id, designId, version] as const,
  preview: (id: string, designId: string, version: string) => ["preview", id, designId, version] as const,
  render: (id: string, designId: string, version: string) => ["render", id, designId, version] as const,
};
