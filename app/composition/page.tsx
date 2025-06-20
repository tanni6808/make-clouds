"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "../components/button";
import WordsList from "./components/wordsList";
import TotalWordsPanel from "./components/totalWordsPanel";
import AddCustomWordPanel from "./components/addCustomWordPanel";
import { useWordCloudStore } from "../lib/useWordCloudStore";
import { useCanvasStore } from "../lib/useCanvasStore";
import { generateWordList } from "../lib/wordCloudMethod";

import { FaArrowRotateLeft } from "react-icons/fa6";

export default function CompositionPage() {
  const { article, customWords, setSegmentedWords } = useWordCloudStore();
  const [stopwords, setStopwords] = useState<Set<string>>(new Set());
  const router = useRouter();
  const triggerRegenerate = useCanvasStore((s) => s.triggerRegenerate);

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
    if (article === "") return router.push("/");
    if (stopwords.size === 0) return;
    const result = generateWordList(customWords, article, stopwords);
    setSegmentedWords(result);
  }, [article, customWords, stopwords]);

  return (
    <div className="grid grid-rows-[auto_100px_1fr_100px_auto] gap-3 max-md:grid-cols-2 max-md:grid-rows-[44px_44px_120px_120px]">
      <Button
        style="hollow"
        onClick={triggerRegenerate}
        className="max-md:col-start-1 max-md:col-end-3 max-md:row-start-2"
      >
        <div className="flex justify-center items-center">
          <FaArrowRotateLeft />
          <div className="pl-2">重新隨機排列詞彙</div>
        </div>
      </Button>
      <TotalWordsPanel />
      <WordsList className="max-md:row-start-3 max-md:row-end-5" />
      <AddCustomWordPanel />
      <Button
        style="solid"
        onClick={handleGoNextStep}
        className="max-md:col-start-1 max-md:col-end-3 max-md:row-start-1"
      >
        下一步：編輯詞彙樣式
      </Button>
    </div>
  );
}
