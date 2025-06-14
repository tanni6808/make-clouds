import { create } from "zustand";
import {
  SegmentedWord,
  WordComposition,
  FontStyle,
  TextColor,
  TextColorPaletteSlot,
  ColorScheme,
  TextShadow,
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
  defaultFontStyle: FontStyle;
  globalFontStyle: Partial<FontStyle>;
  fontStyleMap: Record<string, Partial<FontStyle>>;
  setGlobalFontStyle: (style: Partial<FontStyle>) => void;
  setIndividualFontStyle: (text: string, style: Partial<FontStyle>) => void;
  clearGlobalFontStyle: () => void;
  clearIndividualFontStyle: (text: string) => void;

  defaultTextColor: string;
  textColorPalette: TextColorPaletteSlot[];
  setTextColorPalette: (color: TextColorPaletteSlot[]) => void;
  textColorMap: Record<string, TextColor>;
  updatePaletteSlot: (oldColor: string, newColor: string) => void;
  setTextColor: (text: string, color: string) => void;
  schemeMode: string;
  setSchemeMode: (scheme: string) => void;
  colorSchemes: ColorScheme[];
  setColorSchemes: (schemes: ColorScheme[]) => void;
  setRandomTextColor: () => void;

  // defaultTextShadow: TextShadow;
  globalTextShadow: TextShadow;
  textShadowMap: Record<string, TextShadow>;
  setGlobalTextShadow: (shadow: Partial<TextShadow>) => void;
  setTextShadow: (text: string, shadow: TextShadow) => void;
  // baseTextColor: string;
  // setBaseTextColor: (color: string) => void;
  // customColorScheme: string[];
  // setCustomColorScheme: (colors: string[]) => void;
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

  // 字型
  defaultFontStyle: {
    fontFamily: "Noto sans TC",
    fontWeight: "700",
    italic: false,
    underline: false,
  },
  globalFontStyle: {},
  fontStyleMap: {},

  setGlobalFontStyle: (updates: Partial<FontStyle>) =>
    set((state) => ({
      globalFontStyle: {
        ...state.globalFontStyle,
        ...updates,
      },
    })),
  setIndividualFontStyle: (text, style) => {
    const current = get().fontStyleMap[text] || {};
    set((state) => ({
      fontStyleMap: {
        ...state.fontStyleMap,
        [text]: { ...current, ...style },
      },
    }));
  },

  clearGlobalFontStyle: () => set({ globalFontStyle: {} }),
  clearIndividualFontStyle: (text) => {
    set((state) => {
      const newMap = { ...state.fontStyleMap };
      delete newMap[text];
      return { fontStyleMap: newMap };
    });
  },

  // 顏色
  defaultTextColor: "#545454",
  textColorPalette: [], // max: 5 colors
  setTextColorPalette: (color: TextColorPaletteSlot[]) => {
    set({ textColorPalette: color });
  },
  textColorMap: {},
  updatePaletteSlot: (slotId: string, newColor: string) => {
    set((state) => {
      const updatedMap = { ...state.textColorMap };
      for (const key in updatedMap) {
        const wordColor = updatedMap[key];
        if (wordColor.sourceSlotId === slotId) {
          updatedMap[key] = {
            ...wordColor,
            color: newColor,
          };
        }
      }
      const updatedPalette = state.textColorPalette.map((slot) =>
        slot.id === slotId ? { ...slot, color: newColor } : slot
      );
      return { textColorMap: updatedMap, textColorPalette: updatedPalette };
    });
  },
  setTextColor: (text: string, color: string) => {
    set((state) => ({
      textColorMap: {
        ...state.textColorMap,
        [text]: {
          color,
        },
      },
    }));
  },
  schemeMode: "none",
  setSchemeMode: (scheme) => set({ schemeMode: scheme }),
  colorSchemes: [],
  setColorSchemes: (schemes: ColorScheme[]) => set({ colorSchemes: schemes }),
  setRandomTextColor: () => {
    const { textColorPalette, getSelectedWords } = get();

    const words = getSelectedWords();
    const map: Record<string, TextColor> = {};

    const colorList: TextColorPaletteSlot[] = textColorPalette;

    if (colorList.length === 0) {
      set((state) => {
        const cleanedMap: Record<string, TextColor> = {};
        for (const key in state.textColorMap) {
          const entry = state.textColorMap[key];
          if (!entry.sourceSlotId) {
            cleanedMap[key] = entry;
          }
        }
        return { textColorMap: cleanedMap };
      });
      return;
    }

    words.forEach((word) => {
      const randomColor =
        colorList[Math.floor(Math.random() * colorList.length)];
      map[word.text] = {
        color: randomColor.color,
        sourceSlotId: randomColor.id,
      };
    });

    set({ textColorMap: map });
  },

  globalTextShadow: {
    dx: 0,
    dy: 0,
    blur: 0,
    color: { r: 84, g: 85, b: 84 },
    opacity: 0,
  },
  textShadowMap: {},
  setGlobalTextShadow: (shadow: Partial<TextShadow>) =>
    set((state) => ({
      globalTextShadow: {
        ...state.globalTextShadow,
        ...shadow,
      },
    })),
  setTextShadow: (text: string, shadow: TextShadow) => {
    const current = get().textShadowMap[text] || {};
    set((state) => ({
      textShadowMap: {
        ...state.textShadowMap,
        [text]: { ...current, ...shadow },
      },
    }));
  },
  // baseTextColor: "#545454",
  // setBaseTextColor: (color) => set({ baseTextColor: color }),
  // setColorScheme: (mode: string) => set({ schemeMode: mode }),
  // customColorScheme: [],
  // setCustomColorScheme: (colors: string[]) => {
  //   const { getSelectedWords, baseTextColor } = get();
  //   const words = getSelectedWords();
  //   const textColorMap: Record<string, TextColor> = {};
  //   const colorList = [baseTextColor, ...colors];

  //   words.forEach((word, i) => {
  //     const color = colorList[i % colorList.length];
  //     textColorMap[word.text] = { color, isCustom: false };
  //   });

  //   set({
  //     customColorScheme: colors,
  //     schemeMode: "custom",
  //     textColorMap,
  //   });
  // },
}));
