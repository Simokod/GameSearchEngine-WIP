import { Game } from "../../services/api";
import { GameStoreInfo } from "./GameStoreInfo";
import { MetacriticScore } from "../Ratings/MetacriticRatings";
import { RatingsPopover } from "../Ratings/RatingsPopover";
import { GenreBadges } from "./GenreBadges";
import { PlatformIcons } from "./PlatformIcons";

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

const TitleAndWebsite = ({
  name,
  website,
  released,
  metacritic,
}: {
  name: string;
  website: string;
  released: string;
  metacritic: number;
}) => (
  <div className="flex justify-between items-start mb-2 gap-x-2">
    <div className="w-full">
      <h2 className="flex-1 text-2xl font-bold">{name}</h2>
      <div className="flex flex-row gap-x-1">
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline inline-block"
          >
            Official Website
          </a>
        )}
        <span className="text-sm text-gray-600"> - Released: {released}</span>
      </div>
    </div>
    <MetacriticScore score={metacritic} />
  </div>
);

const GenresAndPlatforms = ({
  genres,
  platforms,
}: {
  genres: string[];
  platforms: string[];
}) => (
  <div className="grid grid-cols-2">
    <div>
      <span className="font-semibold">Genres:</span>{" "}
      <GenreBadges genres={genres} />
    </div>
    <div>
      <span className="font-semibold">Platforms:</span>{" "}
      <PlatformIcons platforms={platforms} />
    </div>
  </div>
);

export const GameCard = ({ game }: { game: Game }) => {
  return (
    <div className="group relative border rounded p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-4">
        <div className="flex-1">
          <TitleAndWebsite
            name={game.name}
            website={game.website}
            released={game.released}
            metacritic={game.metacritic}
          />
          <GenresAndPlatforms genres={game.genres} platforms={game.platforms} />
          <GameStoreInfo stores={game.stores} />
        </div>

        <div className="w-50 border-l pl-6">
          <GameStores stores={game.stores} />
        </div>
      </div>
      <RatingsPopover game={game} />
    </div>
  );
};
