"use client";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import Button from "./button";
import Link from "next/link";

function IndexHeader() {
  const handleStart = () => {
    const textareaEl = document.getElementById("textarea");
    textareaEl?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <header className="h-[640px] bg-white shadow rounded-b-3xl flex flex-col justify-center mb-10">
      <div className="w-[80%] mx-auto">
        <div className="text-5xl mb-6">製雲</div>
        <div className="text-2xl">三個步驟，</div>
        <div className="text-2xl mb-4">製作精美的繁體中文文字雲。</div>
        <Button style="solid" onClick={handleStart} className="px-8 ">
          馬上開始
        </Button>
      </div>
    </header>
  );
}

function SimpleHeader() {
  return (
    <header
      className={clsx(
        "h-[60px] bg-white shadow flex flex-col justify-center mb-10 fixed top-0 z-30 left-0 right-0",
        "md:hidden",
        "max-sm:text-red max-md:text-yellow-500 max-lg:text-green-500 max-xl:text-blue-500"
        // NOTE text-color width breaker
        // width < 640(max-sm): red
        // 640 <= width < 768(max-md): yellow
        // 768 <= width < 1024(max-lg): green
        // 1024 <= width < 1280(max-xl): blue
        // 1280 <= width: gray
      )}
    >
      <div className="w-[90%] mx-auto text-3xl max-sm:text-2xl">
        <Link href="/">製雲</Link>
      </div>
    </header>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isIndex = pathname === "/";
  if (isIndex) return <IndexHeader />;
  else return <SimpleHeader />;
}
