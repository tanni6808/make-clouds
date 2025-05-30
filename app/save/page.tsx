"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCompositionStore } from "../lib/compositionStore";
import { Words, WordCloudData, ColorScheme } from "../lib/definitions";

export default function Home() {
  const maxFontSize = 96;
  const minFontSize = 12;
  const router = useRouter();
  const [addWord, setAddWord] = useState<string>("");
  const [customizedWords, setCustomizedWords] = useState<string[]>([]);
  const [maxWords, setMaxWords] = useState<number>(50);
  const [stopwords, setStopwords] = useState<Set<string>>(new Set());
  const [article, setArticle] = useState<string>("");
  const [result, setResult] = useState<Words[]>([]);
  const [baseColor, setBaseColor] = useState<string>("#000000");
  const [schemeMode, setSchemeMode] = useState<string>("none");
  const [colorSchemes, setColorSchemes] = useState<ColorScheme[]>([]);
  const [shouldApplyScheme, setShouldApplyScheme] = useState(false);
  const { setComposition } = useCompositionStore();
  const isEffectCalledRef = useRef(false);
  const isWordCloudAppend = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Fetch Color Scheme
  async function getColorScheme() {
    const schemeAndCount = [
      { scheme: "monochrome", count: "3" },
      { scheme: "analogic", count: "3" },
      { scheme: "complement", count: "2" },
      { scheme: "triad", count: "3" },
      { scheme: "quad", count: "4" },
    ];
    const hex = baseColor.replace("#", "");
    const results = await Promise.all(
      schemeAndCount.map(({ scheme, count }) =>
        fetch(
          `https://www.thecolorapi.com/scheme?hex=${hex}&format=json&mode=${scheme}&count=${count}`
        ).then((res) => res.json())
      )
    );
    const allColorSchemes = results.map((result) => {
      const colorArr = result.colors.map(
        (color: { hex: { value: any } }) => color.hex.value
      );
      return { mode: result.mode, colors: colorArr };
    });
    return allColorSchemes;
  }

  // 下載SVG檔案
  const handleDlSvg = () => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "makeWordCloud.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 返回修改文章
  const handleReset = () => {
    if (confirm("目前的進度將會全部被清除，是否繼續？")) {
      if (!svgRef.current) return;
      const svg = svgRef.current;
      svg.innerHTML = "";
      isWordCloudAppend.current = false;
      setAddWord("");
      setCustomizedWords([]);
      setResult([]);
      setBaseColor("#000000");
      setSchemeMode("none");
    }
  };

  // 刪除自訂詞彙
  const handleDelCustomizedWord = (word: string) => {
    setCustomizedWords((prev) => prev.filter((w) => w !== word));
  };

  // 輸入文章
  const handleSubmit = () => {
    if (!article.trim()) return alert("請輸入文章!");
    isWordCloudAppend.current = true;
    const drawWords = generateWordArr(customizedWords, article, stopwords);

    setResult(drawWords);
  };

  // 新增自訂詞彙
  const handleAddCustomizedWord = () => {
    const clearWord = addWord.trim();
    if (!clearWord) return alert("請輸入詞彙。");
    if (result.filter((w) => w.word === clearWord).length !== 0)
      return alert(
        `「${clearWord}」已經被使用；若找不到該詞彙，有可能是因為出現次數過少而未被顯示。`
      );
    setCustomizedWords((prev) => [...prev, addWord]);
  };

  // 取得範本/停用詞
  useEffect(() => {
    if (!isEffectCalledRef.current) {
      isEffectCalledRef.current = true;
      fetch("/texts/word-cloud.txt") //<================== change text
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

  // 更新自訂詞彙
  useEffect(() => {
    if (!isWordCloudAppend.current) return;
    const drawWords = generateWordArr(customizedWords, article, stopwords);
    setResult(drawWords);
    setAddWord("");
  }, [customizedWords]);

  // 進行文字雲繪製
  useEffect(() => {
    if (!svgRef.current) return;
    if (!isWordCloudAppend.current) return;

    // 以 log(n) scale 轉換出每個詞的大小
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
    const thisWordCloud: WordCloudData[] = [];

    // 隨機性
    const firstWordSideX = Math.round(Math.random());
    const firstWordSideY = Math.round(Math.random());

    result.slice(0, maxWords).forEach((word, index) => {
      const text = document.createElementNS(xmlns, "text");
      text.textContent = word.word;
      text.setAttribute("font-size", word.size.toString());
      text.setAttribute("fill", baseColor);
      text.style.fontFamily = "impact";
      text.style.fontWeight = "bold";

      // 決定第一個字的起始象限
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

      // 隨機選位
      const step = 1;
      let placed = false;
      let attempts = 0;
      const maxAttempts = 1000;

      while (!placed && attempts < maxAttempts) {
        const startRadius = 10 + Math.random() * 200;
        const angleOffset = Math.random() * Math.PI * 2;
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
          thisWordCloud.push({
            text: word.word,
            x: x,
            y: y,
            fontSize: word.size,
          });
        }
        attempts++;
      }

      if (!placed) {
        text.setAttribute("x", "0");
        text.setAttribute("y", "0");
        group.appendChild(text);
        thisWordCloud.push({
          text: word.word,
          x: 0,
          y: 0,
          fontSize: word.size,
        });
        alert(`${word.word}找不到合適的位置，將放置於左上角。`);
        return;
      }
    });

    setComposition(thisWordCloud);

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
  }, [result, maxWords]);

  // 改顏色
  useEffect(() => {
    if (!svgRef.current) return;

    const textEls = svgRef.current.querySelectorAll("text");
    if (schemeMode === "none") {
      textEls.forEach((textEl) => {
        textEl.setAttribute("fill", baseColor);
      });
    }
    const fetchColorScheme = async () => {
      const schemes = await getColorScheme();
      setColorSchemes(schemes);
      setShouldApplyScheme(true);
    };
    fetchColorScheme();
  }, [baseColor, schemeMode, result, maxWords]);

  useEffect(() => {
    if (!shouldApplyScheme) return;
    const scheme = colorSchemes.find((s) => s.mode === schemeMode);
    if (!scheme) return;
    if (!svgRef.current) return;

    const textEls = svgRef.current.querySelectorAll("text");

    textEls.forEach((textEl) => {
      const thisColors = colorSchemes.find(
        (scheme) => scheme.mode === schemeMode
      )?.colors;
      if (thisColors) {
        const randomColor =
          thisColors[Math.floor(Math.random() * thisColors.length)];
        textEl.setAttribute("fill", randomColor);
      }
    });
    setShouldApplyScheme(false);
  }, [colorSchemes, shouldApplyScheme]);

  return (
    <div className="flex">
      <div className="w-1/3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="m-2 flex flex-col"
        >
          <div className={isWordCloudAppend.current ? "hidden" : ""}>
            輸入文章：
          </div>
          <textarea
            name=""
            id=""
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            className={`${
              isWordCloudAppend.current ? "hidden" : ""
            } h-40 border-2 border-gray-500`}
            required
          ></textarea>
          <div className="flex">
            <button
              type="submit"
              className="w-20 h-10 border-1 my-2 hover:bg-gray-300"
            >
              {isWordCloudAppend.current ? "重新排列" : "開始繪製"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={`${
                isWordCloudAppend.current ? "" : "hidden"
              } w-20 h-10 border-1 my-2 ml-4 text-red-600 hover:bg-red-300`}
            >
              修改文章
            </button>
          </div>
        </form>
        <div className={`${isWordCloudAppend.current ? "" : "hidden"} flex`}>
          <div className="w-2/4 m-2">
            <div className="">詞彙庫：</div>
            <div className=" h-80 border-2 border-blue-800 overflow-y-scroll">
              {result
                .slice(0, maxWords)
                .filter((w) => !new Set(customizedWords).has(w.word))
                .map((word, index) => (
                  <div
                    key={index}
                    className="flex p-2 justify-between hover:bg-blue-100"
                  >
                    <div>{`${word.word}, Counts: ${word.count}`}</div>
                  </div>
                ))}
            </div>
          </div>
          <div className="w-2/4 m-2">
            <div className="">自訂詞彙：</div>
            <div className="h-80 border-2 border-red-800 overflow-y-scroll">
              {result
                .slice(0, maxWords)
                .filter((w) => new Set(customizedWords).has(w.word))
                .map((word, index) => (
                  <div
                    key={index}
                    className="flex p-2 justify-between hover:bg-blue-100"
                  >
                    <div>{`${word.word}, Counts: ${word.count}`}</div>
                    <button
                      onClick={() => handleDelCustomizedWord(word.word)}
                      className="border-1 hover:bg-gray-300 px-1"
                    >
                      刪除
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className={isWordCloudAppend.current ? "" : "hidden"}>
          <form
            className="m-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCustomizedWord();
            }}
          >
            <div className="">關鍵詞未被正確切割？</div>
            <label htmlFor="">手動新增：</label>
            <input
              type="text"
              className="border-1"
              value={addWord}
              onChange={(e) => setAddWord(e.target.value)}
            />
            <button type="submit" className="border-1 hover:bg-gray-300 px-1">
              新增
            </button>
          </form>
          <div className="flex">
            <div className="m-2">
              <label htmlFor="">字詞數量（10-100）：</label>
              <button
                onClick={() => setMaxWords((prevMaxWords) => prevMaxWords - 10)}
                className="border-1 mx-1 px-1 hover:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-white"
                disabled={maxWords < 20 ? true : false}
              >
                -10
              </button>
              <button
                onClick={() => setMaxWords((prevMaxWords) => prevMaxWords - 1)}
                className="border-1 mx-1 px-1 hover:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-white"
                disabled={maxWords < 11 ? true : false}
              >
                -1
              </button>
              <span className="font-bold">{maxWords}</span>
              <button
                onClick={() => setMaxWords((prevMaxWords) => prevMaxWords + 1)}
                className="border-1 mx-1 px-1 hover:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-white"
                disabled={
                  maxWords > 99 || maxWords > result.length - 1 ? true : false
                }
              >
                +1
              </button>
              <button
                onClick={() => setMaxWords((prevMaxWords) => prevMaxWords + 10)}
                className="border-1 mx-1 px-1 hover:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-white"
                disabled={
                  maxWords > 90 || maxWords > result.length - 10 ? true : false
                }
              >
                +10
              </button>
            </div>
          </div>
          <form className="flex item-center m-2">
            <label htmlFor="">字詞顏色：</label>
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
            />
            <select
              value={schemeMode}
              onChange={(e) => setSchemeMode(e.target.value)}
            >
              <option value="none">單一顏色</option>
              <option value="monochrome">單色調</option>
              <option value="analogic">相似色</option>
              <option value="complement">互補色</option>
              <option value="triad">三等分</option>
              <option value="quad">矩形</option>
            </select>
          </form>
          <div className="m-2">
            <div className="flex">
              <div className="">單色調</div>
              <div className="flex">
                {colorSchemes
                  .find((scheme) => scheme.mode === "monochrome")
                  ?.colors.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: color,
                        height: "25px",
                        width: "25px",
                        borderRadius: "50%",
                      }}
                    ></div>
                  ))}
              </div>
            </div>
            <div className="flex">
              <div className="">相似色</div>
              <div className="flex">
                {colorSchemes
                  .find((scheme) => scheme.mode === "analogic")
                  ?.colors.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: color,
                        height: "25px",
                        width: "25px",
                        borderRadius: "50%",
                      }}
                    ></div>
                  ))}
              </div>
            </div>
            <div className="flex">
              <div className="">互補色</div>
              <div className="flex">
                {colorSchemes
                  .find((scheme) => scheme.mode === "complement")
                  ?.colors.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: color,
                        height: "25px",
                        width: "25px",
                        borderRadius: "50%",
                      }}
                    ></div>
                  ))}
              </div>
            </div>
            <div className="flex">
              <div className="">三等分</div>
              <div className="flex">
                {colorSchemes
                  .find((scheme) => scheme.mode === "triad")
                  ?.colors.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: color,
                        height: "25px",
                        width: "25px",
                        borderRadius: "50%",
                      }}
                    ></div>
                  ))}
              </div>
            </div>
            <div className="flex">
              <div className="">四邊形</div>
              <div className="flex">
                {colorSchemes
                  .find((scheme) => scheme.mode === "quad")
                  ?.colors.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: color,
                        height: "25px",
                        width: "25px",
                        borderRadius: "50%",
                      }}
                    ></div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="m-2">
        <div className="">預覽：</div>
        <svg ref={svgRef} width={600} height={400}></svg>
        <div className={isWordCloudAppend.current ? "flex" : "hidden"}>
          <button
            onClick={handleDlSvg}
            className="border-1 hover:bg-gray-300 px-1"
          >
            下載 (SVG)
          </button>
          <button
            className="border-1 hover:bg-gray-300 px-1"
            onClick={() => router.push("/canvas")}
          >
            進階調整
          </button>
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

