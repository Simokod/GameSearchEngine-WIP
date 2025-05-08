import { useState } from "react";
import { gameApi } from "../../services/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import clsx from "clsx";

export interface StoreInfo {
  rating: number;
  votes: number;
}

const StoreInfo = ({
  store,
  info,
}: {
  store: string;
  info: StoreInfo | null;
}) => (
  <div key={store} className="text-sm">
    <span className="font-semibold">{store}:</span>{" "}
    {info ? (
      info.rating === -1 ? (
        <span className="text-red-500">Failed to fetch rating.</span>
      ) : (
        <span>
          User Rating: <span className="font-semibold">{info.rating}</span> / 5
          {info.votes > 0 && (
            <span className="ml-2 text-gray-500">({info.votes} votes)</span>
          )}
        </span>
      )
    ) : (
      <span>Loading...</span>
    )}
  </div>
);

export const GameStoreInfo = ({
  stores,
}: {
  stores: { name: string; url: string }[];
}) => {
  const [info, setInfo] = useState<Record<string, StoreInfo | null>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchAllInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        stores.map(async (storeObj) => {
          try {
            const data = await gameApi.getGameInfo(
              storeObj.name.toLowerCase(),
              storeObj.url
            );
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
      setHasFetched(true);
    } catch (e) {
      setError("Failed to fetch store info.");
    } finally {
      setLoading(false);
    }
  };

  if (!stores.length) return null;

  const handleToggle = async () => {
    if (!expanded && !hasFetched) {
      await fetchAllInfo();
    }
    setExpanded((prev) => !prev);
  };

  return (
    <div className="mt-4 space-y-2">
      <button
        className={clsx(
          "w-8 h-8 flex items-center justify-center p-0 rounded-full",
          "text-white !bg-blue-500 !outline-none",
          expanded && "rotate-180"
        )}
        onClick={handleToggle}
        disabled={loading}
      >
        <ExpandMoreIcon fontSize="small" />
      </button>
      {expanded && (
        <>
          {loading && <div className="text-sm text-gray-500">Loading...</div>}
          {error && <div className="text-red-500 mt-2">{error}</div>}
          <div className="mt-2 space-y-1">
            {stores.map((storeObj) => {
              const store = storeObj.name.toLowerCase();
              const curStoreInfo = info[store];
              return (
                <StoreInfo
                  key={store}
                  store={storeObj.name}
                  info={curStoreInfo}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
