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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShuffle } from "@fortawesome/free-solid-svg-icons";

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

  useEffect(() => {
    const stepNavEl = document.getElementById("step-nav");
    stepNavEl?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr_100px_100px_auto] gap-3 max-md:grid-rows-[auto_auto_120px_120px]">
      <Button
        style="hollow"
        onClick={triggerRegenerate}
        className="max-md:row-start-2"
      >
        <div className="flex justify-center items-center">
          <FontAwesomeIcon icon={faShuffle} />
          <div className="pl-2">重新隨機排列詞彙</div>
        </div>
      </Button>
      <WordsList className="max-md:row-start-3 max-md:row-end-5" />
      <TotalWordsPanel />
      <AddCustomWordPanel />
      <Button
        style="solid"
        onClick={handleGoNextStep}
        className="max-md:row-start-1"
      >
        下一步：編輯詞彙樣式
      </Button>
    </div>
  );
}
