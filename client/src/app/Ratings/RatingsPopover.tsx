import { Game } from "../../services/api";
import { MetacriticRatings } from "./MetacriticRatings";

import { RawgGameRatings } from "./RawgRatings";

export const RatingsPopover = ({ game }: { game: Game }) => {
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