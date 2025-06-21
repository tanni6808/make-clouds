"use client";
import { usePathname, useRouter } from "next/navigation";
// import Image from "next/image";
import clsx from "clsx";

import Button from "./button";

function IndexHeader() {
  const handleIntro = () => {
    const introEl = document.getElementById("intro");
    introEl?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleStart = () => {
    const textareaEl = document.getElementById("textarea");
    textareaEl?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <header
      className="h-[640px] bg-white shadow rounded-b-3xl flex flex-col justify-center mb-10"
      id="header"
    >
      <div className="w-[80%] mx-auto flex items-center">
        <div className="flex flex-col gap-2">
          <div className="text-5xl mb-6">製雲</div>
          <div className="text-2xl">三個步驟，</div>
          <div className="text-2xl mb-4">製作精美的繁體中文文字雲。</div>
          <div className="flex flex-col gap-2">
            <Button style="hollow" onClick={handleIntro} className="w-40">
              如何使用
            </Button>
            <Button style="solid" onClick={handleStart} className="w-40">
              馬上開始
            </Button>
          </div>
        </div>
        {/* <Image
          src={"/index-wordcloud.png"}
          width={600}
          height={400}
          alt={"文字雲"}
        /> */}
      </div>
    </header>
  );
}

function SimpleHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const handleClick = () => {
    if (pathname === "/about") return router.push("/#header");
    if (confirm("回到首頁將會失去所有編輯進度，是否繼續？"))
      router.push("/#header");
  };
  return (
    <header
      className={clsx(
        "h-[60px] bg-white shadow flex flex-col justify-center mb-10 fixed top-0 z-30 left-0 right-0",
        "md:static md:rounded-b-3xl"
        // "max-sm:text-red max-md:text-yellow-500 max-lg:text-green-500 max-xl:text-blue-500"
        // NOTE text-color width breaker
        // width < 640(max-sm): red
        // 640 <= width < 768(max-md): yellow
        // 768 <= width < 1024(max-lg): green
        // 1024 <= width < 1280(max-xl): blue
        // 1280 <= width: gray
      )}
    >
      <div className="w-[90%] mx-auto text-3xl max-sm:text-2xl flex">
        <div
          onClick={handleClick}
          className="cursor-pointer hover:border-b-4 transition-all"
        >
          製雲
        </div>
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
