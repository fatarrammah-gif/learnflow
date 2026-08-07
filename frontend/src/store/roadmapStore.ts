import { create } from "zustand";
import type { Roadmap, SkillNode } from "@/types/roadmap";

interface RoadmapStore {
  activeRoadmap: Roadmap | null;
  selectedNodeId: number | null;
  isPanelOpen: boolean;

  setRoadmap: (r: Roadmap) => void;
  selectNode: (id: number | null) => void;
  setPanelOpen: (open: boolean) => void;
  getSelectedNode: () => SkillNode | undefined;
}

export const useRoadmapStore = create<RoadmapStore>((set, get) => ({
  activeRoadmap: null,
  selectedNodeId: null,
  isPanelOpen: false,

  setRoadmap: (r) => set({ activeRoadmap: r }),
  selectNode: (id) => set({ selectedNodeId: id, isPanelOpen: id !== null }),
  setPanelOpen: (open) => set({ isPanelOpen: open }),
  getSelectedNode: () => {
    const { activeRoadmap, selectedNodeId } = get();
    return activeRoadmap?.nodes.find((n) => n.id === selectedNodeId);
  },
}));
