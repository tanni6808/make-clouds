"use client";
import { useWordCloudStore } from "@/app/lib/wordCloudStore";

export default function WordsList() {
  const { segmentedWords, removedWords, selectionCount } = useWordCloudStore();

  const visibleWords = segmentedWords
    .filter((word) => !removedWords.some((r) => r.text === word.text))
    .slice(0, selectionCount);

  return (
    <div className="outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px] grid grid-rows-[auto_320px] row-start-2 row-span-[2]">
      <div className="mb-2 text-center">詞彙庫</div>
      <ul className="overflow-y-auto flex flex-col gap-2">
        {visibleWords.map((word, index) => (
          <li
            key={index}
            className="p-2.5 bg-gray-light rounded-md hover:outline-3 hover: outline-offset-[-3px] flex items-center justify-between text-sm"
          >
            <label className="flex items-center">
              {/* <input
                type="checkbox"
                className="h-5 w-5 outline-4 outline-offset-[-4px]"
              /> */}
              <div className="pl-2">{`${word.text}`}</div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
