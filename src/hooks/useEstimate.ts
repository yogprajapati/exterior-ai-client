import { useQuery } from "@tanstack/react-query";
import { outputsApi } from "../api/outputs";
import { queryKeys } from "../api/queryKeys";
import type { Estimate } from "../types";
import { keepWithinDesign } from "./keepWithinDesign";

export const useEstimate = (projectId: string, designId: string, version: string) =>
  useQuery({
    queryKey: queryKeys.estimate(projectId, designId, version),
    queryFn: () => outputsApi.estimate(projectId, designId),
    enabled: designId !== "",
    placeholderData: keepWithinDesign<Estimate>(designId), // keep the old numbers on screen while recalculating
  });
