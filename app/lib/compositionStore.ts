import { create } from "zustand";
import type { WordCloudData, CompositionStore } from "./definitions";

export const useCompositionStore = create<CompositionStore>((set) => ({
  composition: [],
  setComposition: (words: WordCloudData[]) => set({ composition: words }),
  updateWordPosition: (index: number, x: number, y: number) =>
    set((state) => {
      const updated = [...state.composition];
      updated[index] = { ...updated[index], x, y };
      return { composition: updated };
    }),
}));
