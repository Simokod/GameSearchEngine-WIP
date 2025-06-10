import { GenreBadge } from "../../components/common/GenreBadge";

export const GenreBadges = ({ genres }: { genres: string[] }) => (
  <span className="flex flex-wrap gap-1 mt-1">
    {genres.map((genre) => (
      <GenreBadge key={genre} genre={genre} />
    ))}
  </span>
);
