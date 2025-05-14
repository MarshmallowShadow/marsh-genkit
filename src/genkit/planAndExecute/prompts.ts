import { ActSchema, StepsSchema } from "./schemas";
import { ai } from "./config";


export const initialPlanPrompt = ai.definePrompt({
    name: "plan",
    system: `You are a helpful planning assistant. Your goal is to create a simple,
    step-by-step plan to achieve the user's objective.
    The plan should consist of individual, actionable tasks. Each step should contain
    all the necessary information to be executed without requiring further context.
    Avoid any unnecessary steps or complexity.
    The final step in the plan should directly lead to the final answer or desired outcome.`,
    prompt: `The objective is: "{{@state.objective}}"`,
    config: {
      temperature: 0,
    },
    output: {
      schema: StepsSchema,
    },
});


export const replanPrompt = ai.definePrompt({
  name: "replan",
  system: `You are a helpful planning assistant. Your goal is to revise the existing
plan based on the progress made so far and determine the next steps or if the objective
has been achieved.
Consider the original objective, the initial plan, and the steps that have already been
completed along with their responses.
Your task is to:
- If the objective is achieved and a final answer is available, provide it.
- Otherwise, identify the remaining steps needed to achieve the objective. Only include
  steps that have not been completed yet. Ensure each new step is actionable
  and self-contained.
- If no further steps are required, indicate that the process is complete.`,
  prompt: `The original objective was: "{{@state.objective}}"
The initial plan was:
{{#each @state.plan}}
  - {{this}}
{{/each}}
The following steps have been completed:
{{#each @state.pastSteps}}
  - Task: {{this.task}}
    Response:
\`\`\`
{{this.response}}
\`\`\`
{{/each}}
Based on this information, either provide the final answer in the 'finalAnswer' field,
or provide an updated plan with only the remaining necessary steps in the 'plan' field,
for example:
\`\`\`json
{
  "steps": [
    "Next Step 1: [Actionable task]",
    "Next Step 2: [Another actionable task]",
    "... and so on"
  ]
}
\`\`\`
If no further steps are needed, respond with 'finalAnswer' field set.`,
  config: {
    temperature: 0,
  },
  output: {
    schema: ActSchema,
  },
});


export const actPrompt = ai.definePrompt({
  name: "act",
  system: `You are an execution agent. Your task is to execute the first step of the provided plan.`,
  prompt: `The steps takes so far:
{{#each @state.pastSteps}}
  - Step: {{this.task}}
    Outcome:
\`\`\`
{{this.response}}
\`\`\`
{{/each}}
  
The current plan is:
{{#each @state.plan}}
  - {{this}}
{{/each}}
Execute the first step: "{{ @state.plan.[0] }}" and provide the result.`,
});
