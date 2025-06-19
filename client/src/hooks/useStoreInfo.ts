import { useEffect, useState } from "react";
import { Store, StoreRatingInfo } from "@/types/store";
import { gameApi } from "@/services/api";

interface StoreInfoState {
  data: Record<string, StoreRatingInfo> | null;
  error: Error | null;
  isLoading: boolean;
}

export const useStoreInfo = (stores: Store[], maxRetries = 3) => {
  const [state, setState] = useState<StoreInfoState>({
    data: null,
    error: null,
    isLoading: false,
  });

  useEffect(() => {
    const fetchStoreInfo = async () => {
      if (!stores.length) {
        setState({ data: null, error: null, isLoading: false });
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const requests = stores.map((store) => ({
          store: store.name.toLowerCase(),
          url: store.url,
        }));

        const data = await gameApi.getGameInfo(requests);
        setState({ data, error: null, isLoading: false });
      } catch (error) {
        console.error("Failed to fetch store info:", error);
        setState({
          data: null,
          error: error as Error,
          isLoading: false,
        });
      }
    };

    fetchStoreInfo();
  }, [stores, maxRetries]);

  return state;
};
