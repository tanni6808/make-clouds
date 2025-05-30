import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import Button from "./button";
import { useWordCloudStore } from "../lib/wordCloudStore";
import { generateWordCloud } from "../lib/wordCloudMethod";
import { resetScale, addCanvasInteractions } from "../lib/canvasMethod";

export interface CanvasRef {
  regenerate: () => void;
}

interface CanvasProps {}

function Canvas(props: CanvasProps, ref: React.Ref<CanvasRef>) {
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);

  const {
    segmentedWords,
    removedWords,
    selectionCount,
    composition,
    getSelectedWords,
    setComposition,
  } = useWordCloudStore();

  const handleClickResetCanvas = () => {
    if (!svgRef.current || !groupRef.current) return;
    const svgEl = svgRef.current;
    const groupEl = groupRef.current;
    resetScale(svgEl, groupEl);
  };

  // 畫文字雲
  useEffect(() => {
    if (!svgRef.current || !groupRef.current) return;
    const svgEl = svgRef.current;
    const groupEl = groupRef.current;
    const width = svgEl.clientWidth;
    const height = svgEl.clientHeight;

    if (!width || !height) return;

    const selectedWords = getSelectedWords();
    if (selectedWords.length === 0) return;
    const wordCloudComposition = generateWordCloud(
      selectedWords,
      svgEl,
      groupEl
    );
    resetScale(svgEl, groupEl);
    setComposition(wordCloudComposition);

    addCanvasInteractions(svgEl, groupEl);
    // TODO 只用selectedWord這個狀態控制繪製(可能需要大改🫠)
  }, [segmentedWords, removedWords, selectionCount]);

  // 重畫文字雲
  useImperativeHandle(ref, () => ({
    regenerate: () => {
      if (!svgRef.current || !groupRef.current) return;
      const svgEl = svgRef.current;
      const groupEl = groupRef.current;
      const selectedWords = getSelectedWords();
      const wordCloudComposition = generateWordCloud(
        selectedWords,
        svgEl,
        groupEl
      );
      resetScale(svgEl, groupEl);
      setComposition(wordCloudComposition);
      addCanvasInteractions(svgEl, groupEl);
    },
  }));

  return (
    <div className="h-full outline-4 outline-primary-dark outline-offset-[-4px] rounded-2xl relative">
      <svg ref={svgRef} className="h-full w-full">
        <g ref={groupRef}></g>
      </svg>
      <Button
        style="hollow"
        className="absolute z-10 right-[10px] bottom-[10px]"
        onClick={handleClickResetCanvas}
      >
        重置畫布
      </Button>
    </div>
  );
}

export default forwardRef<CanvasRef, CanvasProps>(Canvas);
