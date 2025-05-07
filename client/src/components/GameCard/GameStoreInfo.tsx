import { useState } from "react";
import { gameApi } from "../../services/api";

interface StoreInfo {
  rating: number;
  votes: number;
}

export const GameStoreInfo = ({
  stores,
}: {
  stores: { name: string; url: string }[];
}) => {
  const [info, setInfo] = useState<Record<string, StoreInfo | null>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllInfo = async () => {
    setLoading(true);
    setError(null);
    setInfo({});
    try {
      const results = await Promise.all(
        stores.map(async (storeObj) => {
          try {
            const data = (await gameApi.getGameInfo(
              storeObj.name.toLowerCase(),
              storeObj.url
            )) as StoreInfo;
            return { store: storeObj.name, data };
          } catch {
            return { store: storeObj.name, data: { rating: -1, votes: 0 } };
          }
        })
      );
      const infoObj: Record<string, StoreInfo> = {};
      results.forEach(({ store, data }) => {
        infoObj[store.toLowerCase()] = data;
      });
      setInfo(infoObj);
    } catch (e) {
      setError("Failed to fetch store info.");
    } finally {
      setLoading(false);
    }
  };

  if (!stores.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <button
        onClick={fetchAllInfo}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-300"
      >
        {loading ? "Loading Store Info..." : "Fetch Store Info"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {Object.keys(info).length > 0 && (
        <div className="mt-2 space-y-1">
          {stores.map((storeObj) => {
            const store = storeObj.name.toLowerCase();
            const storeInfo = info[store];
            return (
              <div key={store} className="text-sm">
                <span className="font-semibold">{storeObj.name}:</span>{" "}
                {storeInfo ? (
                  storeInfo.rating === -1 ? (
                    <span className="text-red-500">
                      Failed to fetch rating.
                    </span>
                  ) : (
                    <span>
                      User Rating:{" "}
                      <span className="font-semibold">{storeInfo.rating}</span>{" "}
                      / 5
                      {storeInfo.votes > 0 && (
                        <span className="ml-2 text-gray-500">
                          ({storeInfo.votes} votes)
                        </span>
                      )}
                    </span>
                  )
                ) : (
                  <span>Loading...</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
