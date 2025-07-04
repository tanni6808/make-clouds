import { SegmentedWord, WordComposition } from "./definitions";

// 計算並從文章中移除自訂詞彙
function processCustomKeywords(
  article: string,
  keywords: string[]
): {
  countedCustomKeywords: SegmentedWord[];
  remainingText: string;
} {
  let text = article;
  const result: SegmentedWord[] = [];
  if (keywords.length !== 0) {
    keywords.forEach((keyword, i) => {
      const regex = new RegExp(keyword, "gi");
      const matches = text.match(regex);

      if (!matches) {
        keywords.splice(i);
        return alert(
          `找不到${keyword}。請檢查是否有重疊或簡短的自訂詞造成衝突。建議刪除可能有問題的詞，或直接清除所有自訂詞後再試一次。`
        );
      }
      result.push({ text: keyword, count: matches.length, isCustom: true });
      text = text.replaceAll(regex, " ");
    });
  }

  return { countedCustomKeywords: result, remainingText: text };
}

// 斷詞
function segmentText(text: string): string[] {
  const segmenter = new Intl.Segmenter("zh-tw", { granularity: "word" });
  return Array.from(segmenter.segment(text))
    .filter((segment) => segment.isWordLike)
    .map((segment) => segment.segment.trim())
    .filter((w) => w.length > 0);
}

// 統計詞頻並過濾停用詞
function countWords(words: string[], stopwords: Set<string>): SegmentedWord[] {
  const wordMap = new Map<string, number>();
  for (const word of words) {
    if (stopwords.has(word)) continue;
    wordMap.set(word, (wordMap.get(word) || 0) + 1);
  }

  return Array.from(wordMap.entries()).map(([word, count]) => ({
    text: word,
    count,
    isCustom: false,
  }));
}

export function generateWordList(
  customKeywords: string[],
  article: string,
  stopwords: Set<string>
): SegmentedWord[] {
  try {
    const processed = processCustomKeywords(article, customKeywords);
    const segmented = segmentText(processed.remainingText);
    const wordsInfo = countWords(segmented, stopwords);
    const result = [...processed.countedCustomKeywords, ...wordsInfo].sort(
      (a, b) => b.count - a.count
    );
    return result;
  } catch (err) {
    alert(err instanceof Error ? err.message : "切割詞彙時發生錯誤。");
    return [];
  }
}

// 以 log(n) scale 轉換出每個詞的大小
function calcFontSize(
  wordList: SegmentedWord[]
): { text: string; size: number }[] {
  const drawWords: { text: string; size: number }[] = [];
  const wordCounts = wordList.map((w) => w.count);
  const logMin = Math.log(Math.min(...wordCounts));
  const logMax = Math.log(Math.max(...wordCounts));
  const maxFont = 96;
  const minFont = 12;
  wordList.forEach((word) => {
    const logCount = Math.log(word.count);
    const ratio = (logCount - logMin) / (logMax - logMin);
    drawWords.push({
      text: word.text,
      size: minFont + ratio * (maxFont - minFont),
    });
  });
  return drawWords;
}

function isOverlap(a: DOMRect, b: DOMRect) {
  return !(
    a.x + a.width < b.x ||
    a.x > b.x + b.width ||
    a.y + a.height < b.y ||
    a.y > b.y + b.height
  );
}

export function generateWordCloud(
  wordList: SegmentedWord[],
  svgEl: SVGSVGElement
): WordComposition[] {
  const drawWords = calcFontSize(wordList);
  const svg = svgEl;
  const xmlns = "http://www.w3.org/2000/svg";
  const { width, height } = svg.getBoundingClientRect();
  const centerX = width / 2;
  const centerY = height / 2;

  const measureGroup = document.createElementNS(xmlns, "g");
  measureGroup.setAttribute("visibility", "hidden");
  measureGroup.setAttribute("opacity", "0");
  svg.appendChild(measureGroup);

  const placedRects: DOMRect[] = [];
  const result: WordComposition[] = [];

  // 建立離螢幕 canvas 測量用
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = "bold 16px Noto Sans TC"; // 預設 font

  drawWords.forEach((word, index) => {
    // 設定文字樣式
    ctx.font = `bold ${word.size}px Noto Sans TC`;

    const padding = 2;

    const metrics = ctx.measureText(word.text);
    const textWidth = metrics.width;
    const ascent = metrics.actualBoundingBoxAscent + padding;
    const descent = metrics.actualBoundingBoxDescent + padding;
    const textHeight = ascent + descent;

    let centerOffsetX = 0;
    if (index === 0) {
      centerOffsetX = textWidth / 2;
    }

    // 隨機放置
    const step = 1;
    let placed = false;
    let attempts = 0;
    const maxAttempts = 1000;

    while (!placed && attempts < maxAttempts) {
      const startRadius = 10 + Math.random() * 200;
      const angleOffset = Math.random() * Math.PI * 2;
      const r = startRadius + step * attempts;
      const a = angleOffset;

      const x = centerX - centerOffsetX + r * Math.cos(a);
      const y = centerY + r * 0.6 * Math.sin(a);

      //　用 baseline 作為 y，rect 要往上移 ascent
      const rect = new DOMRect(x, y - ascent, textWidth, textHeight);
      const overlap = placedRects.some((w) => isOverlap(w, rect));

      if (!overlap) {
        placedRects.push(rect);
        placed = true;

        result.push({
          text: word.text,
          x: x,
          y: y,
          descent: descent,
          fontSize: word.size,
          width: textWidth,
          height: textHeight,
        });
      }

      attempts++;
    }

    if (!placed) {
      const fallbackX = 0;
      const fallbackY = 0;

      result.push({
        text: word.text,
        x: fallbackX,
        y: fallbackY,
        descent: descent,
        fontSize: word.size,
        width: textWidth,
        height: textHeight,
      });

      alert(`${word.text} 找不到合適的位置，將放置於左上角。`);
    }
  });

  return result;
}

export function renderWordCloud(
  groupEl: SVGGElement,
  composition: WordComposition[]
) {
  groupEl.innerHTML = "";
  composition.forEach((word) => {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", word.x.toString());
    text.setAttribute("y", word.y.toString());
    text.setAttribute("font-size", word.fontSize.toString());
    text.textContent = word.text;
    groupEl.appendChild(text);
  });
}
