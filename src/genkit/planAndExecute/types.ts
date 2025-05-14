
export interface PlannerState {
  objective: string;
  pastSteps: { task: string; response: any }[];
  plan: string[];
};
