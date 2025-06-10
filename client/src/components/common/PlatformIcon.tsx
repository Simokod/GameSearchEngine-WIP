import type { JSX } from "react";
import { SiPlaystation, SiNintendo } from "react-icons/si";
import { FaXbox, FaDesktop } from "react-icons/fa";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export const platformIconMap: Record<
  string,
  { icon: JSX.Element; label: string }
> = {
  PC: { icon: <FaDesktop size={22} className="text-gray-700" />, label: "PC" },
  PlayStation: {
    icon: <SiPlaystation size={22} className="text-blue-700" />,
    label: "PlayStation",
  },
  Xbox: {
    icon: <FaXbox size={22} className="text-green-700" />,
    label: "Xbox",
  },
  Nintendo: {
    icon: (
      <span style={{ display: "flex", alignItems: "center", height: 22 }}>
        <SiNintendo
          size={50}
          className="text-red-600"
          style={{ display: "block" }}
        />
      </span>
    ),
    label: "Nintendo",
  },
};

export function PlatformIcon({
  platformKey,
  subPlatforms,
}: {
  platformKey: string;
  subPlatforms: string[];
}) {
  const entry = platformIconMap[platformKey];
  if (!entry) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span title={entry.label} aria-label={entry.label}>
          {entry.icon}
        </span>
      </TooltipTrigger>
      <TooltipContent>{subPlatforms.join(", ")}</TooltipContent>
    </Tooltip>
  );
}
