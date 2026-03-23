import { useQuery } from "@tanstack/react-query";
import { getPortraitCount } from "@/services/stats";

export const usePortraitCount = () => {
  return useQuery({
    queryKey: ["portrait-count"],
    queryFn: getPortraitCount,
    staleTime: 60_000, // Cache for 60s
    refetchInterval: 60_000, // Refresh every 60s
  });
};
