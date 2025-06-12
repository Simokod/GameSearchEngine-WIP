import { SearchQueryParams, Game } from "../types";
import { STORE_NAMES, StoreName } from "../constants";
import { RawgApiClient } from "./clients/rawgApi";
import { SteamSpyApiClient } from "./clients/steamspyApi";
import { GogApiClient } from "./clients/gogApi";

class GamesService {
  rawgApiClient = new RawgApiClient();
  steamSpyApiClient = new SteamSpyApiClient();
  gogApiClient = new GogApiClient();

  async initializeStoresCache() {
    await this.rawgApiClient.initializeStoresCache();
  }

  async searchGames(params: SearchQueryParams) {
    const { q: search } = params;

    if (!search) {
      throw new Error("Search query is required");
    }

    console.log("Games search query:", search);
    const searchResponse = await this.rawgApiClient.searchGames(params);
    console.log("Games search response:", searchResponse);
    const gamesWithStores = await Promise.all(
      searchResponse.results.map(async (game: Game) => {
        try {
          const detailsResponse = await this.rawgApiClient.getGameDetails(
            game.id
          );
          const storesResponse = await this.rawgApiClient.getGameStores(
            game.id
          );

          const stores = storesResponse.results
            .filter((s) => this.rawgApiClient.getStoreName(s.store_id))
            .map((s) => ({
              name: this.rawgApiClient.getStoreName(s.store_id),
              url: s.url,
            }));

          return {
            id: game.id,
            name: game.name,
            released: game.released,
            rating: game.rating,
            ratings: game.ratings,
            metacritic: game.metacritic,
            genres: game.genres.map((g) => g.name),
            platforms: game.platforms.map((p) => p.platform.name),
            stores,
            platform_ratings: detailsResponse.metacritic_platforms,
            playtime: detailsResponse.playtime,
            website: detailsResponse.website || "",
            description: detailsResponse.description || "",
          };
        } catch (error) {
          console.error(`Failed to fetch details for game ${game.id}:`, error);
          return {
            id: game.id,
            name: game.name,
            released: game.released,
            rating: game.rating,
            metacritic: game.metacritic,
            genres: game.genres.map((g) => g.name),
            platforms: game.platforms.map((p) => p.platform.name),
            stores: [],
            platform_ratings: [],
            playtime: 0,
            website: "",
          };
        }
      })
    );

    return {
      games: gamesWithStores,
      count: searchResponse.count,
    };
  }

  async getGameInfo(store: StoreName, query: string) {
    console.log("Game info query:", { store, urlOrName: query });
    switch (store) {
      case STORE_NAMES.GOG: {
        let gameName = query;
        const match = query.match(/gog.com\/(game|en)\/([a-zA-Z0-9_\-]+)/);
        if (match && match[2]) {
          gameName = match[2].replace(/_/g, " ");
        }
        const gogInfo = await this.gogApiClient.getGameInfo(gameName);
        if (!gogInfo) {
          throw new Error("Game not found on GOG");
        }
        const price = gogInfo.price || null;
        let formattedPrice = null;
        if (price) {
          if (price.isDiscounted && price.baseAmount !== price.finalAmount) {
            formattedPrice = {
              original: price.baseAmount,
              discounted: price.finalAmount,
              currency: price.currency,
              symbol: price.symbol,
              discountPercentage: price.discountPercentage,
            };
          } else {
            formattedPrice = {
              amount: price.amount,
              currency: price.currency,
              symbol: price.symbol,
            };
          }
        }
        const rating =
          typeof gogInfo.rating === "number" ? gogInfo.rating / 10 : null;
        return {
          price: formattedPrice,
          rating,
        };
      }
      case STORE_NAMES.STEAM:
        if (!query.includes("store.steampowered.com")) {
          throw new Error("URL does not match Steam store");
        }

        const gameInfo = await this.steamSpyApiClient.getGameInfo(query);
        return {
          rating: Number(
            (
              (gameInfo.positive / (gameInfo.positive + gameInfo.negative)) *
              100
            ).toFixed(2)
          ),
          votes: gameInfo.positive + gameInfo.negative,
          price: gameInfo.price,
        };

      default:
        throw new Error(`Store '${store}' not supported yet`);
    }
  }
}

export const gamesService = new GamesService();
