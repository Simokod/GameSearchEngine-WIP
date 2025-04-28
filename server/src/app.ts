import express from "express";
import cors from "cors";
import { config } from "./config";
import gamesRoutes from "./routes/games.routes";

const app = express();

// Middleware
app.use(
  cors({
    origin: config.corsOrigin,
    methods: ["GET"],
  })
);
app.use(express.json());

// Routes
app.use("/api/games", gamesRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
