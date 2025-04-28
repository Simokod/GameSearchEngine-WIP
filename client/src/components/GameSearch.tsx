import { useState } from "react";
import { gameApi, type Game, type SearchParams } from "../services/api";

export function GameSearch() {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const params: SearchParams = {
        q: query,
        page_size: "10",
      };
      const response = await gameApi.search(params);
      setGames(response.games);
    } catch (err) {
      setError("Failed to search games. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 text-black">
      <div className="relative w-full mb-6">
        <div className="flex gap-2 ">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for games..."
            className="w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600 disabled:bg-blue-300 whitespace-nowrap"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game) => (
          <div key={game.id} className="border rounded p-4 bg-white shadow-sm">
            <h2 className="text-xl font-bold mb-2">{game.name}</h2>
            <div className="text-sm text-gray-600 mb-2">
              Released: {game.released}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Metacritic:</span>{" "}
              {game.metacritic}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Genres:</span>{" "}
              {game.genres.join(", ")}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Platforms:</span>{" "}
              {game.platforms.join(", ")}
            </div>
            {game.stores.length > 0 && (
              <div>
                <span className="font-semibold">Available at:</span>
                <ul className="list-disc list-inside">
                  {game.stores.map((store, index) => (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
