"use client";
import { useWordCloudStore } from "@/app/lib/useWordCloudStore";
import { useEffect, useRef } from "react";

export default function WordsList() {
  const {
    segmentedWords,
    removedWords,
    excludeWord,
    restoreWord,
    removeCustomWord,
    selectionCount,
    selectedWord,
  } = useWordCloudStore();
  const handleRemoveCustomWord = (word: string) => {
    removeCustomWord(word);
  };

  const listRef = useRef<HTMLUListElement | null>(null);
  const visibleWords = segmentedWords.filter(
    (word) => !removedWords.some((r) => r.text === word.text)
  );

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
    <div className="outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px] grid grid-rows-[auto_210px]">
      <div className="mb-2 text-center">詞彙庫</div>
      <ul className="overflow-y-auto flex flex-col gap-2" ref={listRef}>
        {visibleWords.map((word, index) => (
          <li
            key={index}
            className={`p-2.5 bg-gray-light rounded-md hover:outline-3 hover: outline-offset-[-3px] flex items-center justify-between text-sm ${
              word.text === selectedWord ? "bg-yellow-100" : ""
            }`}
            data-word={word.text}
          >
            <label
              className={`${
                index >= selectionCount ? "text-gray-dark" : ""
              } flex items-center`}
            >
              {/* <input
                type="checkbox"
                className="h-5 w-5 outline-4 outline-offset-[-4px]"
              /> */}
              <div className="pl-2">{`${word.text}(${word.count}次)`}</div>
            </label>
            <button
              className={`${
                index >= selectionCount ? "hidden" : ""
              } outline-3 outline-red text-red outline-offset-[-1px] rounded-md px-1 hover:bg-red hover:text-white transition`}
              onClick={() => {
                word.isCustom
                  ? handleRemoveCustomWord(word.text)
                  : excludeWord(word);
              }}
            >
              {`${word.isCustom ? "刪除" : "移除"}`}
            </button>
          </li>
        ))}
        {removedWords.length > 0 && (
          <li className="mt-2 border-t pt-2 text-sm text-gray-dark">
            <div className="mb-1">已移除的詞彙：</div>
            <ul className="flex flex-col gap-1">
              {removedWords.map((word, index) => (
                <li
                  key={`removed-${index}`}
                  className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded"
                >
                  <span>{`${word.text}(${word.count}次)`}</span>
                  <button
                    className="text-blue hover:underline text-sm"
                    onClick={() => restoreWord(word)}
                  >
                    復原
                  </button>
                </li>
              ))}
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
}
