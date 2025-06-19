import { Router } from "express";
import { config } from "../config";
import { gamesService } from "../services/games.service";
import { StoreName } from "../constants";

const router = Router();

router.get("/search", async (req, res) => {
  try {
    console.log("Search query:", req.query);

    if (!config.rawgApiKey) {
      console.log("RAWG API key not configured");
      res.status(500).json({ error: "RAWG API key not configured" });
      return;
    }

    if (!req.query.q) {
      console.log("No search query provided");
      res.status(400).json({ error: "Search query is required" });
      return;
    }

    const result = await gamesService.searchGames(req.query);
    res.json(result);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search games" });
  }
});

interface StoreRequest {
  store: StoreName;
  url: string;
}

router.get("/game-info", async (req, res) => {
  const storeRequests = req.query.stores;

  if (!storeRequests || typeof storeRequests !== "string") {
    res.status(400).json({ error: "Missing or invalid stores parameter" });
    return;
  }

  try {
    const requests: StoreRequest[] = JSON.parse(storeRequests);

    if (!Array.isArray(requests) || requests.length === 0) {
      res
        .status(400)
        .json({ error: "Invalid stores format - expected non-empty array" });
      return;
    }

    for (const request of requests) {
      if (
        !request.store ||
        !request.url ||
        typeof request.store !== "string" ||
        typeof request.url !== "string"
      ) {
        res.status(400).json({
          error: "Each store request must have 'store' and 'url' strings",
        });
        return;
      }
    }

    const info = await gamesService.getMultiStoreGameInfo(requests);
    res.json(info);
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      res.status(400).json({ error: "Invalid JSON in stores parameter" });
      return;
    }
    res
      .status(400)
      .json({ error: error.message || "Failed to fetch game info" });
  }
});

export default router;
