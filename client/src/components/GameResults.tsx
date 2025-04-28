import { type Game, type Rating } from "../services/api";

const MetacriticScore = ({ score }: { score: number }) => {
  if (!score) return null;
  return (
    <span
      className={`px-2 py-1 rounded text-sm ${
        score >= 75
          ? "bg-green-100 text-green-800"
          : score >= 50
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {score}
    </span>
  );
};

const MetacriticRatings = ({
  score,
  platformRatings,
}: {
  score?: number;
  platformRatings: Game["platform_ratings"];
}) => {
  const hasAnyRatings = score || platformRatings.length > 0;

  if (!hasAnyRatings) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        Metacritic Ratings
      </h3>
      <div className="space-y-2">
        {score && (
          <div>
            <span className="font-semibold">Overall:</span>{" "}
            <MetacriticScore score={score} />
          </div>
        )}
        {platformRatings.length > 0 && (
          <div>
            <span className="font-semibold">By Platform:</span>
            <ul className="mt-1 space-y-1">
              {platformRatings.map((rating, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-gray-700">{rating.platform.name}:</span>
                  <span className="ml-2">
                    <MetacriticScore score={rating.metascore} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const RawgGameRatings = ({
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

const GameStores = ({ stores }: { stores: Game["stores"] }) => (
  <div>
    <span className="font-semibold">Available at:</span>
    <ul className="list-disc list-inside mt-1">
      {stores.map((store, index) => (
        <li key={index}>
          <a
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {store.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const RatingsPopover = ({ game }: { game: Game }) => {
  if (!game.metacritic && !game.ratings?.length)
    return (
      <div className="absolute left-full top-0 ml-4 w-80 bg-white border rounded-lg shadow-lg p-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="space-y-4">No ratings available</div>
      </div>
    );

  return (
    <div className="absolute left-full top-0 ml-4 w-80 bg-white border rounded-lg shadow-lg p-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      <div className="space-y-4">
        <MetacriticRatings
          score={game.metacritic}
          platformRatings={game.platform_ratings}
        />
        <RawgGameRatings rating={game.rating} ratings={game.ratings} />
      </div>
    </div>
  );
};

const GameCard = ({ game }: { game: Game }) => (
  <div className="group relative border rounded p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-bold">{game.name}</h2>
              <span className="text-sm text-gray-600">
                Released: {game.released}
              </span>
            </div>
            {game.website && (
              <a
                href={game.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline inline-block"
              >
                Official Website
              </a>
            )}
          </div>
          <MetacriticScore score={game.metacritic} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Genres:</span>{" "}
            <span className="text-gray-600">{game.genres.join(", ")}</span>
          </div>
          <div>
            <span className="font-semibold">Platforms:</span>{" "}
            <span className="text-gray-600">{game.platforms.join(", ")}</span>
          </div>
        </div>
      </div>

      <div className="w-64 border-l pl-8">
        <GameStores stores={game.stores} />
      </div>
    </div>
    <RatingsPopover game={game} />
  </div>
);

export const GameResults = ({ games }: { games: Game[] }) => (
  <div className="space-y-4 max-w-5xl mx-auto">
    {games.map((game) => (
      <GameCard key={game.id} game={game} />
    ))}
  </div>
);
