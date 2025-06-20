import { StoreIconBadge } from "@/components/common/StoreIcon";
import { Badge } from "@/components/ui/badge";
import { Store } from "@/types/store";

const StoresHeader: React.FC<{ stores: Store[] }> = ({ stores }) => {
  return (
    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
      Available Stores
      <Badge variant="outline" className="text-xs">
        {stores.length} available
      </Badge>
      {stores.map((store) => (
        <StoreIconBadge key={store.name} store={store.name} />
      ))}
    </h3>
  );
};

export default StoresHeader;
