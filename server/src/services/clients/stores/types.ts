export interface StoreGameInfo {
  price: string | GogPrice;
  rating?: number;
  votes?: number;
}

export interface StoreApiClient {
  /**
   * Get game information from the store
   * @param identifier - Can be a game name, URL, or store-specific ID
   * @returns Promise with store-specific game information or null if not found
   */
  getGameInfo(identifier: string): Promise<StoreGameInfo | null>;
}

export interface GogPrice {
  amount?: number;
  currency: string;
  isDiscounted?: boolean;
  baseAmount?: number;
  finalAmount?: number;
  discountPercentage?: number;
  symbol?: string;
}
