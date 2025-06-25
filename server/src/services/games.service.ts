import {
  SearchQueryParams,
  SearchResponse,
  FullGameInfo,
  StoreRequest,
} from "../routes/types";
import { STORE_NAMES, StoreName } from "../constants";
import { RawgApiClient } from "./clients/rawgApi";
import { SteamSpyApiClient } from "./clients/stores/steamspyApi";
import { GogApiClient } from "./clients/stores/gogApi";
import { StoreGameInfo } from "./clients/stores/types";
import { RawgGame } from "./clients/types";

class GamesService {
  rawgApiClient = new RawgApiClient();
  steamSpyApiClient = new SteamSpyApiClient();
  gogApiClient = new GogApiClient();

  async initializeStoresCache() {
    await this.rawgApiClient.initializeStoresCache();
  }

  private async getGameInfo(game: RawgGame): Promise<FullGameInfo> {
    const partialResult = {
      id: game.id,
      name: game.name,
      released: game.released,
      rating: game.rating,
      genres: game.genres?.map((g) => g.name),
      platforms: game.platforms?.map((p) => p.platform.name),
    };

    try {
      const detailsResponse = await this.rawgApiClient.getGameDetails(game.id);
      const storesResponse = await this.rawgApiClient.getGameStores(game.id);

      const stores = storesResponse.results
        .filter((s) => this.rawgApiClient.getStoreName(s.store_id))
        .map((s) => ({
          name: this.rawgApiClient.getStoreName(s.store_id),
          url: s.url,
        }));

      return {
        ...partialResult,
        stores,
        website: detailsResponse.website || "",
        description: detailsResponse.description || "",
      };
    } catch (error) {
      console.error(`Failed to fetch details for game ${game.name}:`, error);
      return {
        ...partialResult,
        stores: [],
        website: "",
        description: "",
      };
    }
  }

  async searchGames(params: SearchQueryParams): Promise<SearchResponse> {
    console.log("Games search query:", params);
    const searchResponse = await this.rawgApiClient.searchGames(params);
    // console.log("Games search response:", searchResponse);
    const gamesWithStores = await Promise.all(
      searchResponse.results.map(async (game: RawgGame) => {
        return this.getGameInfo(game);
      })
    );

    return {
      games: gamesWithStores,
    };
  }

  async getMultiStoreGameInfo(
    requests: StoreRequest[]
  ): Promise<{ [key: string]: StoreGameInfo | null }> {
    const results: { [key: string]: StoreGameInfo | null } = {};

    await Promise.all(
      requests.map(async ({ store, url }) => {
        try {
          const info = await this.getStoreGameInfo(store, url);
          results[store] = info;
        } catch (error) {
          console.error(`Failed to fetch info for store ${store}:`, error);
          results[store] = null;
        }
      })
    );

    return results;
  }

  async getStoreGameInfo(
    store: StoreName,
    query: string
  ): Promise<StoreGameInfo | null> {
    console.log("Game info query:", { store, query });
    switch (store) {
      case STORE_NAMES.GOG: {
        const gogInfo = await this.gogApiClient.getGameInfo(query);
        return gogInfo ?? null;
      }

      case STORE_NAMES.STEAM:
        if (!query.includes("store.steampowered.com")) {
          throw new Error("URL does not match Steam store");
        }

        const gameInfo = await this.steamSpyApiClient.getGameInfo(query);
        return gameInfo ?? null;

      default:
        console.error(`Store '${store}' not supported yet`);
        return null;
    }
  }
}

export const gamesService = new GamesService();
