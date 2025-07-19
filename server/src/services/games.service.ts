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
import {
  extractGameSearchParams,
  analyzeSearchQuery,
} from "./clients/llms.ts/huggingfaceApi";
import { GameDbGameSummary, GameDbGameDetails } from "./clients/gamedb/types";
import { rerankingService } from "./reranking.service";

class GamesService {
  rawgApiClient = new RawgApiClient();
  steamSpyApiClient = new SteamSpyApiClient();
  gogApiClient = new GogApiClient();

  constructor() {
    this.initializeCache();
  }

  async initializeCache() {
    await this.rawgApiClient.initializeCache();
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
    let searchResults: GameDbGameSummary[] = [];

    const isDirectGameSearch = await analyzeSearchQuery(params.query);
    console.log("Is direct game search:", isDirectGameSearch);
    if (isDirectGameSearch.isDirectGameSearch) {
      searchResults = await this.directGameSearch(params);
    } else {
      // TODO: should inject the current DB's genres, platforms, tags, so that the LLM doesn't have to infer them
      const extracted = await extractGameSearchParams(params.query);
      console.log("Extracted fields from HuggingFace:", extracted);

      // Convert extracted names to IDs using the cached mappings
      const genreIds =
        extracted.genres
          ?.map((genre) => this.rawgApiClient.getGenreId(genre))
          .filter((id) => id !== null) || [];
      const platformIds =
        extracted.platforms
          ?.map((platform) => this.rawgApiClient.getPlatformId(platform))
          .filter((id) => id !== null) || [];
      const tagIds =
        extracted.tags
          ?.map((tag) => this.rawgApiClient.getTagId(tag))
          .filter((id) => id !== null) || [];

      console.log("Converted to IDs:", { genreIds, platformIds, tagIds });

      // Get more results for reranking (50 instead of pageSize)
      const expandedResults = await this.rawgApiClient.searchGames({
        query: "", // TODO: What to do about the query?
        page: 1,
        pageSize: 50,
        genres: genreIds.map((id) => String(id)),
        platforms: platformIds.map((id) => String(id)),
        tags: tagIds.map((id) => String(id)),
        dates: extracted.dates,
        developers: extracted.developers,
        publishers: extracted.publishers,
      });

      console.log(`Got ${expandedResults.length} games for reranking`);

      // Rerank using semantic similarity
      searchResults = await rerankingService.rerankGames(
        expandedResults,
        params.query,
        params.pageSize
      );

      console.log("Reranked search results:", searchResults);
    }

    const gamesWithStores = await Promise.all(
      searchResults.map(async (game: GameDbGameSummary) => {
        return this.getGameInfo(game);
      })
    );

    return {
      games: gamesWithStores,
    };
  }

  async directGameSearch(
    params: SearchQueryParams
  ): Promise<GameDbGameSummary[]> {
    return this.rawgApiClient.searchGames({
      query: params.query,
      page: params.page,
      pageSize: params.pageSize,
    });
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
