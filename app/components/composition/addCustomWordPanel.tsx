import { useWordCloudStore } from "@/app/lib/wordCloudStore";
import { useState } from "react";

export default function AddCustomWordPanel() {
  const [customWord, setCustomWord] = useState<string>("");
  const { addCustomWord } = useWordCloudStore();
  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomWord(customWord);
    setCustomWord("");
  };
  return (
    <form
      className="outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]"
      onSubmit={(e) => handleAddCustomWord(e)}
    >
      <div className="mb-2 text-center">新增詞彙</div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          className="w-[140px] bg-gray-light h-[36px] rounded-md pl-2"
          placeholder="輸入詞彙..."
          value={customWord}
          onChange={(e) => setCustomWord(e.target.value)}
        />
        <button
          type="submit"
          className="grow bg-primary-dark h-[36px] text-white rounded-md hover:bg-primary-light transition"
        >
          +
        </button>
      </div>
    </form>
  );
}
