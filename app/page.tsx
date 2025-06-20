"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Button from "./components/button";
import { useWordCloudStore } from "./lib/useWordCloudStore";

export default function Home() {
  const router = useRouter();
  const { article, setArticle } = useWordCloudStore();
  const handleLoadExample = () => {
    if (article !== "") return setArticle("");
    fetch("/texts/word-cloud.txt")
      .then((res) => res.text())
      .then((text) => setArticle(text));
  };
  const handleSubmitArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (article === "") return alert("請輸入文章，或載入範例文章後再開始。");
    router.push("/composition");
  };
  // 重置文字雲相關設定
  useEffect(() => {
    useWordCloudStore.getState().resetWordCloudCompositionSetting();
  }, []);
  return (
    <form
      className="flex flex-col items-center"
      onSubmit={(e) => handleSubmitArticle(e)}
    >
      <textarea
        id="textarea"
        className="w-[90%] h-[420px] my-4 bg-gray-light p-[50px] rounded-2xl"
        placeholder="在此輸入文章..."
        value={article}
        onChange={(e) => setArticle(e.target.value)}
      ></textarea>
      <div className="flex justify-center gap-6 max-sm:flex-col max-sm:gap-3">
        <Button
          style="hollow"
          onClick={handleLoadExample}
          type="button"
          className="px-8 "
        >
          {article === "" ? "載入範例文章" : "清空輸入區塊"}
        </Button>
        <Button style="solid" className="px-8 ">
          開始製作
        </Button>
      </div>
    </form>
  );
}
