import { useState, useEffect } from "react";
import { gameApi } from "../services/api";
import { Store, StoreRatingInfo } from "@/types/store";

const MAX_RETRIES = 3;

async function fetchWithRetries(
  store: Store,
  maxRetries: number
): Promise<{ data: StoreRatingInfo | null; error?: any }> {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const data = await gameApi.getGameInfo(
        store.name.toLowerCase(),
        store.url
      );
      return { data };
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries) {
        return { data: null, error: err };
      }
    }
  }
  return { data: null, error: lastError };
}

export function useStoreInfo(stores: Store[]) {
  const [info, setInfo] = useState<Record<string, StoreRatingInfo | null>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchAllInfo() {
      setIsLoading(true);
      try {
        const results = await Promise.all(
          stores.map(async (storeObj) => {
            const { data, error } = await fetchWithRetries(
              storeObj,
              MAX_RETRIES
            );
            if (error) {
              console.error("Failed to fetch store information.", error);
              return {
                store: storeObj.name,
                data: null,
                error,
              };
            }
            return { store: storeObj.name, data };
          })
        );
        if (!cancelled) {
          const infoObj: Record<string, StoreRatingInfo | null> = {};
          results.forEach(({ store, data, error }) => {
            infoObj[store.toLowerCase()] = error ? null : data;
          });
          setInfo(infoObj);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Failed to fetch store information.", e);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    if (stores.length > 0) {
      fetchAllInfo();
    } else {
      setInfo({});
    }
    return () => {
      cancelled = true;
    };
  }, [stores]);

  return { info, isLoading };
}
