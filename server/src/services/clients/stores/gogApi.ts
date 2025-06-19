import axios from "axios";
import { StoreApiClient, GogPrice } from "./types";

interface GogGameInfo {
  price: GogPrice;
}

interface GogRawInfo {
  products: {
    title: string;
    price: GogPrice;
    url: string;
    rating: number;
  }[];
}

export class GogApiClient implements StoreApiClient {
  private baseUrl = "https://www.gog.com";
  private api: Axios.AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
    });
  }

  private normalize(str: string) {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ");
  }

  private getFirstWord(str: string): string {
    return str.split(/[\s-]+/)[0];
  }

  async getGameInfo(gameUrl: string): Promise<GogGameInfo | null> {
    let gameName = gameUrl;
    // TODO: This is not always correct, but it's a good start
    const match = gameUrl.match(/gog\.com(?:\/en)?\/game\/([a-zA-Z0-9_\-]+)/);
    if (match && match[1]) {
      gameName = match[1].replace(/_/g, " ");
    }
    const searchTerm = this.getFirstWord(gameName);
    console.log("GOG API searching for term:", searchTerm);

    const url = `/games/ajax/filtered?mediaType=game&search=${encodeURIComponent(
      searchTerm
    )}`;
    const response = await this.api.get<GogRawInfo>(url);
    const products = response.data.products;
    if (!products || products.length === 0) {
      console.log(
        "No products found for:",
        searchTerm,
        "(original:",
        gameName,
        ")"
      );
      return null;
    }

    const normalizedName = this.normalize(gameName);
    const bestMatch =
      products.find((p) => this.normalize(p.title) === normalizedName) ||
      products.find((p) => this.normalize(p.title).includes(normalizedName)) ||
      products[0];

    const price = bestMatch.price;
    const formattedPrice =
      price.isDiscounted && price.baseAmount !== price.finalAmount
        ? {
            original: price.baseAmount,
            discounted: price.finalAmount,
            currency: price.currency,
            symbol: price.symbol,
            discountPercentage: price.discountPercentage,
          }
        : {
            amount: price.amount,
            currency: price.currency,
            symbol: price.symbol,
          };

    return {
      price: formattedPrice,
    };
  }
}
