import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import * as generationsService from "@/services/generations";

export const useGenerations = (page = 0) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["generations", user?.id, page],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await generationsService.getGenerations(user.id, page);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 10000,
  });
};

const PAGE_SIZE = 12;

export const useInfiniteGenerations = () => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: ["generations-infinite", user?.id],
    queryFn: async ({ pageParam = 0 }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await generationsService.getGenerations(user.id, pageParam, PAGE_SIZE);
      if (error) throw error;
      return data ?? [];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return lastPageParam + 1;
    },
    enabled: !!user,
    staleTime: 10000,
  });
};

const POLLING_TIMEOUT_MS = 120_000; // 120 seconds max polling duration

export const useGenerationStatus = (
  generationId: string | null,
  enabled = true,
  startTime = 0,
) => {
  return useQuery({
    queryKey: ["generation-status", generationId],
    queryFn: () => {
      if (!generationId) throw new Error("No generation ID");
      return generationsService.checkGenerationStatus(generationId);
    },
    enabled: !!generationId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") return false;
      // Stop polling after timeout
      if (startTime > 0 && Date.now() - startTime >= POLLING_TIMEOUT_MS) return false;
      return 3000; // Poll every 3s while pending/processing
    },
  });
};
