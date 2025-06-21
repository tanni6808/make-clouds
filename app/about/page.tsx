import Link from "next/link";
export default function AboutPage() {
  return (
    <div className="min-h-[75vh] px-10 mt-10">
      <div className="py-10 text-2xl">關於本網站</div>
      <div className="">
        <div className="flex flex-wrap">
          <div className="">本網站使用</div>
          <Link
            href={"https://react.dev/"}
            target="_blank"
            className="h-6 border-b-2 hover:border-b-4 transition-all cursor-pointer"
          >
            React
          </Link>
          <div className="">、</div>
          <div className="h-6 border-b-2 hover:border-b-4 transition-all cursor-pointer">
            Next.js
          </div>
          <div className="">、</div>
          <div className="h-6 border-b-2 hover:border-b-4 transition-all cursor-pointer">
            Tailwind CSS
          </div>
          <div className="">與下列資源：</div>
        </div>
        <div className="flex flex-col gap-3 py-5">
          <div className="flex">
            <div className="w-25 text-right">停用詞：</div>
            <Link
              href={"https://github.com/goto456/stopwords"}
              target="_blank"
              className="border-b-2 hover:border-b-4 transition-all cursor-pointer h-6"
            >
              goto456/stopwords
            </Link>
          </div>
          <div className="flex">
            <div className="w-25 text-right">圖示：</div>
            <Link
              href={"https://fontawesome.com/license/free"}
              target="_blank"
              className="border-b-2 hover:border-b-4 transition-all cursor-pointer h-6"
            >
              Font Awesome Free
            </Link>
          </div>
          <div className="flex">
            <div className="w-25 text-right">配色方案：</div>
            <Link
              href={"https://github.com/joshbeckman/thecolorapi"}
              target="_blank"
              className="border-b-2 hover:border-b-4 transition-all cursor-pointer h-6"
            >
              The Color API
            </Link>
          </div>
          <div className="flex">
            <div className="w-25 text-right">網頁字型：</div>
            <Link
              href={
                "https://fonts.google.com/noto/specimen/Noto+Sans+TC/license?preview.layout=grid&query=Noto+sans+TC"
              }
              target="_blank"
              className="border-b-2 hover:border-b-4 transition-all cursor-pointer h-6"
            >
              思源黑體
            </Link>
          </div>
          <div className="flex">
            <div className="w-25 text-right">樣式字型：</div>
            <div className="flex flex-col items-start">
              <Link
                href={
                  "https://fonts.google.com/noto/specimen/Noto+Sans+TC/license?preview.layout=grid&query=Noto+sans+TC"
                }
                target="_blank"
                className="border-b-2 hover:border-b-4 transition-all cursor-pointer h-6"
              >
                思源黑體
              </Link>
              <Link
                href={
                  "https://fonts.google.com/noto/specimen/Noto+Serif+TC/license?preview.layout=grid&query=noto+serif+TC"
                }
                target="_blank"
                className="border-b-2 hover:border-b-4 transition-all cursor-pointer h-6"
              >
                思源宋體
              </Link>
              <Link
                href={
                  "https://fonts.google.com/specimen/Chocolate+Classical+Sans/license?preview.layout=grid"
                }
                target="_blank"
                className="border-b-2 hover:border-b-4 transition-all cursor-pointer h-6"
              >
                朱古力黑體
              </Link>
              <Link
                href={
                  "https://fonts.google.com/specimen/LXGW+WenKai+TC/license?preview.layout=grid&query=LXGW"
                }
                target="_blank"
                className="border-b-2 hover:border-b-4 transition-all cursor-pointer h-6"
              >
                霞鶩文楷
              </Link>
              <Link
                href={
                  "https://fonts.google.com/specimen/Cactus+Classical+Serif/license?preview.layout=grid&lang=zh_Hant"
                }
                target="_blank"
                className="border-b-2 hover:border-b-4 transition-all cursor-pointer h-6"
              >
                仙人掌明體
              </Link>
            </div>
          </div>
          <div className="flex">
            <div className="w-25 text-right">狀態管理：</div>
            <Link
              href={"https://github.com/pmndrs/zustand"}
              target="_blank"
              className="border-b-2 hover:border-b-4 transition-all cursor-pointer h-6"
            >
              Zustand
            </Link>
          </div>
          <div className="flex flex-wrap">
            <div className="">以及</div>
            <Link
              href={"https://github.com/casesandberg/react-color"}
              target="_blank"
              className="border-b-2 hover:border-b-4 transition-all cursor-pointer h-6"
            >
              react-color
            </Link>
            <div className="">、</div>
            <Link
              href={"https://github.com/lukeed/clsx"}
              target="_blank"
              className="border-b-2 hover:border-b-4 transition-all cursor-pointer h-6"
            >
              clsx
            </Link>
            <div className="">、</div>
            <Link
              href={"https://github.com/ai/nanoid"}
              target="_blank"
              className="border-b-2 hover:border-b-4 transition-all cursor-pointer h-6"
            >
              nanoid
            </Link>
            <div className="">等套件製作。</div>
          </div>
        </div>
        <div className="">感謝以上專案的作者與社群的貢獻。</div>
      </div>
    </div>
  );
}
