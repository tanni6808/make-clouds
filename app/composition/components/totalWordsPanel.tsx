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
      className="h-[32px] w-[32px] bg-primary-dark hover:bg-primary-light text-white rounded disabled:bg-gray-dark"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default function TotalWordsPanel() {
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
    <div className="outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]">
      <div className="mb-2 text-center">詞彙數量</div>
      <div className="flex items-center justify-between">
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
        <div className="text-xl px-2">{selectionCount}</div>
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
