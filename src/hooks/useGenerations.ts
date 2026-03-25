import { useQuery } from "@tanstack/react-query";
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

export const useGenerationStatus = (
  generationId: string | null,
  enabled = true,
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
      return 3000; // Poll every 3s while pending/processing
    },
  });
};
