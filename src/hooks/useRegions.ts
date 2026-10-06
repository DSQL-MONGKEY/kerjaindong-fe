import { api } from "@/lib/http";
import type { Region } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const REGIONS_KEY = "regions";

export function useProvinces() {
  return useQuery({
    queryKey: [REGIONS_KEY, "PROVINCE"],
    queryFn: () =>
      api.get<Region[]>("/regions", { query: { level: "PROVINCE" } }),
    staleTime: Infinity,
  });
}

export function useRegencies(provinceCode?: string | null) {
  return useQuery({
    queryKey: [REGIONS_KEY, "REGENCY", provinceCode],
    queryFn: () =>
      api.get<Region[]>("/regions", {
        query: { level: "REGENCY", parentCode: provinceCode ?? undefined },
      }),
    enabled: Boolean(provinceCode),
    staleTime: Infinity,
  });
}
