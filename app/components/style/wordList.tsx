"use client";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import { FiPlusCircle } from "react-icons/fi";
import { IndividualFontPanel } from "./fontPanel";
import { useWordCloudStore } from "@/app/lib/wordCloudStore";

import { useState, useEffect } from "react";

function WordsListItem({ text }: { text: string }) {
  const defaultStyle = useWordCloudStore((s) => s.defaultFontStyle);
  const globalFontStyle = useWordCloudStore((s) => s.globalFontStyle);
  const fontStyle = useWordCloudStore((s) => s.fontStyleMap[text]);
  const setFontStyle = useWordCloudStore((s) => s.setIndividualFontStyle);

  const currentStyle = { ...defaultStyle, ...globalFontStyle, ...fontStyle };

  const [showWord, setshowWord] = useState<boolean>(true);
  const [showEditPanel, setShowEditPanel] = useState<boolean>(false);
  const [addFontEditor, setAddFontEditor] = useState<boolean>(
    fontStyle ? true : false
  );
  const [addColorEditor, setAddColorEditor] = useState<boolean>(false);
  const [addShadowEditor, setAddShadowEditor] = useState<boolean>(false);

  useEffect(() => {
    if (!fontStyle) setAddFontEditor(false);
  }, [fontStyle]);

  return (
    <div className="">
      <div
        className={`${
          showEditPanel ? "bg-gray-light" : "bg-gray-md"
        } p-2.5 rounded-md hover:bg-gray-dark flex items-center justify-between`}
        onClick={() => setShowEditPanel((s) => !s)}
      >
        <div className="flex items-center">
          {showEditPanel ? <TbTriangleFilled /> : <TbTriangleInvertedFilled />}
          <div className="pl-2">{text}</div>
        </div>
        {showWord ? (
          <IoMdEye
            className="text-xl hover:text-primary-light active:text-black"
            onClick={(e) => {
              e.stopPropagation();
              setshowWord((s) => !s);
            }}
          />
        ) : (
          <IoMdEyeOff
            className="text-xl hover:text-primary-light active:text-black"
            onClick={(e) => {
              e.stopPropagation();
              setshowWord((s) => !s);
            }}
          />
        )}
      </div>
      {showEditPanel && (
        <div className="bg-gray-light mt-1 rounded p-[10px]">
          {addFontEditor && <IndividualFontPanel text={text} />}
          {!addFontEditor && (
            <div
              className="my-1 bg-white rounded-lg px-2 py-1 flex items-center border-dashed border-1 hover:text-primary-light cursor-pointer"
              onClick={() => {
                setFontStyle(text, { ...currentStyle });
                setAddFontEditor((s) => !s);
                setTimeout(() => {
                  console.log(currentStyle);
                }, 1000);
              }}
            >
              <FiPlusCircle />
              <div className="text-sm ml-2">編輯字型</div>
            </div>
          )}

          <div className="my-1 bg-white rounded-lg px-2 py-1 flex items-center border-dashed border-1 hover:text-primary-light cursor-pointer">
            <FiPlusCircle />
            <div className="text-sm ml-2">編輯文字顏色</div>
          </div>
          <div className="my-1 bg-white rounded-lg px-2 py-1 flex items-center border-dashed border-1 hover:text-primary-light cursor-pointer">
            <FiPlusCircle />
            <div className="text-sm ml-2">編輯文字陰影</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WordsList() {
  const { segmentedWords, removedWords, selectionCount } = useWordCloudStore();

  const visibleWords = segmentedWords
    .filter((word) => !removedWords.some((r) => r.text === word.text))
    .slice(0, selectionCount);

  return (
    <div className="outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]">
      <div className="overflow-y-auto flex flex-col gap-2 h-[414px]">
        {visibleWords.map((word, index) => (
          <WordsListItem text={word.text} key={index} />
        ))}
      </div>
    </div>
  );
}
