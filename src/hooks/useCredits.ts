import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import * as creditsService from "@/services/credits";

export const useCreditBalance = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["credits", user?.id],
    queryFn: () => {
      if (!user) throw new Error("Not authenticated");
      return creditsService.getCreditBalance(user.id);
    },
    enabled: !!user,
    staleTime: 5000,
    refetchInterval: 10000, // Poll every 10s for real-time updates
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
