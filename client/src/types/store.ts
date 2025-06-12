export interface Store {
  id: string;
  name: string;
  url: string;
  rating?: number;
  maxRating?: number;
  price?: string;
  logo?: string;
}

export interface StoreRatingInfo {
  rating: number;
  votes: number;
  price:
    | string
    | {
        original?: string;
        discounted?: string;
        amount?: string;
        label?: string;
        currency?: string;
        symbol?: string;
        discountPercentage?: number;
      };
}
