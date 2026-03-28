import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import * as creditsService from "@/services/credits";

export const useCreditBalance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Cross-tab credit sync: when another tab updates credits, invalidate cache
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "credits-updated") {
        queryClient.invalidateQueries({ queryKey: ["credits"] });
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [queryClient]);

  return useQuery({
    queryKey: ["credits", user?.id],
    queryFn: () => {
      if (!user) throw new Error("Not authenticated");
      return creditsService.getCreditBalance(user.id);
    },
    enabled: !!user,
    staleTime: 5000,
    refetchInterval: 30000, // Poll every 30s — credits only change after actions
  });
};

export const useCreditTransactions = (page = 0) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["credit-transactions", user?.id, page],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await creditsService.getCreditTransactions(user.id, page);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 30000,
  });
};
