export type SegmentedWord = {
  text: string;
  count: number;
  isCustom?: boolean;
};

export type WordComposition = {
  text: string;
  x: number;
  y: number;
  descent: number;
  fontSize: number;
  rotate?: number;
  width: number;
  height: number;
};

export type FontStyle = {
  fontFamily: string;
  fontWeight: string | number;
  italic?: boolean;
  underline?: boolean;
};

export type TextColor = {
  color: string;
  sourceSlotId?: string;
};

export type RGBAColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type TextShadow = {
  dx: number;
  dy: number;
  blur: number;
  rgba: RGBAColor;
};

export type TextColorPaletteSlot = {
  id: string;
  color: string;
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
