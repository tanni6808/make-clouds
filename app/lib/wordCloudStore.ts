import { create } from "zustand";
import {
  SegmentedWord,
  WordComposition,
  FontStyle,
  TextColor,
  ColorScheme,
} from "./definitions";

type WordCloudState = {
  // 階段一: 輸入文章
  article: string;
  setArticle: (text: string) => void;

  // 階段二: 詞彙確認
  customWords: string[];
  addCustomWord: (word: string) => void;
  removeCustomWord: (word: string) => void;

  segmentedWords: SegmentedWord[];
  setSegmentedWords: (words: SegmentedWord[]) => void;

  removedWords: SegmentedWord[];
  excludeWord: (word: SegmentedWord) => void;
  restoreWord: (word: SegmentedWord) => void;

  selectionCount: number;
  incrementSelectionCount: (step: number) => void;
  decrementSelectionCount: (step: number) => void;

  getSelectedWords: () => SegmentedWord[];

  composition: WordComposition[];
  setComposition: (words: WordComposition[]) => void;
  updateWordPosition: (text: string, x: number, y: number) => void;

  // 階段三: 字型、顏色
  fontStyleMap: Record<string, FontStyle>;
  setFontStyle: (text: string, style: FontStyle) => void;
  // setAllFontStyles: (styles: Record<string, FontStyle>) => void;
  globalFontStyle: FontStyle;
  setGlobalFontStyle: (fontStyle: FontStyle) => void;

  textColorMap: Record<string, TextColor>;
  setTextColor: (text: string, color: TextColor) => void;
  baseTextColor: string;
  setBaseTextColor: (color: string) => void;
  schemeMode: string;
  setSchemeMode: (scheme: string) => void;
  colorSchemes: ColorScheme[];
  setColorSchemes: (schemes: ColorScheme[]) => void;
  setRandomColorsFromScheme: () => void;
  customColorScheme: string[];
  setCustomColorScheme: (colors: string[]) => void;
};

export const useWordCloudStore = create<WordCloudState>((set, get) => ({
  article: "",
  setArticle: (text) => set({ article: text }),

  customWords: [],
  addCustomWord: (word) => {
    const existing = get().segmentedWords;
    if (existing.find((w) => w.text === word))
      return alert(`「${word}」已經在詞彙庫中`);
    set({
      customWords: [...get().customWords, word],
    });
  },
  removeCustomWord: (word) => {
    const newList = get().customWords.filter((w) => w !== word);
    set({ customWords: newList });
  },

  segmentedWords: [],
  setSegmentedWords: (words) => set({ segmentedWords: words }),

  removedWords: [],
  excludeWord: (word) => {
    const { removedWords } = get();

    if (removedWords.find((w) => w.text === word.text)) return; // 已移除就跳過

    set({ removedWords: [...removedWords, word] });
  },

  restoreWord: (word) => {
    const { removedWords } = get();

    const newRemoved = removedWords.filter((w) => w.text !== word.text);
    set({ removedWords: newRemoved });
  },

  selectionCount: 50,
  incrementSelectionCount: (step: number) => {
    const current = get().selectionCount;
    const newCount = Math.min(100, current + step);
    set({ selectionCount: newCount });
  },
  decrementSelectionCount: (step: number) => {
    const current = get().selectionCount;
    const newCount = Math.max(10, current - step);
    set({ selectionCount: newCount });
  },

  getSelectedWords: () => {
    const { segmentedWords, removedWords, selectionCount } = get();
    const pool = segmentedWords.filter(
      (w) => !removedWords.some((r) => r.text === w.text)
    );
    return pool.slice(0, selectionCount);
  },

  composition: [],
  setComposition: (words) => set({ composition: words }),
  updateWordPosition: (text, x, y) => {
    set({
      composition: get().composition.map((w) =>
        w.text === text ? { ...w, x, y } : w
      ),
    });
  },

  fontStyleMap: {},
  setFontStyle: (text, style) => {
    set({ fontStyleMap: { ...get().fontStyleMap, [text]: style } });
  },
  // setAllFontStyles: (styles) => set({ fontStyleMap: styles }),

  globalFontStyle: {
    fontFamily: "Noto sans TC",
    fontWeight: "bold",
    italic: false,
    shadow: false,
  },
  setGlobalFontStyle: (style) => set({ globalFontStyle: style }),

  textColorMap: {},
  setTextColor: (text, color) => {
    set({ textColorMap: { ...get().textColorMap, [text]: color } });
  },
  baseTextColor: "#545454",
  setBaseTextColor: (color) => set({ baseTextColor: color }),
  schemeMode: "none",
  setSchemeMode: (scheme) => set({ schemeMode: scheme }),
  setColorScheme: (mode: string) => set({ schemeMode: mode }),
  colorSchemes: [],
  setColorSchemes: (schemes: ColorScheme[]) => set({ colorSchemes: schemes }),
  customColorScheme: [],
  setCustomColorScheme: (colors: string[]) => {
    const { getSelectedWords, baseTextColor } = get();
    const words = getSelectedWords();
    const textColorMap: Record<string, TextColor> = {};
    const colorList = [baseTextColor, ...colors];

    words.forEach((word, i) => {
      const color = colorList[i % colorList.length];
      textColorMap[word.text] = { color, isCustom: false };
    });

    set({
      customColorScheme: colors,
      schemeMode: "custom",
      textColorMap,
    });
  },
  setRandomColorsFromScheme: () => {
    const {
      baseTextColor,
      schemeMode,
      colorSchemes,
      getSelectedWords,
      customColorScheme,
    } = get();

    const words = getSelectedWords();
    const map: Record<string, TextColor> = {};

    let colorList: string[] = [];

    if (schemeMode === "none") {
      colorList = [baseTextColor];
    } else if (schemeMode === "custom") {
      if (customColorScheme.length === 0) {
        colorList = [baseTextColor];
      } else {
        colorList = [baseTextColor, ...customColorScheme];
      }
    } else {
      const scheme = colorSchemes.find((s) => s.mode === schemeMode);
      if (scheme) colorList = scheme.colors;
    }

    if (colorList.length === 0) return;

    words.forEach((word) => {
      const randomColor =
        colorList[Math.floor(Math.random() * colorList.length)];
      map[word.text] = { color: randomColor, isCustom: false };
    });

    set({ textColorMap: map });
  },
}));
