import axios from "axios";
import { SteamspyGameInfo } from "../../types/steamspy";

export class SteamSpyApiClient {
  private baseUrl = "https://steamspy.com/api.php";
  private api: Axios.AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
    });
  }

  async getGameInfo(url: string): Promise<SteamspyGameInfo> {
    const match = url.match(/store\.steampowered\.com\/app\/(\d+)/);
    const appid = match ? match[1] : null;
    if (!appid) {
      throw new Error("Invalid Steam URL");
    }

    const response = await this.api.get(`?request=appdetails&appid=${appid}`);
    console.log("steamSpyApi GameInfo Response:", response.data);
    return response.data as SteamspyGameInfo;
  }
}
