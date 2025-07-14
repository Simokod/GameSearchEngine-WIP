import { InferenceClient } from "@huggingface/inference";
import { envConfig } from "../../../config/env";
import { HUGGINGFACE_MODEL } from "../../../constants";
import { ExtractedGameSearchParams, SearchQueryAnalysis } from "./types";

const inferenceClient = new InferenceClient(envConfig.huggingfaceApiToken);

export async function analyzeSearchQuery(
  userQuery: string
): Promise<SearchQueryAnalysis> {
  const prompt = `Analyze this search query: "${userQuery}"

First, determine if this is a direct game name search or a descriptive query:
- Direct game name: Simple game title like "Skyrim", "The Witcher 3", "Call of Duty"
- Descriptive query: User describes what they want like "RPG games with magic", "games like Minecraft", "multiplayer shooters"

Respond ONLY with a valid JSON object with keys: isDirectGameSearch (boolean). Do not include any explanation or text before or after the JSON.`;

  try {
    const result = await inferenceClient.chatCompletion({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: HUGGINGFACE_MODEL,
    });

    const match = result.choices[0].message.content?.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object found in LLM response");
    return JSON.parse(match[0]);
  } catch (err) {
    console.error("HuggingFace query analysis error:", err);
    throw err;
  }
}

export async function extractGameSearchParams(
  userQuery: string
): Promise<ExtractedGameSearchParams> {
  const prompt = `Extract genres, platforms, tags, dates, developers, publishers, and suggest up to 5 game titles from this user query: "${userQuery}"

- Only include platforms, developers, or publishers if the user specifically mentions them. Otherwise, leave these arrays empty.
- Only include dates if the user mentions a time period or release window.
- For tags, you may infer relevant tags based on the user's description or referenced games, even if not explicitly mentioned.
- Respond ONLY with a valid JSON object with keys: genres, platforms, tags, dates, developers, publishers, suggested_titles. Do not include any explanation or text before or after the JSON.`;

  try {
    const result = await inferenceClient.chatCompletion({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: HUGGINGFACE_MODEL,
    });

    const match = result.choices[0].message.content?.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object found in LLM response");
    return JSON.parse(match[0]);
  } catch (err) {
    console.error("HuggingFace extraction error:", err);
    throw err;
  }
}
