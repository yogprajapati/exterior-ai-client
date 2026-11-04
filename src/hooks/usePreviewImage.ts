import { useQuery } from "@tanstack/react-query";
import { outputsApi } from "../api/outputs";
import { queryKeys } from "../api/queryKeys";
import { keepWithinDesign } from "./keepWithinDesign";
import { useObjectUrl } from "./useObjectUrl";

/** The quick recolour preview of a design, refetched whenever the saved project changes. */
export function usePreviewImage(projectId: string, designId: string, version: string, enabled = true) {
  const query = useQuery({
    queryKey: queryKeys.preview(projectId, designId, version),
    queryFn: () => outputsApi.preview(projectId, designId),
    enabled,
    placeholderData: keepWithinDesign<Blob>(designId),
  });
  return { url: useObjectUrl(query.data), isFetching: query.isFetching, error: query.error };
}
