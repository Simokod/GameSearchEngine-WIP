import { Router } from "express";
import { config } from "../config";
import { gamesService } from "../services/games.service";

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

router.get("/game-info", async (req, res) => {
  const { url, store } = req.query;
  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "Missing or invalid url parameter" });
    return;
  }
  if (!store || typeof store !== "string") {
    res.status(400).json({ error: "Missing or invalid store parameter" });
    return;
  }

  try {
    const info = await gamesService.getGameInfo(store, url);
    res.json(info);
  } catch (error: any) {
    res
      .status(400)
      .json({ error: error.message || "Failed to fetch game info" });
  }
});

export default router;
