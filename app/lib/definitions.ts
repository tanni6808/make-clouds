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

export type CanvasTransform = {
  scale: number;
  translateX: number;
  translateY: number;
};

export type DragState = {
  index: number | null;
  offsetX: number;
  offsetY: number;
};

///////////// NEW STRUCTURE
export type SegmentedWord = {
  text: string;
  count: number;
  isCustom?: boolean;
};

export type WordComposition = {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  rotate?: number;
  width: number;
  height: number;
};

export type FontStyle = {
  fontFamily: string;
  fontWeight: string | number;
  italic?: boolean;
  shadow?: boolean;
};

export type TextColor = {
  color: string;
  isCustom: boolean;
};

export type ColorScheme = {
  mode: string;
  colors: string[];
};

export type Transform = {
  scale: number;
  translateX: number;
  translateY: number;
};

export type CanvasProps = {
  words: WordComposition[];
  // hoveredIndex: number | null;
  // selectedIndex: number | null;
  // onHover: (index: number | null) => void; // NOTE hover can be on text or on svg(null) ?
  // onSelect: (index: number) => void;
  // onMove: (index: number, x: number, y: number) => void;
};
