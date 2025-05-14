import { gpt4Turbo, openAI } from "genkitx-openai";
import { genkit, z } from "genkit/beta";

// Define LLM Model
export const ai = genkit({
	plugins: [openAI({ apiKey: process.env.OPENAI_API_KEY })],
	model: gpt4Turbo,
});