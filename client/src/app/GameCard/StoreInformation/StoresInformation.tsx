import React, { useMemo } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Store } from "@/types/store";
import { useStoreInfo } from "../../../hooks/useStoreInfo";
import StoreInformationItem from "./StoreInformationItem";
import Disclaimer from "./Disclaimer";
import StoresHeader from "./StoresHeader";

const LoadingSkeletons: React.FC = () => (
  <div className="p-6">
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center text-muted-foreground p-6">
    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
    <p>No store information available</p>
  </div>
);

const StoresInformation: React.FC<{ stores: Store[] }> = ({ stores = [] }) => {
  const memoizedStores = useMemo(
    () => stores.map((s) => ({ id: s.id, name: s.name, url: s.url })),
    [stores]
  );
  const { info, isLoading } = useStoreInfo(memoizedStores);

  if (!stores || stores.length === 0) {
    return (
      <Accordion
        type="single"
        collapsible
        className="w-full mt-4 border border-border bg-card rounded-lg"
      >
        <AccordionItem value="store-info">
          <AccordionTrigger className="p-4 rounded-t-lg border-b border-border bg-card">
            <StoresHeader storesCount={0} />
          </AccordionTrigger>
          <AccordionContent>
            <EmptyState />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full mt-4 border border-border bg-card rounded-lg"
    >
      <AccordionItem value="store-info">
        <AccordionTrigger className="p-4 rounded-t-lg border-b border-border bg-card">
          <StoresHeader storesCount={stores.length} />
        </AccordionTrigger>
        <AccordionContent>
          {isLoading ? (
            <LoadingSkeletons />
          ) : (
            <div className="px-3 py-2 gap-0">
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
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default StoresInformation;
