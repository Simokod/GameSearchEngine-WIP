import axios from "axios";
import { StoreApiClient, StoreGameInfo } from "./types";

interface SteamSpyGameInfo {
  positive: number;
  negative: number;
  price: string;
}

export class SteamSpyApiClient implements StoreApiClient {
  private baseUrl = "https://steamspy.com/api.php";
  private api: Axios.AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
    });
  }

  async getGameInfo(url: string): Promise<StoreGameInfo | null> {
    const match = url.match(/store\.steampowered\.com\/app\/(\d+)/);
    const appid = match ? match[1] : null;
    if (!appid) {
      throw new Error("Invalid Steam URL");
    }

    const response = await this.api.get<SteamSpyGameInfo>(
      `?request=appdetails&appid=${appid}`
    );
    // console.log("steamSpyApi GameInfo Response:", response.data);
    const gameInfo = response.data;
    return {
      rating: Number(
        (
          (gameInfo.positive / (gameInfo.positive + gameInfo.negative)) *
          100
        ).toFixed(2)
      ),
      votes: gameInfo.positive + gameInfo.negative,
      price: gameInfo.price as string,
    };
  }
}
