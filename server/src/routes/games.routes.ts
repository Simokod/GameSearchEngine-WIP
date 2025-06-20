import { Request, Response, Router } from "express";
import { gamesService } from "../services/games.service";
import { getGameInfoBodySchema, searchGamesQuerySchema } from "./schemas";
import { validateRequest } from "./validation";

const router = Router();

router.get("/search", async (req: Request, res: Response) => {
  const query = validateRequest(searchGamesQuerySchema, req.query);
  try {
    const result = await gamesService.searchGames(query);
    res.json(result);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search games" });
  }
});

router.post("/game-info", async (req: Request, res: Response) => {
  const data = validateRequest(getGameInfoBodySchema, req.body);
  try {
    const info = await gamesService.getMultiStoreGameInfo(data.stores);
    res.json(info);
  } catch (error: any) {
    console.error("game-info error:", error);
    res
      .status(400)
      .json({ error: error.message || "Failed to fetch game info" });
  }
});

export default router;
