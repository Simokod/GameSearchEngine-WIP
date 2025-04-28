import { Router } from "express";
import { GamesService } from "../services/games.service";
import { config } from "../config";

const router = Router();

// Initialize stores cache when server starts
GamesService.initializeStoresCache();

// Search games with filters
router.get("/", async (req, res) => {
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

// Get detailed game information
router.get("/:id", async (req, res) => {
  try {
    const game = await GamesService.getGameDetails(req.params.id);
    res.json(game);
  } catch (error) {
    console.error("Error fetching game details:", error);
    res.status(500).json({ error: "Failed to fetch game details" });
  }
});

// Get game store links
router.get("/:id/stores", async (req, res) => {
  try {
    const stores = await GamesService.getGameStores(req.params.id);
    res.json(stores);
  } catch (error) {
    console.error("Error fetching game stores:", error);
    res.status(500).json({ error: "Failed to fetch game stores" });
  }
});

export default router;
