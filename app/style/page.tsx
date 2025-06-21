"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Button from "../components/button";
import TabSwitcher from "../components/tabSwitcher";
import GlobalEditPanel from "./components/globalEditPanel";
import SingleEditPanel from "./components/singleEditPanel";
import DownloadFilePanel from "./components/downloadFilePanel";
import { useWordCloudStore } from "../lib/useWordCloudStore";
import { useCanvasStore } from "../lib/useCanvasStore";
import { useScrollToWorkspace } from "../lib/hooks";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShuffle } from "@fortawesome/free-solid-svg-icons";

export default function StylePage() {
  const router = useRouter();
  const triggerRegenerate = useCanvasStore((s) => s.triggerRegenerate);
  const composition = useWordCloudStore((s) => s.composition);
  const {
    textColorPalette,
    schemeMode,
    setColorSchemes,
    selectedWord,
    setSelectedWord,
  } = useWordCloudStore();
  const [currentEditTab, setCurrentEditTab] = useState<string>("global");

  const handelChangeEditTab = (value: string) => {
    setCurrentEditTab(value);
  };

  useEffect(() => {
    if (composition.length === 0) return router.push("/");
  }, []);

  useEffect(() => {
    if (textColorPalette.length === 0) return;

    const fetchColorSchemes = async () => {
      const schemeAndCount = [
        { scheme: "monochrome", count: "3" },
        { scheme: "analogic", count: "3" },
        { scheme: "complement", count: "2" },
        { scheme: "triad", count: "3" },
        { scheme: "quad", count: "4" },
      ];
      const hex = textColorPalette[0].color.replace("#", "");
      const results = await Promise.all(
        schemeAndCount.map(({ scheme, count }) =>
          fetch(
            `https://www.thecolorapi.com/scheme?hex=${hex}&format=json&mode=${scheme}&count=${count}`
          ).then((res) => res.json())
        )
      );

      const allColorSchemes = results.map((result) => ({
        mode: result.mode,
        colors: result.colors.map(
          (color: { hex: { value: any } }) => color.hex.value
        ),
      }));

      setColorSchemes(allColorSchemes);
    };

    fetchColorSchemes();
  }, [textColorPalette, schemeMode]);

  useEffect(() => {
    if (selectedWord) {
      setCurrentEditTab("single");
    }
  }, [selectedWord]);
  useEffect(() => {
    setSelectedWord(null);
    setCurrentEditTab("global");
  }, []);

  useScrollToWorkspace();

  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] gap-3 max-md:grid-rows-[auto_auto_auto_1fr]">
      <Button style="hollow" onClick={triggerRegenerate}>
        <div className="flex justify-center items-center">
          <FontAwesomeIcon icon={faShuffle} />
          <div className="pl-2">重新隨機排列詞彙</div>
        </div>
      </Button>
      <TabSwitcher
        tabs={[
          { label: "整體樣式", value: "global" },
          { label: "個別樣式", value: "single" },
        ]}
        current={currentEditTab}
        onChange={handelChangeEditTab}
        className="px-5"
      />
      {currentEditTab === "global" && <GlobalEditPanel />}
      {currentEditTab === "single" && <SingleEditPanel />}
      <DownloadFilePanel className="max-md:row-start-1" />
    </div>
  );
}
