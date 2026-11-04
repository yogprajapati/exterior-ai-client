import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "../api/catalog";
import { queryKeys } from "../api/queryKeys";

export const useCatalog = () => useQuery({ queryKey: queryKeys.catalog, queryFn: catalogApi.list, staleTime: Infinity });