function generateWordArr(
  prevArr: string[],
  article: string,
  stopwords: Set<string>
) {
  const keywordCounts: Words[] = [];
  let processedArticle = article;
  if (prevArr.length !== 0) {
    prevArr.forEach((keyword, i) => {
      const regex = new RegExp(keyword, "gi");
      const matches = processedArticle.match(regex);

      if (matches) {
        keywordCounts.push({ word: keyword, count: matches.length, size: 1 });
        processedArticle = processedArticle.replaceAll(regex, " ");
      } else {
        prevArr.splice(i);
        return alert(
          `找不到「${keyword}」。如果您確定文章中有這個詞，請檢查是否曾新增了過於簡短或重疊的自訂詞，導致詞彙被切割。建議刪除可能衝突的自訂詞，或直接清除所有自訂詞後再試一次。`
        );
      }
    });
  }

  const segmenter = new Intl.Segmenter("zh-tw", { granularity: "word" });
  // 進行斷詞
  const rawWords = Array.from(segmenter.segment(processedArticle))
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
  const allWords = [...keywordCounts, ...words];
  // 將結果從出現次數多到少排列
  allWords.sort((a, b) => b.count - a.count);

  // // 取得前100個詞；頻率較低的詞隨機抽取
  let drawWords: Words[] = [];
  if (allWords.length > 99) {
    const countThreshold = allWords[99].count; // 第100個詞的出現次數
    if (allWords[100].count === countThreshold) {
      const thresholdIndex = allWords.findIndex(
        (word) => word.count === countThreshold
      );
      const wordsAboveTh = allWords.slice(0, thresholdIndex);
      const wordsAtTh = allWords.filter(
        (word) => word.count === countThreshold
      );
      wordsAtTh.sort(() => Math.random() - 0.5);
      drawWords = [...wordsAboveTh, ...wordsAtTh].slice(0, 100);
    }
  } else drawWords = allWords.slice(0, 100);

  return drawWords;
}
