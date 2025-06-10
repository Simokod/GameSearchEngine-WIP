import { useState } from "react";
import { gameApi } from "../../services/api";
import { AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScoreBadge } from "../Ratings/ScoreBadge";

export interface StoreInfo {
  rating: number;
  votes: number;
}

const StoreInfoItem = ({
  store,
  info,
}: {
  store: string;
  info: StoreInfo | null;
}) => (
  <div className="flex flex-col space-y-1 border-b border-border last:border-0 transition-colors hover:bg-accent/40 px-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:gap-2">
    <span className="font-medium text-foreground py-2 sm:py-3">{store}</span>
    {info ? (
      info.rating === -1 ? (
        <span className="flex items-center gap-1 text-xs text-destructive/80 font-medium sm:text-sm">
          <AlertCircle className="w-4 h-4" /> Failed to fetch
        </span>
      ) : (
        <div className="flex items-center">
          <ScoreBadge score={info.rating} />
          <span className="text-xs text-muted-foreground ml-2">
            {info.votes.toLocaleString()} vote{info.votes === 1 ? "" : "s"}
          </span>
        </div>
      )
    ) : (
      <Skeleton className="h-5 w-12" />
    )}
  </div>
);

export const GameStoreInfo = ({
  stores,
}: {
  stores: { name: string; url: string }[];
}) => {
  const [info, setInfo] = useState<Record<string, StoreInfo | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchAllInfo = async () => {
    if (hasFetched || fetching) return;
    setFetching(true);
    setHasFetched(true);
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
    } catch (e) {
      setError("Failed to fetch store information.");
    } finally {
      setFetching(false);
    }
  };

  if (!stores.length) return null;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full mt-4 border border-border bg-card rounded-lg"
    >
      <AccordionItem value="store-info">
        <AccordionTrigger
          className="p-4 rounded-t-lg border-b border-border bg-card"
          onClick={() => !hasFetched && fetchAllInfo()}
        >
          <span className="font-semibold underline">Store Ratings</span>
        </AccordionTrigger>
        <AccordionContent>
          {error ? (
            <Alert variant="destructive" className="mx-4 mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="bg-card overflow-hidden rounded-b-lg">
              {stores.map((storeObj) => {
                const store = storeObj.name.toLowerCase();
                const curStoreInfo = info[store];
                return (
                  <StoreInfoItem
                    key={store}
                    store={storeObj.name}
                    info={curStoreInfo}
                  />
                );
              })}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default GameStoreInfo;
