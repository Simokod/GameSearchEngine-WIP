// Types for a generic game database client (RAWG, IGDB, etc.)

export interface GameDbSearchParams {
  query: string;
  genres?: string[];
  platforms?: string[];
  tags?: string[];
  dates?: string;
  developers?: string[];
  publishers?: string[];
  page?: number;
  pageSize?: number;
}

export interface GameDbGameSummary {
  id: string | number;
  name: string;
  released?: string;
  genres?: string[];
  platforms?: string[];
  summary?: string;
  coverUrl?: string;
  [key: string]: any;
}

export interface GameDbGameDetails extends GameDbGameSummary {
  description?: string;
  website?: string;
  stores?: Array<{ name: string; url: string }>;
}

export interface GameDbClient {
  searchGames(params: GameDbSearchParams): Promise<GameDbGameSummary[]>;
  getGameDetails(id: string | number): Promise<GameDbGameDetails | null>;
}
