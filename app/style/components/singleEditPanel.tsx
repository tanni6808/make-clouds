"use client";
import SingleWordEditor from "./singleWordEditor";
import { useEffect, useRef } from "react";
import { useWordCloudStore } from "@/app/lib/useWordCloudStore";

export default function SingleEditPanel() {
  const { segmentedWords, removedWords, selectionCount, selectedWord } =
    useWordCloudStore();
  const listRef = useRef<HTMLDivElement | null>(null);

  const visibleWords = segmentedWords
    .filter((word) => !removedWords.some((r) => r.text === word.text))
    .slice(0, selectionCount);

  useEffect(() => {
    if (selectedWord && listRef.current) {
      const container = listRef.current;
      const el = document.querySelector(`[data-word="${selectedWord}"]`);
      if (el) {
        const containerTop = container.getBoundingClientRect().top;
        const elTop = el.getBoundingClientRect().top;
        const scrollOffeset =
          elTop -
          containerTop -
          container.clientHeight / 2 +
          el.clientHeight / 2;

        container.scrollBy({ top: scrollOffeset, behavior: "smooth" });
      }
    }
  }, [selectedWord]);

  return (
    <div className="outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]">
      <div
        className="overflow-y-auto flex flex-col gap-2 h-[414px]"
        ref={listRef}
      >
        {visibleWords.map((word, index) => (
          <SingleWordEditor text={word.text} key={index} />
        ))}
      </div>
    </div>
  );
}
