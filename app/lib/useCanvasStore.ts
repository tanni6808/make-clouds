import { create } from "zustand";

type CanvasStore = {
  canvasSVGRef: SVGSVGElement | null;
  setCanvasSVGRef: (ref: SVGSVGElement | null) => void;

  canvasGRef: SVGGElement | null;
  setCanvasGRef: (ref: SVGGElement | null) => void;

  triggerRegenerate: () => void;
  setTriggerRegenerate: (fn: () => void) => void;

  downloadSVG: () => void;
  setDownloadSVG: (fn: () => void) => void;

  downloadPNG: () => void;
  setDownloadPNG: (fn: () => void) => void;
};

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  canvasSVGRef: null,
  setCanvasSVGRef: (ref) => set({ canvasSVGRef: ref }),

  canvasGRef: null,
  setCanvasGRef: (ref) => set({ canvasGRef: ref }),

  triggerRegenerate: () => {},
  setTriggerRegenerate: (fn) => set({ triggerRegenerate: fn }),

  downloadSVG: () => {},
  setDownloadSVG: (fn) => set({ downloadSVG: fn }),

  downloadPNG: () => {},
  setDownloadPNG: (fn) => set({ downloadPNG: fn }),
}));
