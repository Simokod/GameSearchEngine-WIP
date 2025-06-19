import { StoreRatingInfo } from "@/types/store";

interface PriceDisplayProps {
  price: StoreRatingInfo["price"];
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ price }) => {
  if (!price) return null;
  if (typeof price === "string") {
    return <>{`$${(parseInt(price, 10) / 100).toFixed(2)}`}</>;
  } else if (price.original && price.discounted) {
    return (
      <>
        <span className="line-through text-gray-500 mr-1">
          {price.symbol}
          {price.original}
        </span>
        <span>
          {price.symbol}
          {price.discounted}
        </span>
      </>
    );
  } else if (price.amount) {
    return <>{`${price.symbol || "$"}${price.amount}`}</>;
  }
  return null;
};
