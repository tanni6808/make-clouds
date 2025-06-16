import SingleWordEditor from "./singleWordEditor";
import { useWordCloudStore } from "@/app/lib/wordCloudStore";

export default function SingleEditPanel() {
  const { segmentedWords, removedWords, selectionCount } = useWordCloudStore();

  const visibleWords = segmentedWords
    .filter((word) => !removedWords.some((r) => r.text === word.text))
    .slice(0, selectionCount);

  return (
    <div className="outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]">
      <div className="overflow-y-auto flex flex-col gap-2 h-[414px]">
        {visibleWords.map((word, index) => (
          <SingleWordEditor text={word.text} key={index} />
        ))}
      </div>
    </div>
  );
}
