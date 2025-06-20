import { useState } from "react";
import { gameApi, type Game, type SearchParams } from "../../services/api";
import { GameResults } from "../GameResults/GameResults";

const DEFAULT_PAGE_SIZE = 5;

export function GameSearch() {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const params: SearchParams = {
        q: query,
        page_size: pageSize,
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
    <div className="max-w-4xl p-4 ml-16 text-black">
      <div className="relative w-full mb-6">
        <div className="flex gap-2 mb-2">
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
            className="w-40 px-6 py-3 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600 disabled:bg-blue-300 whitespace-nowrap"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="page-size-select" className="text-sm">
            Results per page:
          </label>
          <span className="text-sm">or</span>
          <input
            type="number"
            min={1}
            max={100}
            value={pageSize}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val) && val > 0) setPageSize(val);
            }}
            className="w-20 p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <GameResults games={games} />
    </div>
  );
}
