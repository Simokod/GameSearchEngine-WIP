import axios from "axios";
import { config } from "../../config";
import {
  DetailedGame,
  RAWGResponse,
  StoreResponse,
  Store,
  RawgGame,
  Genre,
  Platform,
  Tag,
} from "./types";
import {
  GameDbClient,
  GameDbSearchParams,
  GameDbGameSummary,
  GameDbGameDetails,
} from "./gamedb/types";

export class RawgApiClient implements GameDbClient {
  private baseUrl = "https://api.rawg.io/api";
  private api: Axios.AxiosInstance;
  private storesCache: { [key: number]: Store } = {};
  private genresCache: { [key: number]: Genre } = {};
  private platformsCache: { [key: number]: Platform } = {};
  private tagsCache: { [key: number]: Tag } = {};

  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
      params: {
        key: config.rawgApiKey,
      },
    });
  }

  async initializeCache(): Promise<void> {
    if (
      Object.keys(this.storesCache).length > 0 &&
      Object.keys(this.genresCache).length > 0 &&
      Object.keys(this.platformsCache).length > 0 &&
      Object.keys(this.tagsCache).length > 0
    )
      return;

    try {
      if (!config.rawgApiKey) {
        throw new Error("RAWG API key not configured");
      }

      // Initialize stores cache
      if (Object.keys(this.storesCache).length === 0) {
        const storesResponse = await this.api.get<{ results: Store[] }>(
          "/stores"
        );
        this.storesCache = {};
        storesResponse.data.results.forEach((store: Store) => {
          this.storesCache[store.id] = store;
        });
        console.log("Stores cache initialized");
      }

      // Initialize genres cache
      if (Object.keys(this.genresCache).length === 0) {
        const genresResponse = await this.api.get<{ results: Genre[] }>(
          "/genres"
        );
        this.genresCache = {};
        genresResponse.data.results.forEach((genre: Genre) => {
          this.genresCache[genre.id] = genre;
        });
        console.log("Genres cache initialized");
      }

      // Initialize platforms cache
      if (Object.keys(this.platformsCache).length === 0) {
        const platformsResponse = await this.api.get<{ results: Platform[] }>(
          "/platforms"
        );
        this.platformsCache = {};
        platformsResponse.data.results.forEach((platform: Platform) => {
          this.platformsCache[platform.id] = platform;
        });
        console.log("Platforms cache initialized");
      }

      // Initialize tags cache
      if (Object.keys(this.tagsCache).length === 0) {
        const tagsResponse = await this.api.get<{ results: Tag[] }>("/tags");
        this.tagsCache = {};
        tagsResponse.data.results.forEach((tag: Tag) => {
          this.tagsCache[tag.id] = tag;
        });
        console.log("Tags cache initialized");
      }
    } catch (error) {
      console.error("Failed to initialize caches:", error);
      throw error;
    }
  }

  async searchGames(params: GameDbSearchParams): Promise<GameDbGameSummary[]> {
    const {
      query,
      genres,
      platforms,
      tags,
      dates,
      developers,
      publishers,
      page,
      pageSize,
    } = params;

    await this.initializeCache();

    // Map params to RAWG API params
    const rawgParams: any = {
      search: query,
      page,
      page_size: pageSize,
    };

    // Convert genre names to IDs
    if (genres && genres.length) {
      const genreIds = genres
        .map((genre) => this.getGenreId(genre))
        .filter((id) => id !== null);
      if (genreIds.length > 0) rawgParams.genres = genreIds.join(",");
    }

    // Convert platform names to IDs
    if (platforms && platforms.length) {
      const platformIds = platforms
        .map((platform) => this.getPlatformId(platform))
        .filter((id) => id !== null);
      if (platformIds.length > 0) rawgParams.platforms = platformIds.join(",");
    }

    // Convert tag names to IDs
    if (tags && tags.length) {
      const tagIds = tags
        .map((tag) => this.getTagId(tag))
        .filter((id) => id !== null);
      if (tagIds.length > 0) rawgParams.tags = tagIds.join(",");
    }

    if (dates && dates.length) rawgParams.dates = dates.join(",");
    if (developers && developers.length)
      rawgParams.developers = developers.join(",");
    if (publishers && publishers.length)
      rawgParams.publishers = publishers.join(",");

    console.log("Fetching games from RAWG API", rawgParams);
    const response = await this.api.get<RAWGResponse>("/games", {
      params: rawgParams,
    });

    return response.data.results.map((game: RawgGame) => ({
      id: game.id,
      name: game.name,
      released: game.released,
      genres: game.genres?.map((g: Genre) => g.name),
      platforms: game.platforms?.map((p: { platform: Platform }) => p.platform.name),
      coverUrl: game.background_image,
    }));
  }

  async getGameDetails(id: string | number): Promise<GameDbGameDetails | null> {
    try {
      const gameId = typeof id === "string" ? parseInt(id, 10) : id;
      const detailsResponse = await this.api.get<DetailedGame>(
        `/games/${gameId}`
      );
      const details = detailsResponse.data;
      const storesResponse = await this.api.get<StoreResponse>(
        `/games/${gameId}/stores`
      );
      const stores = storesResponse.data.results
        .filter((s: { store_id: number }) => this.getStoreName(s.store_id))
        .map((s: { store_id: number; url: string }) => ({
          name: this.getStoreName(s.store_id),
          url: s.url,
        }));

      return {
        id: details.id,
        name: details.name,
        released: details.released,
        genres: details.genres?.map((g: Genre) => g.name),
        platforms: details.platforms?.map((p: { platform: Platform }) => p.platform.name),
        coverUrl: details.background_image,
        description: details.description,
        website: details.website,
        stores,
      };
    } catch (error) {
      console.error("Failed to fetch game details from RAWG:", error);
      return null;
    }
  }

  async getGameStores(gameId: number): Promise<StoreResponse> {
    console.log("Fetching game stores from RAWG API", gameId);
    const response = await this.api.get<StoreResponse>(
      `/games/${gameId}/stores`
    );
    // console.log("Game stores fetched successfully", response.data);
    return response.data;
  }

  getStoreName(storeId: number): string {
    return this.storesCache[storeId]?.name ?? "";
  }

  getGenreId(genreName: string): number | null {
    const genre = Object.values(this.genresCache).find(
      (g) => g.name.toLowerCase() === genreName.toLowerCase()
    );
    return genre?.id ?? null;
  }

  getPlatformId(platformName: string): number | null {
    const platform = Object.values(this.platformsCache).find(
      (p) => p.name.toLowerCase() === platformName.toLowerCase()
    );
    return platform?.id ?? null;
  }

  getTagId(tagName: string): number | null {
    const tag = Object.values(this.tagsCache).find(
      (t) => t.name.toLowerCase() === tagName.toLowerCase()
    );
    return tag?.id ?? null;
  }
}
