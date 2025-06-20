import { useQuery } from "@tanstack/react-query";
import { gameApi } from "@/services/api";
import { Store } from "@/types/store";

export const useStoreInfo = (
  gameName: string,
  stores: Store[],
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["storeInfo", gameName, stores.map((s) => s.id).join(",")],
    queryFn: () =>
      gameApi.getGameInfo(
        stores.map((s) => ({
          store: s.name.toLowerCase(),
          url: s.url,
        }))
      ),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: stores.length > 0 && enabled,
  });
};
