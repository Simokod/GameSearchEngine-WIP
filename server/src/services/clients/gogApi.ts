import axios from "axios";

class GogApiClient {
  private baseUrl = "https://www.gog.com";
  private api: any;

  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
    });
  }

  // Utility: Normalize a string for comparison
  private normalize(str: string) {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ");
  }

  async getGameInfo(gameName: string) {
    const url = `/games/ajax/filtered?mediaType=game&search=${encodeURIComponent(
      gameName
    )}`;
    const response = await this.api.get(url);
    const products = response.data.products;
    if (!products || products.length === 0) return null;

    const normalizedName = this.normalize(gameName);
    let bestMatch = products.find(
      (p: any) => this.normalize(p.title) === normalizedName
    );

    if (!bestMatch) {
      bestMatch = products.find((p: any) =>
        this.normalize(p.title).includes(normalizedName)
      );
    }

    if (!bestMatch) {
      bestMatch = products[0];
    }

    console.log("GOG API GameInfo Response:", bestMatch);

    return bestMatch;
  }
}

export { GogApiClient };
