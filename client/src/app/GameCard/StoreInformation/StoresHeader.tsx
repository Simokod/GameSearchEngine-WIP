import { Badge } from "@/components/ui/badge";

const StoresHeader: React.FC<{ storesCount: number }> = ({ storesCount }) => {
  return (
    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
      Available Stores
      <Badge variant="outline" className="text-xs">
        {storesCount} available
      </Badge>
    </h3>
  );
};

export default StoresHeader;
