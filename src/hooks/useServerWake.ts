import { useQuery } from "@tanstack/react-query";
import { healthApi } from "../api/health";
import { queryKeys } from "../api/queryKeys";
import { useDelayedFlag } from "./useDelayedFlag";

/** Pings the server on load: free hosting sleeps when idle, and the first request wakes it. */
export function useServerWake(): { isWaking: boolean } {
  const { isPending } = useQuery({
    queryKey: queryKeys.health,
    queryFn: healthApi.check,
    retry: Infinity,
    retryDelay: 3000,
    staleTime: Infinity,
  });
  return { isWaking: useDelayedFlag(isPending) };
}
