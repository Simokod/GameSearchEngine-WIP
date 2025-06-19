import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  maxRating: number;
}

const Rating: React.FC<RatingProps> = ({
  rating,
  maxRating,
}: {
  rating: number;
  maxRating: number;
}) => {
  if (!rating) return null;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : i < rating
                ? "fill-yellow-200 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default Rating;

interface RatingWithVotesProps {
  rating: number | undefined;
  maxRating: number;
  votes?: number;
}

export const RatingWithVotes: React.FC<RatingWithVotesProps> = ({
  rating,
  maxRating,
  votes,
}) => {
  if (!rating) return null;

  return (
    <div className="flex items-center gap-2">
      <Rating rating={rating} maxRating={maxRating} />
      {typeof votes === "number" && votes > 0 && (
        <span className="text-xs text-muted-foreground ml-1">
          {votes.toLocaleString()} vote{votes === 1 ? "" : "s"}
        </span>
      )}
    </div>
  );
};
