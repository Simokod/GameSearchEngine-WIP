import { AlertCircle, ExternalLink } from "lucide-react";
import { Store, StoreRatingInfo } from "@/types/store";
import { RatingWithVotes } from "./RatingWithVotes";
import { PriceDisplay } from "@/components/common/PriceDisplay";

interface StoreInfoItemProps {
  store: Store;
  storeInfo: StoreRatingInfo | null;
}

const StoreInformationItem: React.FC<StoreInfoItemProps> = ({
  store,
  storeInfo,
}: StoreInfoItemProps) => {
  return (
    <div
      className={`group relative p-2 rounded-lg border border-border transition-all duration-200 hover:border-primary hover:shadow-md cursor-pointer bg-card hover:bg-accent/50`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {store.name}
              </h4>
              {storeInfo?.price && (
                <span className="font-semibold text-green-700">
                  <PriceDisplay price={storeInfo.price} />
                </span>
              )}
            </div>
            <a
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${store.name} page in a new tab`}
              className="ml-1 text-muted-foreground hover:text-primary transition-colors"
              tabIndex={0}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4 align-middle" />
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {storeInfo ? (
              <>
                <RatingWithVotes
                  rating={storeInfo.rating}
                  maxRating={5}
                  votes={storeInfo.votes}
                />
              </>
            ) : (
              <span className="text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Failed to fetch
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreInformationItem;
