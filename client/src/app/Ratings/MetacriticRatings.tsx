import { Game } from "../../services/api";

export const MetacriticScore = ({ score }: { score: number }) => {
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
  
  export const MetacriticRatings = ({
    score,
    platformRatings,
  }: {
    score?: number;
    platformRatings: Game["platform_ratings"];
  }) => {
    const hasAnyRatings = score || platformRatings.length > 0;
  
    if (!hasAnyRatings) return null;
  
    return (
      <div className="flex flex-col gap-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Metacritic Ratings
        </h3>
        <div className="flex flex-col gap-y-2">
          {score && (
            <div>
              <span className="font-semibold">Overall:</span>{" "}
              <MetacriticScore score={score} />
            </div>
          )}
          {platformRatings.length > 0 && (
            <div>
              <span className="font-semibold">By Platform:</span>
              <ul className="flex flex-col gap-y-1 mt-1">
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
  