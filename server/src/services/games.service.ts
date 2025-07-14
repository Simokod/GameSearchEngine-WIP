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
import { extractGameSearchParams } from "./clients/huggingfaceApi";
import { GameDbGameSummary, GameDbGameDetails } from "./clients/gamedb/types";

class GamesService {
  rawgApiClient = new RawgApiClient();
  steamSpyApiClient = new SteamSpyApiClient();
  gogApiClient = new GogApiClient();

  async initializeStoresCache() {
    await this.rawgApiClient.initializeStoresCache();
  }

  private async getGameInfo(game: GameDbGameSummary): Promise<FullGameInfo> {
    // Fetch full details using the new interface
    const detailsResponse: GameDbGameDetails | null =
      await this.rawgApiClient.getGameDetails(game.id);
    const id = typeof game.id === "string" ? parseInt(game.id, 10) : game.id;
    const released = game.released ?? "";
    const rating = (game as any).rating ?? 0; // fallback to 0 if not available
    const partialResult = {
      id,
      name: game.name,
      released,
      rating,
      genres: game.genres,
      platforms: game.platforms,
    };

    if (detailsResponse) {
      return {
        ...partialResult,
        stores: detailsResponse.stores || [],
        website: detailsResponse.website || "",
        description: detailsResponse.description || "",
      };
    } else {
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
    // 1. Extract structured info from LLM
    const extracted = await extractGameSearchParams(params.query);
    console.log("Extracted fields from HuggingFace:", extracted);
    // 2. For now, just pass the original query and log the extracted fields
    //    (mapping to RAWG params will be implemented next)
    const searchResults = await this.rawgApiClient.searchGames({
      query: params.query,
      page: params.page,
      pageSize: params.pageSize,
    });

    const gamesWithStores = await Promise.all(
      searchResults.map(async (game: GameDbGameSummary) => {
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
