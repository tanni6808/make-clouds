"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "../components/button";
import WordsList from "./components/wordsList";
import TotalWordsPanel from "./components/totalWordsPanel";
import AddCustomWordPanel from "./components/addCustomWordPanel";
import { useAlert } from "../contexts/alertContext";
import { useWordCloudStore } from "../lib/useWordCloudStore";
import { useCanvasStore } from "../lib/useCanvasStore";
import { generateWordList } from "../lib/wordCloudMethod";
import { useScrollToWorkspace } from "../lib/hooks";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShuffle } from "@fortawesome/free-solid-svg-icons";

export default function CompositionPage() {
  const { showAlert } = useAlert();
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
    try {
      const result = generateWordList(customWords, article, stopwords);
      setSegmentedWords(result);
    } catch (err: any) {
      showAlert(err.message);
    }
  }, [article, customWords, stopwords]);

  useScrollToWorkspace();

  return (
    <div className="grid grid-rows-[auto_100px_1fr_100px_auto] gap-3 max-md:grid-rows-[auto_auto_120px_1fr_120px]">
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
      <TotalWordsPanel />
      <WordsList />
      <AddCustomWordPanel />
      <Button
        style="solid"
        onClick={handleGoNextStep}
        className="max-md:row-start-1"
      >
        下一步
      </Button>
    </div>
  );
}
