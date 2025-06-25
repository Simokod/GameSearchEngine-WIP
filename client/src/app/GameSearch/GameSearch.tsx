import { useState } from "react";
import { gameApi, type Game, type SearchParams } from "../../services/api";
import { GameResults } from "../GameResults/GameResults";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { FaInfoCircle } from "react-icons/fa";

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
        query,
        pageSize,
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
        <div className="flex gap-2 mb-2 items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by game name or describe what you want (e.g., 'RPGs with deep story on PS5')..."
            className="w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className="cursor-pointer text-blue-500 flex items-center"
                tabIndex={0}
              >
                <FaInfoCircle size={20} />
              </span>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>
              You can search by game name or describe your preferences, genres,
              platforms, and more!
            </TooltipContent>
          </Tooltip>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-40 px-6 py-3 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600 disabled:bg-blue-300 whitespace-nowrap flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Searching...
              </span>
            ) : (
              "Search"
            )}
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="page-size-select" className="text-sm">
            Results per page:
          </label>
          <input
            className="w-14 h-8 p-2 border border-gray-300 rounded"
            type="number"
            min={1}
            max={100}
            value={pageSize}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val) && val > 0) setPageSize(val);
            }}
          />
        </div>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <GameResults games={games} />
    </div>
  );
}
