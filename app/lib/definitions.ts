export type Words = {
  word: string;
  count: number;
  size: number;
};

export type WordCloudData = {
  text: string;
  x: number;
  y: number;
  fontSize: number;
};

export type CompositionStore = {
  composition: WordCloudData[];
  setComposition: (words: WordCloudData[]) => void;
};

export type DragState = {
  index: number | null;
  offsetX: number;
  offsetY: number;
};

export type CanvasTransform = {
  scale: number;
  translateX: number;
  translateY: number;
};

export type ColorScheme = {
  mode: string;
  colors: string[];
};
