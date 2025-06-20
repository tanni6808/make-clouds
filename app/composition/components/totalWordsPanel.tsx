import clsx from "clsx";

import { useWordCloudStore } from "@/app/lib/useWordCloudStore";

function LittleBtn({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="h-[32px] w-[32px] bg-primary-dark hover:bg-primary-light text-white rounded disabled:bg-gray-dark max-md:h-[40px] max-md:w-[40px]"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default function TotalWordsPanel({ className }: { className?: string }) {
  const {
    selectionCount,
    incrementSelectionCount,
    decrementSelectionCount,
    segmentedWords,
    removedWords,
  } = useWordCloudStore();
  const availableCount = segmentedWords.filter(
    (w) => !removedWords.some((r) => r.text === w.text)
  ).length;

  const maxSelectableCount = Math.min(100, availableCount);
  return (
    <div
      className={clsx(
        "outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]",
        className
      )}
    >
      <div className="mb-2 text-center">詞彙數量</div>
      <div className="flex items-center justify-center max-md:text-lg">
        <div className="flex gap-2">
          <LittleBtn
            onClick={() => decrementSelectionCount(10)}
            disabled={selectionCount <= 10}
          >
            -10
          </LittleBtn>
          <LittleBtn
            onClick={() => decrementSelectionCount(1)}
            disabled={selectionCount <= 10}
          >
            -1
          </LittleBtn>
        </div>
        <div className="text-xl px-2 w-12 text-center">{selectionCount}</div>
        <div className="flex gap-2">
          <LittleBtn
            onClick={() => incrementSelectionCount(1)}
            disabled={selectionCount >= maxSelectableCount}
          >
            +1
          </LittleBtn>
          <LittleBtn
            onClick={() => incrementSelectionCount(10)}
            disabled={selectionCount >= maxSelectableCount}
          >
            +10
          </LittleBtn>
        </div>
      </div>
    </div>
  );
}
