import { Rating } from "../../services/api";

export const RawgGameRatings = ({
    rating,
    ratings,
  }: {
    rating: number;
    ratings: Rating[];
  }) => {
    const getRatingColor = (title: string) => {
      switch (title.toLowerCase()) {
        case "exceptional":
          return "bg-green-100 text-green-800";
        case "recommended":
          return "bg-blue-100 text-blue-800";
        case "meh":
          return "bg-yellow-100 text-yellow-800";
        case "skip":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };
  
    if (!rating && !ratings?.length) return null;
  
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          RAWG Ratings
        </h3>
        <div className="space-y-3">
          {rating > 0 && (
            <div>
              <span className="font-semibold">Overall:</span>{" "}
              <span className="font-medium">{rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500"> / 5</span>
            </div>
          )}
          {ratings?.length > 0 && (
            <div>
              <span className="font-semibold">User Distribution:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {ratings.map((rating) => (
                  <div
                    key={rating.id}
                    className={`rounded-full px-3 py-1 text-sm flex items-center gap-2 ${getRatingColor(
                      rating.title
                    )}`}
                    title={`${rating.count} users rated this ${rating.title}`}
                  >
                    <span>{rating.title}</span>
                    <span className="font-medium">{rating.percent}%</span>
                    <span className="text-xs">({rating.count})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };