import {
  platformIconMap,
  PlatformIcon,
} from "../../components/common/PlatformIcon";

function groupPlatforms(platforms: string[]) {
  const groups: Record<string, string[]> = {};
  console.log(platforms);
  platforms.forEach((platform) => {
    const key = Object.keys(platformIconMap).find((k) =>
      platform.toLowerCase().includes(k.toLowerCase())
    );
    if (key) {
      if (!groups[key]) groups[key] = [];
      groups[key].push(platform);
    }
  });
  return groups;
}

export const PlatformIcons = ({ platforms }: { platforms: string[] }) => {
  const groups = groupPlatforms(platforms);

  return (
    <span className="flex flex-row gap-2 items-center mt-1">
      {Object.entries(groups).map(([key, subPlatforms]) => (
        <PlatformIcon key={key} platformKey={key} subPlatforms={subPlatforms} />
      ))}
    </span>
  );
};
