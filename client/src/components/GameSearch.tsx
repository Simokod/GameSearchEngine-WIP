import { useState } from "react";

interface Store {
  name: string;
  url: string;
}

interface PlatformRating {
  platform: {
    name: string;
  };
  metascore: number;
}

interface Game {
  id: number;
  name: string;
  released: string;
  rating: number;
  metacritic: number;
  genres: string[];
  platforms: string[];
  stores: Store[];
  platform_ratings: PlatformRating[];
  playtime: number;
  website: string;
}

interface SearchResponse {
  games: Game[];
  count: number;
}

const GameSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/search?q=${encodeURIComponent(query)}`
      );
      const data: SearchResponse = await response.json();
      setResults(data.games);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative max-w-6xl mx-auto">
        <input
          type="text"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-900 placeholder:text-gray-400"
          placeholder="Search for games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${
            isLoading ? "opacity-75 cursor-not-allowed" : ""
          }`}
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="mt-8 max-w-4xl mx-auto px-4">
        {results.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {game.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Released: {game.released}
                </p>
                {game.website && (
                  <a
                    href={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 mt-1 block"
                  >
                    Official Website
                  </a>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Ratings & Stats
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm">RAWG Rating: {game.rating}/5</p>
                    {game.metacritic && (
                      <p className="text-sm">Metacritic: {game.metacritic}</p>
                    )}
                    {game.platform_ratings.map((pr) => (
                      <p key={pr.platform.name} className="text-sm">
                        {pr.platform.name}: {pr.metascore}
                      </p>
                    ))}
                    {game.playtime > 0 && (
                      <p className="text-sm mt-2">
                        Average Playtime: {game.playtime} hours
                      </p>
                    )}
                  </div>
                </div>

                {game.stores.length > 0 && (
                  <div className="flex-1 min-w-[200px]">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Available On
                    </h4>
                    <div className="space-y-1">
                      {game.stores.map((store) => (
                        <a
                          key={store.url}
                          href={store.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-blue-600 hover:text-blue-800"
                        >
                          {store.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Genres:</span>{" "}
                  {game.genres.join(", ")}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Platforms:</span>{" "}
                  {game.platforms.join(", ")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSearch;
