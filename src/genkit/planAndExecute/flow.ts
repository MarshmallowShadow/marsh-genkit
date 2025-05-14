import { GenkitBeta, z } from "genkit/beta";
import { PlannerState } from "./types";
import { actPrompt, initialPlanPrompt, replanPrompt } from "./prompts";
import { ai } from "./config";

export const planAndExecute = async () => {
  ai.defineFlow(
    { name: "plan-and-execute", inputSchema: z.string() },
    async (request, ctx) => {
      const session = ai.createSession<PlannerState>({
        initialState: {
          objective: request,
          pastSteps: [],
          plan: [],
        },
      });
      return await session.run(async () => {
        // Initial Plan
        const { output } = await initialPlanPrompt();
        await session.updateState({
          ...session.state!,
          plan: output!.steps,
        });
        ctx.sendChunk({
          step: "initial-plan",
          state: session.state,
        });
  
        // Iterate forever, until final answer is achieved.
        // Consider adding safeguards, like max iterations or
        // an "I'm stuck" escape hatch.
        while (true) {
          // Act
          const { text } = await actPrompt();
          const currentState = session.state!;
          await session.updateState({
            ...currentState,
            pastSteps: [
              ...currentState.pastSteps,
              {
                task: currentState.plan[0],
                response: text,
              },
            ],
          });
          ctx.sendChunk({
            step: "act",
            state: session.state,
          });
  
          // Replan
          const { output } = await replanPrompt();
          if (output?.finalAnswer) {
            ctx.sendChunk({
              step: "done",
              finalAnswer: output?.finalAnswer,
            });
            return output?.finalAnswer;
          } else if (output?.plan) {
            await session.updateState({
              ...session.state!,
              plan: output.plan!.steps,
            });
            ctx.sendChunk({
              step: "replan",
              state: session.state,
            });
          }
        }
      });
    }
  );
}