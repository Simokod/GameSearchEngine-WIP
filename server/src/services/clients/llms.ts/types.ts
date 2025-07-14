export type SearchQueryAnalysis = {
  isDirectGameSearch: boolean;
};

export type ExtractedGameSearchParams = {
  genres: string[];
  platforms: string[];
  tags: string[];
  dates: string[];
  developers: string[];
  publishers: string[];
  suggested_titles: string[];
};