"use client";

import { usePathname } from "next/navigation";

export default function StepNavigation() {
  const pathname = usePathname();
  const handleClick = (e: React.MouseEvent) => {
    console.log(e.target);
  };
  return (
    <div className="flex mb-10">
      <div
        onClick={pathname === "/" ? undefined : (e) => handleClick(e)}
        className={`${
          pathname === "/"
            ? "border-t-[16px]"
            : "border-t-[12px] text-gray-dark"
        } w-1/3 text-center mx-2`}
      >
        輸入文章
      </div>
      <div
        onClick={
          pathname === "/composition" ? undefined : (e) => handleClick(e)
        }
        className={`${
          pathname === "/composition"
            ? "border-t-[16px]"
            : "border-t-[12px] text-gray-dark"
        } w-1/3 text-center mx-2`}
      >
        確認詞彙
      </div>
      <div
        className={`${
          pathname === "/style"
            ? "border-t-[16px]"
            : "border-t-[12px] text-gray-dark"
        } w-1/3 text-center mx-2`}
      >
        編輯詞彙樣式
      </div>
    </div>
  );
}
