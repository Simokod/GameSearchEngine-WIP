import { Router } from "express";
import { GamesService } from "../services/games.service";
import { config } from "../config";

const router = Router();

GamesService.initializeStoresCache();

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

    const result = await GamesService.searchGames(req.query);
    res.json(result);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search games" });
  }
});

export default router;
