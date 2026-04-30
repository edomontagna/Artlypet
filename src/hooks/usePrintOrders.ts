import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchPrintOrders, type PrintOrderRow } from "@/services/orders";

export const usePrintOrders = () => {
  const { user } = useAuth();
  return useQuery<PrintOrderRow[]>({
    queryKey: ["print-orders", user?.id],
    queryFn: fetchPrintOrders,
    enabled: !!user,
    staleTime: 30_000,
  });
};
