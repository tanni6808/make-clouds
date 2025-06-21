import Image from "next/image";

import Button from "./button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

export default function Intro() {
  const handleStart = () => {
    const textareaEl = document.getElementById("textarea");
    textareaEl?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <div className="bg-white rounded-3xl shadow mb-10 md:mt-6 py-20" id="intro">
      <div className="">
        <div className="text-xl border-l-4 pl-3">一、輸入文章</div>
        <div className="py-12 flex justify-center items-center max-md:flex-col">
          <div className="">
            <Image
              src={"/1_input-article.png"}
              width={200}
              height={150}
              alt="輸入文章"
            />
          </div>
          <div className="w-60 text-center">提供您想轉換成文字雲的文章。</div>
        </div>
      </div>
      <div className="">
        <div className="text-xl border-l-4 pl-3">二、調整詞彙</div>
        <div className="flex justify-center  max-md:flex-col">
          <div className="py-12 flex justify-center items-center max-md:flex-col">
            <div className="flex flex-col">
              <Image
                src={"/2_add-custom-words-1.png"}
                width={200}
                height={150}
                alt="加入詞彙"
              />
              <FontAwesomeIcon icon={faArrowDown} />
              <Image
                src={"/2_add-custom-words-2.png"}
                width={200}
                height={150}
                alt="加入詞彙"
              />
            </div>
            <div className="w-60 text-center">訂正未被正確切割的詞彙。</div>
          </div>
          <div className="py-12 flex justify-center items-center max-md:flex-col">
            <div className="flex flex-col">
              <Image
                src={"/2_delete-words-1.png"}
                width={200}
                height={150}
                alt="刪除詞彙"
              />
              <FontAwesomeIcon icon={faArrowDown} />
              <Image
                src={"/2_delete-words-2.png"}
                width={200}
                height={150}
                alt="刪除詞彙"
              />
            </div>
            <div className="w-60 text-center">刪除您不希望出現的詞彙。</div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="text-xl border-l-4 pl-3">三、編輯樣式</div>
        <div className="py-12 flex justify-center items-center max-md:flex-col">
          <div className="flex flex-col">
            <Image
              src={"/3_edit-style-1.png"}
              width={200}
              height={150}
              alt="編輯樣式"
            />
            <FontAwesomeIcon icon={faArrowDown} />
            <Image
              src={"/3_edit-style-2.png"}
              width={200}
              height={150}
              alt="編輯樣式"
            />
          </div>
          <div className="w-60 text-center">編輯詞彙的字型、顏色及陰影。</div>
        </div>
      </div>
      <div className="flex justify-center">
        <Button style="solid" onClick={handleStart} className="px-8 ">
          馬上開始
        </Button>
      </div>
    </div>
  );
}
