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

export interface RawgGame {
  id: number;
  slug: string;
  name: string;
  released: string;
  background_image: string;
  rating: number;
  platforms: Platform[];
  genres: Genre[];
}

export interface RAWGResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGame[];
}

interface StoreLink {
  store: Store;
  url: string;
}

export interface DetailedGame extends RawgGame {
  stores: StoreLink[];
  website: string;
  description: string;
}

export interface StoreResponse {
  count: number;
  results: Array<{
    id: number;
    url: string;
    store_id: number;
  }>;
}

export interface Store {
  id: number;
  name: string;
  domain: string;
  slug: string;
}
