"use client";
import Button from "./button";
import Link from "next/link";
import { usePathname } from "next/navigation";

function IndexHeader() {
  const handleStart = () => {
    const textareaEl = document.getElementById("textarea");
    textareaEl?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <header className="h-[640px] bg-white shadow rounded-b-3xl flex flex-col justify-center mb-10">
      <div className="w-[1000px] mx-auto ">
        <div className="text-5xl mb-6">製雲</div>
        <div className="text-2xl">三個步驟，</div>
        <div className="text-2xl mb-4">製作精美的繁體中文文字雲。</div>
        <Button style="solid" onClick={handleStart}>
          馬上開始
        </Button>
      </div>
    </header>
  );
}

function SimpleHeader() {
  return (
    <header className="h-[60px] bg-white shadow rounded-b-3xl flex flex-col justify-center mb-10">
      <div className="w-[1000px] mx-auto text-3xl">
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
