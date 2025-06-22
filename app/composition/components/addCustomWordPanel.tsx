import { useState } from "react";
import clsx from "clsx";

import { useWordCloudStore } from "@/app/lib/useWordCloudStore";

export default function AddCustomWordPanel({
  className,
}: {
  className?: string;
}) {
  const [customWord, setCustomWord] = useState<string>("");
  const { addCustomWord } = useWordCloudStore();
  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomWord(customWord);
    setCustomWord("");
  };
  return (
    <form
      className={clsx(
        "outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]",
        className
      )}
      onSubmit={(e) => handleAddCustomWord(e)}
    >
      <div className="mb-2 text-center">訂正詞彙</div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          className="w-[70%] bg-gray-light h-[36px] rounded-md pl-2"
          placeholder="輸入詞彙..."
          value={customWord}
          onChange={(e) => setCustomWord(e.target.value)}
        />
        <button
          type="submit"
          className="grow bg-primary-dark h-[36px] text-white rounded-md hover:bg-primary-light transition"
        >
          新增
        </button>
      </div>
    </form>
  );
}
