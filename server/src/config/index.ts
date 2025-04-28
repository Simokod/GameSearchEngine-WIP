import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  rawgApiKey: process.env.RAWG_API_KEY || "",
  rawgBaseUrl: "https://api.rawg.io/api",
  defaultPageSize: 20,
};

if (!config.rawgApiKey) {
  throw new Error(
    "RAWG API key is required. Please set RAWG_API_KEY environment variable."
  );
}
