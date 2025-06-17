"use client";
import Button from "../components/button";
import Canvas, { CanvasRef } from "../components/canvas";
import TotalWordsPanel from "./components/totalWordsPanel";
import WordsList from "./components/wordsList";
import AddCustomWordPanel from "./components/addCustomWordPanel";
import { useWordCloudStore } from "../lib/wordCloudStore";
import { generateWordList } from "../lib/wordCloudMethod";
import { FaArrowRotateLeft } from "react-icons/fa6";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CompositionPage() {
  const { article, customWords, composition, setSegmentedWords } =
    useWordCloudStore();
  const [stopwords, setStopwords] = useState<Set<string>>(new Set());
  const router = useRouter();
  const canvasRef = useRef<CanvasRef>(null);

  const handleRegenerateWordCloud = () => {
    canvasRef.current?.regenerate();
  };

  const handleGoNextStep = () => {
    router.push("/style");
  };

  // 讀取停用詞
  useEffect(() => {
    const loadStopwords = async () => {
      const res = await fetch("/stopwords.txt");
      const text = await res.text();
      const list = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      setStopwords(new Set(list));
    };
    loadStopwords();
  }, []);

  // 進行斷詞
  useEffect(() => {
    if (article === "") {
      // TODO 初始化
      return router.push("/");
    }
    if (stopwords.size === 0) return;
    const result = generateWordList(customWords, article, stopwords);
    setSegmentedWords(result);
  }, [article, customWords, stopwords]);

  return (
    <div className="grid grid-cols-4 gap-8 h-[600px]">
      <div className="col-start-1 col-end-4">
        <Canvas ref={canvasRef} />
      </div>
      <div className="grid grid-rows-[auto_100px_1fr_100px_auto] gap-3">
        <Button style="hollow" onClick={handleRegenerateWordCloud}>
          <div className="flex justify-center items-center">
            <FaArrowRotateLeft />
            <div className="pl-2">重新隨機排列詞彙</div>
          </div>
        </Button>
        <TotalWordsPanel />
        <WordsList />
        <AddCustomWordPanel />
        <Button style="solid" onClick={handleGoNextStep}>
          下一步：編輯詞彙樣式
        </Button>
      </div>
    </div>
  );
}
