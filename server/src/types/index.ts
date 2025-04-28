export interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Game {
  id: number;
  slug: string;
  name: string;
  released: string;
  background_image: string;
  rating: number;
  ratings: any[];
  metacritic: number;
  platforms: Platform[];
  genres: Genre[];
}

export interface RAWGResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}

export interface SearchQueryParams {
  q?: string;
  page?: string;
  page_size?: string;
  ordering?: string;
  platforms?: string;
  genres?: string;
  metacritic?: string;
}

export interface Store {
  id: number;
  name: string;
  domain: string;
  slug: string;
}

export interface StoreLink {
  store: Store;
  url: string;
}

export interface PlatformRating {
  metascore: number;
}

export interface DetailedGame extends Game {
  stores: StoreLink[];
  metacritic_platforms: PlatformRating[];
  playtime: number;
  website: string;
}

export interface StoreResponse {
  count: number;
  results: Array<{
    id: number;
    url: string;
    store_id: number;
  }>;
}
