import dotenv from "dotenv";

dotenv.config();

class EnvConfig {
  readonly port: number;
  readonly corsOrigin: string;
  readonly rawgApiKey: string;
  readonly defaultPageSize: number;

  constructor() {
    this.port = Number(process.env.PORT) || 3000;
    this.corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
    this.rawgApiKey = process.env.RAWG_API_KEY || "";
    this.defaultPageSize = Number(process.env.DEFAULT_PAGE_SIZE) || 20;

    if (!this.rawgApiKey) {
      throw new Error(
        "RAWG API key is required. Please set RAWG_API_KEY environment variable."
      );
    }
  }
}

export const envConfig = new EnvConfig();
