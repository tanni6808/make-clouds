import { create } from "zustand";

type CanvasStore = {
  canvasSVGRef: SVGSVGElement | null;
  setCanvasSVGRef: (ref: SVGSVGElement | null) => void;

  canvasGRef: SVGGElement | null;
  setCanvasGRef: (ref: SVGGElement | null) => void;

  canvasColor: string;
  setCanvasColor: (color: string) => void;

  triggerRegenerate: () => void;
  setTriggerRegenerate: (fn: () => void) => void;

  downloadSVG: (bgTransIsChecked: boolean) => void;
  setDownloadSVG: (fn: (bgTransIsChecked: boolean) => void) => void;

  downloadPNG: (bgTransIsChecked: boolean) => void;
  setDownloadPNG: (fn: (bgTransIsChecked: boolean) => void) => void;
};

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  canvasSVGRef: null,
  setCanvasSVGRef: (ref) => set({ canvasSVGRef: ref }),

  canvasGRef: null,
  setCanvasGRef: (ref) => set({ canvasGRef: ref }),

  canvasColor: "#ffffff",
  setCanvasColor: (color) => set({ canvasColor: color }),

  triggerRegenerate: () => {},
  setTriggerRegenerate: (fn) => set({ triggerRegenerate: fn }),

  downloadSVG: () => {},
  setDownloadSVG: (fn) => set({ downloadSVG: fn }),

  downloadPNG: () => {},
  setDownloadPNG: (fn) => set({ downloadPNG: fn }),
}));
