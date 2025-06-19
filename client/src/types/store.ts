export interface Store {
  id: string;
  name: string;
  url: string;
  rating?: number;
  maxRating?: number;
  price?: string;
  logo?: string;
}

export interface StoreRequest {
  store: string;
  url: string;
}

export interface StoreRatingInfo {
  rating?: number;
  votes?: number;
  price:
    | string
    | {
        amount?: number;
        original?: number;
        discounted?: number;
        currency?: string;
        symbol?: string;
        discountPercentage?: number;
      };
}
