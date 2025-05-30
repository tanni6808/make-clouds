"use client";
import Button from "../components/button";
import Canvas, { CanvasRef } from "../components/canvas";
import { useWordCloudStore } from "../lib/wordCloudStore";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const canvasRef = useRef<CanvasRef>(null);
  const handleRegenerateWordCloud = () => {
    canvasRef.current?.regenerate();
  };

  return (
    <div className="grid grid-cols-4 gap-8 h-[600px]">
      <div className="col-start-1 col-end-4">
        <Canvas ref={canvasRef} />
      </div>
      <div className="grid grid-rows-[auto_100px_1fr_100px_auto] gap-3">
        <Button style="hollow">重新隨機排列詞彙</Button>
        <div className="">測</div>
        <div className="">試</div>
        <div className="">的</div>
        <Button style="solid">下一步：編輯詞彙樣式</Button>
      </div>
    </div>
  );
}
