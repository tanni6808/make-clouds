"use client";
import { useState, useEffect, useRef } from "react";
import { Words } from "./lib/definitions";

export default function Home() {
  const [maxWords, setMaxWords] = useState<number>(100);
  const [maxFontSize, setMaxFontSize] = useState<number>(96);
  const [minFontSize, setMinFontSize] = useState<number>(12);
  const [stopwords, setStopwords] = useState<Set<string>>(new Set());
  const [article, setArticle] = useState<string>("");
  const [result, setResult] = useState<Words[]>([]);
  const isEffectCalledRef = useRef(false);
  const isWordCloudAppend = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleSubmit = () => {
    isWordCloudAppend.current = true;
    const segmenter = new Intl.Segmenter("zh-tw", { granularity: "word" });
    // 進行斷詞
    const rawWords = Array.from(segmenter.segment(article))
      .filter((segment) => segment.isWordLike)
      .map((segment) => segment.segment.trim());

    // 計算每個詞出現的次數
    const words: Words[] = [];
    rawWords.forEach((rawWord) => {
      if (stopwords.has(rawWord)) return; // 去除停用詞
      let inArr = false;
      words.forEach((word) => {
        if (rawWord === word.word) {
          inArr = true;
          word.count++;
        }
      });
      if (!inArr) words.push({ word: rawWord, count: 1, size: 1 });
    });
    // 將結果從出現次數多到少排列
    words.sort((a, b) => b.count - a.count);

    // // 取得前100個詞；頻率較低的詞隨機抽取
    let drawWords: Words[] = [];
    const countThreshold = words[99].count; // 第100個詞的出現次數
    if (words[100].count === countThreshold) {
      const thresholdIndex = words.findIndex(
        (word) => word.count === countThreshold
      );
      const wordsAboveTh = words.slice(0, thresholdIndex);
      const wordsAtTh = words.filter((word) => word.count === countThreshold);
      wordsAtTh.sort(() => Math.random() - 0.5);
      drawWords = [...wordsAboveTh, ...wordsAtTh].slice(0, 100);
    } else drawWords = words.slice(0, 100);

    // 輸出結果
    setResult(drawWords);
  };

  // 取得範本/停用詞
  useEffect(() => {
    if (!isEffectCalledRef.current) {
      isEffectCalledRef.current = true;
      fetch("/texts/pigeon.txt") //<================== change text
        .then((res) => res.text())
        .then((text) => setArticle(text));
      fetch("/stopwords.txt")
        .then((res) => res.text())
        .then((text) => {
          const words = text
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
          setStopwords(new Set(words));
        });
    }
  }, []);

  // 進行文字雲繪製
  useEffect(() => {
    if (!svgRef.current) return;
    if (!isWordCloudAppend.current) return;

    // 以 log(n) scale 計算每個詞的大小
    const wordCounts = result.slice(0, maxWords).map((w) => w.count);
    const logMin = Math.log(Math.min(...wordCounts));
    const logMax = Math.log(Math.max(...wordCounts));
    const maxFont = maxFontSize;
    const minFont = minFontSize;
    result.forEach((word) => {
      const logCount = Math.log(word.count);
      const ratio = (logCount - logMin) / (logMax - logMin);
      word.size = minFont + ratio * (maxFont - minFont);
    });

    const svg = svgRef.current;
    svg.innerHTML = "";
    const xmlns = "http://www.w3.org/2000/svg";
    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    const group = document.createElementNS(xmlns, "g");
    svg.appendChild(group);

    const placedWords: DOMRect[] = [];

    // 隨機性
    const startRadius = 10 + Math.random() * 75;
    const angleOffset = Math.random() * Math.PI * 4;
    const firstWordSideX = Math.round(Math.random());
    const firstWordSideY = Math.round(Math.random());

    result.slice(0, maxWords).forEach((word, index) => {
      const text = document.createElementNS(xmlns, "text");
      text.textContent = word.word;
      text.setAttribute("font-size", word.size.toString());
      text.setAttribute("fill", "black");
      text.style.fontFamily = "impact";
      text.style.fontWeight = "bold";
      // 決定第一個字的象限
      let centerOffsetX = 0;
      let centerOffsetY = 0;
      if (index === 0) {
        text.setAttribute("x", centerX.toString());
        text.setAttribute("y", centerY.toString());
        group.appendChild(text);
        const firstBbox = text.getBBox();
        group.removeChild(text);
        centerOffsetX = firstWordSideX === 0 ? 0 : firstBbox.width;
        centerOffsetY = firstWordSideY === 0 ? 0 : firstBbox.height;
      }

      const step = 1;
      let placed = false;
      let attempts = 0;
      const maxAttempts = 1000;

      while (!placed && attempts < maxAttempts) {
        const r = startRadius + step * attempts;
        const a = angleOffset + 0.5 * attempts;
        const x = centerX - centerOffsetX + r * Math.cos(a);
        const y = centerY - centerOffsetY + r * 0.6 * Math.sin(a);

        text.setAttribute("x", x.toString());
        text.setAttribute("y", y.toString());

        group.appendChild(text);
        const bbox = text.getBBox();
        group.removeChild(text);

        const rect = new DOMRect(bbox.x, bbox.y, bbox.width, bbox.height);
        const overlap = placedWords.some((w) => isOverlap(w, rect));

        if (!overlap) {
          group.appendChild(text);
          placedWords.push(rect);
          placed = true;
        }
        attempts++;
      }

      if (!placed) {
        alert(`無法放置${word.word}`);
        return;
      }
    });

    // 縮放到最適大小
    const bbox = group.getBBox();
    const scaleX = width / bbox.width;
    const scaleY = height / bbox.height;
    const scale = Math.min(scaleX, scaleY);
    const translateX = width / 2 - (bbox.x + bbox.width / 2) * scale;
    const translateY = height / 2 - (bbox.y + bbox.height / 2) * scale;

    group.setAttribute(
      "transform",
      `translate(${translateX}, ${translateY}) scale(${scale})`
    );
  }, [[result], maxWords, maxFontSize, minFontSize]);

  return (
    <div className="flex">
      <div className="w-1/3">
        <div className="flex">
          <div className="w-full h-80 border-2 border-blue-800 m-2 overflow-y-scroll">
            {result.slice(0, maxWords).map((word, index) => (
              <div
                key={index}
                className="flex p-2 justify-between hover:bg-blue-100"
              >
                <div>{`${word.word}, Counts: ${word.count}`}</div>
              </div>
            ))}
          </div>
          {/* <div className="w-2/4 h-80 border-2 border-red-800 m-2 overflow-y-scroll">
            {result.slice(maxWords).map((word, index) => (
              <div
                key={index}
                className="flex p-2 justify-between hover:bg-blue-100"
              >
                <div>{`${word.word}, Counts: ${word.count}`}</div>
              </div>
            ))}
          </div> */}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="m-2 flex flex-col"
        >
          <textarea
            name=""
            id=""
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            className="h-40 border-2 border-gray-500"
          ></textarea>
          <button
            type="submit"
            className="w-20 h-10 border-1 my-2 hover:bg-gray-300"
          >
            Go
          </button>
        </form>
      </div>
      <div className="">
        <svg ref={svgRef}></svg>
        <div className={isWordCloudAppend.current ? "" : "hidden"}>
          <div className="m-2">
            <label htmlFor="">關鍵詞未被正確切割？手動新增：</label>
            <input type="text" className="border-1" />
            <button className="border-1 hover:bg-gray-300">新增</button>
          </div>
          <div className="flex">
            <div className="m-2">
              <label htmlFor="">字詞數量：</label>
              <input
                type="number"
                name=""
                id=""
                className="border-1 w-10"
                min={10}
                max={100}
                value={maxWords}
                onChange={(e) => setMaxWords(Number(e.target.value))}
              />
            </div>
            {/* <div className="m-2">
              <label htmlFor="">最大字體：</label>
              <input
                type="number"
                name=""
                id=""
                className="border-1 w-12"
                min={minFontSize}
                max={300}
                value={maxFontSize}
                onChange={(e) => setMaxFontSize(Number(e.target.value))}
              />
            </div>
            <div className="m-2">
              <label htmlFor="">最小字體：</label>
              <input
                type="number"
                name=""
                id=""
                className="border-1 w-12"
                min={10}
                max={maxFontSize}
                value={minFontSize}
                onChange={(e) => setMinFontSize(Number(e.target.value))}
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function isOverlap(a: DOMRect, b: DOMRect) {
  return !(
    a.x + a.width < b.x ||
    a.x > b.x + b.width ||
    a.y + a.height < b.y ||
    a.y > b.y + b.height
  );
}
