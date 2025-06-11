// export interface Store {
//   name: string;
//   url: string;
// }

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
}
