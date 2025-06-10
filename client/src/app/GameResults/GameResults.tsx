import { type Game } from "../../services/api";
import { GameCard } from "../GameCard/GameCard";

export const GameResults = ({ games }: { games: Game[] }) => (
  <div className="space-y-4 max-w-5xl">
    {games.map((game) => (
      <GameCard key={game.id} game={game} />
    ))}
  </div>
);
