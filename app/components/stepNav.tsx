"use client";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

function Step({
  label,
  active,
  clickable,
  onClick,
}: {
  label: string;
  active?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={clsx(
        "w-1/3 text-center mx-2",
        active ? "border-t-8" : "border-t-4 text-gray-dark",
        clickable
          ? "cursor-pointer hover:text-primary-dark hover:border-t-[10px] transition-[all]"
          : ""
      )}
    >
      {label}
    </div>
  );
}

export default function StepNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const steps = [
    { label: "輸入文章", path: "/" },
    { label: "確認詞彙", path: "/composition" },
    { label: "編輯樣式", path: "/style" },
  ];
  const currentStepIndex = steps.findIndex((s) => s.path === pathname);
  const handleClick = (path: string) => {
    if (confirm("回到之前的步驟將會失去在此步驟做的更動，是否繼續？"))
      router.push(path);
  };
  return (
    <div className="flex mb-10 h-8">
      {steps.map((step, i) => {
        const isPast = i < currentStepIndex;
        const isCurrent = i === currentStepIndex;
        // const isFuture = i > currentStepIndex;
        return (
          <Step
            key={i}
            label={step.label}
            active={isCurrent}
            clickable={isPast}
            onClick={isPast ? () => handleClick(step.path) : undefined}
          />
        );
      })}
    </div>
  );
}

// <div className="flex mb-10">
//   <div
//     onClick={pathname === "/" ? undefined : (e) => handleClick(e)}
//     className={`${
//       pathname === "/"
//         ? "border-t-[16px]"
//         : "border-t-[12px] text-gray-dark"
//     } w-1/3 text-center mx-2`}
//   >
//     輸入文章
//   </div>
//   <div
//     onClick={
//       pathname === "/composition" ? undefined : (e) => handleClick(e)
//     }
//     className={`${
//       pathname === "/composition"
//         ? "border-t-[16px]"
//         : "border-t-[12px] text-gray-dark"
//     } w-1/3 text-center mx-2`}
//   >
//     確認詞彙
//   </div>
//   <div
//     className={`${
//       pathname === "/style"
//         ? "border-t-[16px]"
//         : "border-t-[12px] text-gray-dark"
//     } w-1/3 text-center mx-2`}
//   >
//     編輯詞彙樣式
//   </div>
// </div>
