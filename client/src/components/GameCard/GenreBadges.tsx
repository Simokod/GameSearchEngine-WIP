import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const genreColorMap: Record<string, string> = {
  Action: "bg-red-100 text-red-800",
  Adventure: "bg-blue-100 text-blue-800",
  RPG: "bg-purple-100 text-purple-800",
  Strategy: "bg-green-100 text-green-800",
  Shooter: "bg-yellow-100 text-yellow-800",
  Puzzle: "bg-pink-100 text-pink-800",
  Racing: "bg-indigo-100 text-indigo-800",
  Sports: "bg-orange-100 text-orange-800",
  Simulation: "bg-teal-100 text-teal-800",
  Horror: "bg-gray-800 text-gray-100",
  Platformer: "bg-lime-100 text-lime-800",
  Fighting: "bg-fuchsia-100 text-fuchsia-800",
  Music: "bg-emerald-100 text-emerald-800",
  Casual: "bg-pink-100 text-pink-800",
  Indie: "bg-cyan-100 text-cyan-800",
  MMO: "bg-cyan-100 text-cyan-800",
  Card: "bg-violet-100 text-violet-800",
  Board: "bg-amber-100 text-amber-800",
  Educational: "bg-sky-100 text-sky-800",
};

function GenreBadge({ genre }: { genre: string }) {
  return (
    <Badge
      className={cn(
        genreColorMap[genre] || "bg-gray-100 text-gray-800",
        "px-2 py-0.5 rounded"
      )}
    >
      {genre}
    </Badge>
  );
}

export const GenreBadges = ({ genres }: { genres: string[] }) => (
  <span className="flex flex-wrap gap-1 mt-1">
    {genres.map((genre) => (
      <GenreBadge key={genre} genre={genre} />
    ))}
  </span>
);
