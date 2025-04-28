// import express, { Request, Response, RequestHandler } from "express";
// import cors from "cors";
// import axios from "axios";
// import dotenv from "dotenv";

// // Load environment variables
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// // RAWG API types
// interface Platform {
//   platform: {
//     id: number;
//     name: string;
//     slug: string;
//   };
// }

// interface Genre {
//   id: number;
//   name: string;
//   slug: string;
// }

// interface Game {
//   id: number;
//   slug: string;
//   name: string;
//   released: string;
//   background_image: string;
//   rating: number;
//   metacritic: number;
//   platforms: Platform[];
//   genres: Genre[];
// }

// interface RAWGResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: Game[];
// }

// interface SearchQueryParams {
//   q?: string;
//   page?: string;
//   page_size?: string;
//   ordering?: string;
//   platforms?: string;
//   genres?: string;
//   metacritic?: string;
// }

// interface Store {
//   id: number;
//   name: string;
//   domain: string;
//   slug: string;
// }

// interface StoreLink {
//   store: Store;
//   url: string;
// }

// interface PlatformRating {
//   platform: {
//     name: string;
//   };
//   metascore: number;
// }

// interface DetailedGame extends Game {
//   stores: StoreLink[];
//   metacritic_platforms: PlatformRating[];
//   playtime: number;
//   website: string;
// }

// interface StoreResponse {
//   count: number;
//   results: Array<{
//     id: number;
//     url: string;
//     store_id: number;
//   }>;
// }

// const RAWG_API_KEY = process.env.RAWG_API_KEY;
// const RAWG_BASE_URL = "https://api.rawg.io/api";

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Cache for store details
// let storesCache: { [key: number]: Store } = {};

// // Initialize stores cache
// const initializeStoresCache = async () => {
//   try {
//     if (!RAWG_API_KEY) {
//       console.error("RAWG API key not configured");
//       return;
//     }

//     // Fetch all stores
//     const response = await axios.get<{ results: Store[] }>(
//       `${RAWG_BASE_URL}/stores`,
//       {
//         params: {
//           key: RAWG_API_KEY,
//         },
//       }
//     );

//     // Create a map of store_id to store details
//     storesCache = response.data.results.reduce((acc, store) => {
//       acc[store.id] = store;
//       return acc;
//     }, {} as { [key: number]: Store });

//     console.log("Stores cache initialized:", storesCache);
//   } catch (error) {
//     console.error("Failed to initialize stores cache:", error);
//   }
// };

// // Initialize stores cache when server starts
// initializeStoresCache();

// const searchHandler: RequestHandler<{}, any, any, SearchQueryParams> = async (
//   req,
//   res
// ) => {
//   try {
//     console.log("Search query:", req.query);
//     const { q: search, ordering, platforms, genres, metacritic } = req.query;

//     if (!search) {
//       console.log("No search query provided");
//       res.status(400).json({ error: "Search query is required" });
//       return;
//     }

//     if (!RAWG_API_KEY) {
//       console.log("RAWG API key not configured");
//       res.status(500).json({ error: "RAWG API key not configured" });
//       return;
//     }

//     // Reinitialize stores cache if empty
//     if (Object.keys(storesCache).length === 0) {
//       await initializeStoresCache();
//     }

//     console.log("Fetching games from RAWG API");
//     const response = await axios.get<RAWGResponse>(`${RAWG_BASE_URL}/games`, {
//       params: {
//         key: RAWG_API_KEY,
//         search,
//         page: "1",
//         page_size: "10",
//         ordering,
//         platforms,
//         genres,
//         metacritic,
//       },
//     });

//     console.log("Games fetched successfully");

//     // For each game in the results, fetch its details and store information
//     const gamesWithStores = await Promise.all(
//       response.data.results.map(async (game: Game) => {
//         try {
//           // Fetch game details
//           const detailsResponse = await axios.get<DetailedGame>(
//             `${RAWG_BASE_URL}/games/${game.id}`,
//             {
//               params: {
//                 key: RAWG_API_KEY,
//               },
//             }
//           );

//           // Fetch store information
//           const storesResponse = await axios.get<StoreResponse>(
//             `${RAWG_BASE_URL}/games/${game.id}/stores`,
//             {
//               params: {
//                 key: RAWG_API_KEY,
//               },
//             }
//           );

//           // Map store data with names from cache
//           const stores = storesResponse.data.results
//             .filter((s) => storesCache[s.store_id]) // Only include stores we have info for
//             .map((s) => ({
//               name: storesCache[s.store_id].name,
//               url: s.url,
//             }));

//           return {
//             id: game.id,
//             name: game.name,
//             released: game.released,
//             rating: game.rating,
//             metacritic: game.metacritic,
//             genres: game.genres.map((g) => g.name),
//             platforms: game.platforms.map((p) => p.platform.name),
//             stores,
//             platform_ratings: detailsResponse.data.metacritic_platforms,
//             playtime: detailsResponse.data.playtime,
//             website: detailsResponse.data.website || "",
//           };
//         } catch (error) {
//           console.error(`Failed to fetch details for game ${game.id}:`, error);
//           return {
//             id: game.id,
//             name: game.name,
//             released: game.released,
//             rating: game.rating,
//             metacritic: game.metacritic,
//             genres: game.genres.map((g) => g.name),
//             platforms: game.platforms.map((p) => p.platform.name),
//             stores: [],
//             platform_ratings: [],
//             playtime: 0,
//             website: "",
//           };
//         }
//       })
//     );

//     res.json({
//       games: gamesWithStores,
//       count: response.data.count,
//     });
//   } catch (error) {
//     console.error("Search error:", error);
//     res.status(500).json({ error: "Failed to search games" });
//   }
// };

// // Basic test route
// const healthHandler: RequestHandler = (_req, res) => {
//   res.json({ status: "ok", message: "Game Search Engine API is running" });
//   return;
// };

// app.get("/api/search", searchHandler);
// app.get("/api/health", healthHandler);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
