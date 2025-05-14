import { z } from "genkit/beta";

export const StepsSchema = z.object({
  steps: z
    .array(z.string())
    .describe("different steps to follow, should be in sorted order"),
});


export const ActSchema = z.object({
    finalAnswer: z
      .string()
      .describe("Final answer to the initial objective. Include the whole thing.")
      .optional(),
    plan: StepsSchema.optional(),
});

