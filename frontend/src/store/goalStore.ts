// Zustand store — holds the form data as the user fills in each onboarding step
import { create } from "zustand";
import type { GoalCreate, Level } from "@/types/goal";
import { DEFAULT_CRITERIA } from "@/lib/constants";

// Local criterion type (used before saving to backend)
export interface LocalCriterion {
  id: string;
  label: string;
  description: string;
}

interface GoalStore {
  currentStep: number;
  goalData: Partial<GoalCreate>;
  savedGoalId: number | null;
  localCriteria: LocalCriterion[];

  setStep: (step: number) => void;
  updateGoal: (data: Partial<GoalCreate>) => void;
  setSavedGoalId: (id: number) => void;
  setLocalCriteria: (criteria: LocalCriterion[]) => void;
  reset: () => void;
}

const defaultCriteria: LocalCriterion[] = DEFAULT_CRITERIA.map((c, i) => ({
  id: `default-${i}`,
  label: c.label,
  description: c.description,
}));

export const useGoalStore = create<GoalStore>((set) => ({
  currentStep: 1,
  goalData: { level: "beginner", skills_tools: [], time_weeks: 8, hours_per_week: 10 },
  savedGoalId: null,
  localCriteria: defaultCriteria,

  setStep: (step) => set({ currentStep: step }),
  updateGoal: (data) => set((s) => ({ goalData: { ...s.goalData, ...data } })),
  setSavedGoalId: (id) => set({ savedGoalId: id }),
  setLocalCriteria: (criteria) => set({ localCriteria: criteria }),
  reset: () => set({ currentStep: 1, goalData: {}, savedGoalId: null, localCriteria: defaultCriteria }),
}));
