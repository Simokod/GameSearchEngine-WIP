import { flattenDeep } from "lodash";
import { InferenceClient } from "@huggingface/inference";
import { envConfig } from "../config/env";
import { GameDbGameSummary } from "./clients/gamedb/types";
import { Vector } from "../utils/types";
import { cosineSimilarity } from "../utils/utils";

export interface RerankingStrategy {
  rank(
    games: GameDbGameSummary[],
    originalQuery: string
  ): Promise<GameDbGameSummary[]>;
}

export interface GameWithScore extends GameDbGameSummary {
  rerankScore?: number;
}

export class LLMRerankingStrategy implements RerankingStrategy {
  private inferenceClient = new InferenceClient(envConfig.huggingfaceApiToken);

  async rank(
    games: GameDbGameSummary[],
    originalQuery: string
  ): Promise<GameDbGameSummary[]> {
    try {
      const gamesList = games.map((game, index) => 
        `${index + 1}. ${game.name} - ${game.description || 'No description available'}`
      ).join('\n\n');

      const prompt = `Given this user query: "${originalQuery}"

Here are ${games.length} games to choose from:

${gamesList}

Please select the most relevant games that best match the user's query. Return ONLY a JSON array of the game numbers (1-${games.length}) in order of relevance, with the most relevant first. For example: [5, 12, 3, 7, 1]

Do not include any explanation or text before or after the JSON array.`;

      const result = await this.inferenceClient.chatCompletion({
        messages: [{ role: "user", content: prompt }],
        model: "meta-llama/Llama-3.2-3B-Instruct",
      });

      const content = result.choices[0].message.content;
      const match = content?.match(/\[[\d,\s]+\]/);
      
      if (!match) {
        console.warn("LLM didn't return valid JSON array, falling back to original order");
        return games;
      }

      const selectedIndices: number[] = JSON.parse(match[0]);
      
      // Convert 1-based indices to 0-based and reorder games
      return selectedIndices
        .map(index => games[index - 1])
        .filter(game => game !== undefined);
        
    } catch (error) {
      console.error("LLM reranking failed:", error);
      return games; // Fallback to original order
    }
  }
}

export class SemanticSimilarityStrategy implements RerankingStrategy {
  private inferenceClient = new InferenceClient(envConfig.huggingfaceApiToken);

  async rank(
    games: GameDbGameSummary[],
    originalQuery: string
  ): Promise<GameDbGameSummary[]> {
    const gamesWithScores: GameWithScore[] = await Promise.all(
      games.map(async (game) => {
        const score = await this.calculateSimilarity(game, originalQuery);
        return { ...game, rerankScore: score };
      })
    );

    return gamesWithScores
      .sort((a, b) => (b.rerankScore || 0) - (a.rerankScore || 0))
      .map(({ rerankScore, ...game }) => game);
  }

  private async calculateSimilarity(
    game: GameDbGameSummary,
    query: string
  ): Promise<number> {
    try {
      const gameText = `${game.name}. ${game.description || ""}`;

      const [queryEmbedding, gameEmbedding] = await Promise.all([
        this.getEmbedding(query),
        this.getEmbedding(gameText),
      ]);

      return cosineSimilarity(queryEmbedding, gameEmbedding);
    } catch (error) {
      console.error(
        `Error calculating similarity for game ${game.name}:`,
        error
      );
      return this.fallbackSimilarity(game, query);
    }
  }

  private async getEmbedding(text: string): Promise<Vector> {
    const response = await this.inferenceClient.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });
    return flattenDeep(response);
  }

  private fallbackSimilarity(game: GameDbGameSummary, query: string): number {
    const gameText = `${game.name} ${game.description || ""}`.toLowerCase();
    const queryLower = query.toLowerCase();

    const queryWords = queryLower.split(" ").filter((word) => word.length > 2);
    const matches = queryWords.filter((word) => gameText.includes(word)).length;

    return matches / Math.max(queryWords.length, 1);
  }
}

export class RerankingService {
  constructor(private strategy: RerankingStrategy) {}

  async rerankGames(
    games: GameDbGameSummary[],
    originalQuery: string,
    maxResults: number = 5
  ): Promise<GameDbGameSummary[]> {
    if (games.length === 0) return games;

    console.log(
      `Reranking ${games.length} games for query: "${originalQuery}"`
    );
    const rankedGames = await this.strategy.rank(games, originalQuery);
    return rankedGames.slice(0, maxResults);
  }

  setStrategy(strategy: RerankingStrategy) {
    this.strategy = strategy;
  }
}

export const semanticRerankingService = new RerankingService(
  new SemanticSimilarityStrategy()
);

export const llmRerankingService = new RerankingService(
  new LLMRerankingStrategy()
);

// TODO: make this configurable
export const rerankingService = llmRerankingService;
