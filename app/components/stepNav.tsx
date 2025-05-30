"use client";

import { usePathname } from "next/navigation";

export default function StepNavigation() {
  const pathname = usePathname();
  return (
    <div className="flex mb-10">
      <div
        className={`${
          pathname === "/" ? "border-t-8" : "border-t-4 text-gray-dark"
        } w-1/3 text-center mx-2`}
      >
        輸入文章
      </div>
      <div
        className={`${
          pathname === "/composition"
            ? "border-t-8"
            : "border-t-4 text-gray-dark"
        } w-1/3 text-center mx-2`}
      >
        確認詞彙
      </div>
      <div
        className={`${
          pathname === "/style" ? "border-t-8" : "border-t-4 text-gray-dark"
        } w-1/3 text-center mx-2`}
      >
        編輯詞彙樣式
      </div>
    </div>
  );
}
