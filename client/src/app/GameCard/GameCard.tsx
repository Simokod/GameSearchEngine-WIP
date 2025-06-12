import { useMemo } from "react";
import { Game } from "../../services/api";
import { GenreBadges } from "./GenreBadges";
import { PlatformIcons } from "./PlatformIcons";
import StoreInformation from "./StoreInformation/StoresInformation";

const TitleAndWebsite = ({
  name,
  website,
  released,
}: {
  name: string;
  website: string;
  released: string;
}) => (
  <div className="flex justify-between items-start gap-x-2">
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
  const mappedStores = useMemo(
    () =>
      game.stores.map((store, idx) => ({
        id: String(idx),
        name: store.name,
        url: store.url,
      })),
    [game.stores]
  );
  return (
    <div className="group relative border rounded p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex">
        <div className="flex flex-1 flex-col gap-y-2">
          <TitleAndWebsite
            name={game.name}
            website={game.website}
            released={game.released}
          />
          <div className="text-sm text-gray-600">{game.description}</div>
          <GenresAndPlatforms genres={game.genres} platforms={game.platforms} />
          <StoreInformation stores={mappedStores} />
        </div>
      </div>
    </div>
  );
};
