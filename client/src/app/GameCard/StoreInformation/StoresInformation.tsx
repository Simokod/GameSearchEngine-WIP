import React, { useMemo } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Store } from "@/types/store";
import { useStoreInfo } from "../../../hooks/useStoreInfo";
import StoresHeader from "./StoresHeader";
import StoreInformationItem from "./StoreInformationItem";
import Disclaimer from "./Disclaimer";

const StoresInformation: React.FC<{
  stores: Store[];
}> = ({ stores = [] }) => {
  if (!stores || stores.length === 0) {
    return (
      <Card className={`p-6`}>
        <div className="text-center text-muted-foreground">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>No store information available</p>
        </div>
      </Card>
    );
  }

  const memoizedStores = useMemo(
    () => stores.map((s) => ({ id: s.id, name: s.name, url: s.url })),
    [stores]
  );

  const { info, isLoading } = useStoreInfo(memoizedStores);

  if (isLoading) {
    return (
      <Card className={`p-6`}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Loading store information...
            </h3>
          </div>
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`px-3 py-2 gap-0`}>
      <StoresHeader storesCount={stores.length} />
      <div className="space-y-1">
        {stores.map((store) => {
          const storeInfo = info[store.name.toLowerCase()];
          return (
            <StoreInformationItem
              key={store.id}
              store={store}
              storeInfo={storeInfo}
            />
          );
        })}
      </div>
      <Disclaimer />
    </Card>
  );
};

export default StoresInformation;
