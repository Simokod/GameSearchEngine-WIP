import { JSX } from "react";
import {
  SiPlaystation,
  SiSteam,
  SiNintendo,
  SiEpicgames,
  SiItchdotio,
  SiGogdotcom,
} from "react-icons/si";
import { FaXbox } from "react-icons/fa";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const storeIconMap: Record<string, JSX.Element> = {
  steam: <span className="text-blue-900">{<SiSteam size={16} />}</span>,
  xbox: <span className="text-green-700">{<FaXbox size={16} />}</span>,
  playstation: (
    <span className="text-blue-700">{<SiPlaystation size={16} />}</span>
  ),
  nintendo: (
    <span style={{ display: "flex", alignItems: "center", height: 16 }}>
      <SiNintendo
        size={50}
        className="text-red-600"
        style={{ display: "block" }}
      />
    </span>
  ),
  epicgames: <span>{<SiEpicgames size={16} />}</span>,
  itch: <span>{<SiItchdotio size={16} />}</span>,
  gog: <span>{<SiGogdotcom size={16} />}</span>,
};

const getStoreIcon = (store: string) => {
  if (store.toLowerCase().includes("xbox")) {
    return storeIconMap.xbox;
  }
  if (store.toLowerCase().includes("playstation")) {
    return storeIconMap.playstation;
  }
  if (store.toLowerCase().includes("nintendo")) {
    return storeIconMap.nintendo;
  }
  if (store.toLowerCase().includes("epic")) {
    return storeIconMap.epicgames;
  }
  if (store.toLowerCase().includes("gog")) {
    return storeIconMap.gog;
  }
  if (store.toLowerCase().includes("itch")) {
    return storeIconMap.itch;
  }

  if (storeIconMap[store.toLowerCase()]) {
    return storeIconMap[store.toLowerCase()];
  }

  return <span>{store}</span>;
};

export const StoreIconBadge = ({ store }: { store: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className="text-xs">
          {getStoreIcon(store)}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{store}</TooltipContent>
    </Tooltip>
  );
};
