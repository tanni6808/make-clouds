"use client";
import { usePathname } from "next/navigation";
import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Transform, WordComposition } from "../lib/definitions";
import Button from "./button";
import { useWordCloudStore } from "../lib/wordCloudStore";
import { generateWordCloud } from "../lib/wordCloudMethod";

export interface CanvasRef {
  regenerate: () => void;
  getSvgRef: () => SVGSVGElement | null;
  getWordComposition: () => WordComposition[];
}

interface CanvasProps {}

function Canvas(_: CanvasProps, ref: React.Ref<CanvasRef>) {
  const pathname = usePathname();
  const shouldGenerate = pathname === "/composition";

  // States for canvas manipulating
  const [canvasTransform, setCanvasTransform] = useState<Transform>({
    translateX: 0,
    translateY: 0,
    scale: 1,
  });
  const [dragState, setDragState] = useState<{
    index: number | null;
    offsetX: number;
    offsetY: number;
  }>({
    index: null,
    offsetX: 0,
    offsetY: 0,
  });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // States for word cloud drawing
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);

  // Status for styles
  const fontStyleMap = useWordCloudStore((s) => s.fontStyleMap);
  const defaultFontStyle = useWordCloudStore((s) => s.defaultFontStyle);

  // Word cloud store
  const {
    segmentedWords,
    removedWords,
    selectionCount,
    composition,
    getSelectedWords,
    setComposition,
  } = useWordCloudStore();

  // Methods
  function resetCanvasPosition(animation = true) {
    if (!svgRef.current || !groupRef.current) return;
    const svg = svgRef.current;
    const group = groupRef.current;
    const bbox = group.getBBox();
    const { width: svgWidth, height: svgHeight } = svg.getBoundingClientRect();

    const scaleX = svgWidth / bbox.width;
    const scaleY = svgHeight / bbox.height;
    const scale = Math.min(scaleX, scaleY) * 0.8;
    const translateX = svgWidth / 2 - (bbox.x + bbox.width / 2) * scale;
    const translateY = svgHeight / 2 - (bbox.y + bbox.height / 2) * scale;

    const to = { scale, translateX, translateY };

    if (animation) {
      animateCanvasTransform(canvasTransform, to);
    } else {
      setCanvasTransform(to);
    }
  }

  function animateCanvasTransform(
    from: Transform,
    to: Transform,
    duration = 400
  ) {
    const start = performance.now();

    function frame(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic

      setCanvasTransform({
        scale: from.scale + (to.scale - from.scale) * ease,
        translateX: from.translateX + (to.translateX - from.translateX) * ease,
        translateY: from.translateY + (to.translateY - from.translateY) * ease,
      });

      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function getMousePosition(event: React.MouseEvent | MouseEvent) {
    const CTM = groupRef.current!.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    const mouseX = (event.clientX - CTM.e) / CTM.a;
    const mouseY = (event.clientY - CTM.f) / CTM.d;
    return { x: mouseX, y: mouseY };
  }

  // Mouse event handlers
  const handleTextMouseDown = (
    event: React.MouseEvent<SVGTextElement>,
    index: number
  ) => {
    const mousePosition = getMousePosition(event);

    const word = composition[index];
    setDragState({
      index,
      offsetX: mousePosition.x - word.x,
      offsetY: mousePosition.y - word.y,
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const isMiddleClick = e.button === 1;
    const isLeftClick = e.button === 0;

    if (isMiddleClick || (isLeftClick && e.target instanceof SVGSVGElement)) {
      e.preventDefault();
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY };
      return;
    }
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (dragState.index !== null) {
      event.preventDefault();
      const mousePosition = getMousePosition(event);
      const newX = mousePosition.x - dragState.offsetX;
      const newY = mousePosition.y - dragState.offsetY;

      const updated = composition.map((word, i) =>
        i === dragState.index ? { ...word, x: newX, y: newY } : word
      );

      setComposition(updated);
    }
    if (isPanning) {
      const dx = event.clientX - panStart.current.x;
      const dy = event.clientY - panStart.current.y;

      setCanvasTransform((prev) => ({
        ...prev,
        translateX: prev.translateX + dx,
        translateY: prev.translateY + dy,
      }));

      panStart.current = { x: event.clientX, y: event.clientY };
    }
  };

  const handleMouseUp = () => {
    // if (dragState.index !== null) {
    //   // for undo/redo
    // }
    setDragState({ index: null, offsetX: 0, offsetY: 0 });
    setIsPanning(false);
  };

  // Zoom in/out
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (!groupRef.current || !svgRef.current) return;
    const svg = svgRef.current;

    setCanvasTransform((prev) => {
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = prev.scale * zoomFactor;

      const svgRect = svg.getBoundingClientRect();
      const mouseX = e.clientX - svgRect.left;
      const mouseY = e.clientY - svgRect.top;

      const { x: svgX, y: svgY } = getMousePosition(e);

      const newTranslateX = mouseX - svgX * newScale;
      const newTranslateY = mouseY - svgY * newScale;

      return {
        scale: newScale,
        translateX: newTranslateX,
        translateY: newTranslateY,
      };
    });
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      svg.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // 畫文字雲
  useEffect(() => {
    if (!shouldGenerate) return; //resetCanvasPosition();
    if (!svgRef.current || !groupRef.current) return;
    const svgEl = svgRef.current;
    const width = svgEl.clientWidth;
    const height = svgEl.clientHeight;

    if (!width || !height) return;

    const selectedWords = getSelectedWords();
    if (selectedWords.length === 0) return;
    const wordCloudComposition = generateWordCloud(selectedWords, svgEl);
    setComposition(wordCloudComposition);

    requestAnimationFrame(() => {
      resetCanvasPosition();
    });
    // TODO 只用selectedWord這個狀態控制繪製(可能需要大改🫠)
  }, [segmentedWords, removedWords, selectionCount]);

  // 重畫文字雲
  useImperativeHandle(ref, () => ({
    regenerate: () => {
      if (!svgRef.current || !groupRef.current) return;
      const svgEl = svgRef.current;
      const selectedWords = getSelectedWords();
      const wordCloudComposition = generateWordCloud(selectedWords, svgEl);
      setComposition(wordCloudComposition);
      requestAnimationFrame(() => {
        resetCanvasPosition();
      });
    },
    getSvgRef: () => svgRef.current,
    getWordComposition: () => composition,
  }));

  return (
    <div className="h-full outline-4 outline-primary-dark outline-offset-[-4px] rounded-2xl relative">
      <svg
        ref={svgRef}
        className="h-full w-full"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        // onWheel={handleWheel}
        style={{ cursor: "move" }}
      >
        <g
          ref={groupRef}
          transform={`translate(${canvasTransform.translateX}, ${canvasTransform.translateY}) scale(${canvasTransform.scale})`}
        >
          {composition.map((word, index) => {
            const fontStyle = fontStyleMap[word.text] ?? defaultFontStyle;
            return (
              <text
                key={index}
                x={word.x}
                y={word.y}
                fontSize={word.fontSize}
                fontFamily={fontStyle.fontFamily}
                fontStyle={fontStyle.italic ? "italic" : "normal"}
                style={{
                  textShadow: fontStyle.shadow
                    ? "2px 2px 5px rgba(0,0,0,0.5)"
                    : "",
                }}
                textDecoration={fontStyle.underline ? "underline" : "none"}
                fill="#545454"
                fontWeight={fontStyle.fontWeight}
                onMouseDown={(e) => {
                  handleTextMouseDown(e, index);
                }}
                className={`${
                  dragState.index ? "cursor-grabbing" : "cursor-grab"
                }`}
              >
                {word.text}
              </text>
            );
          })}
        </g>
      </svg>
      <Button
        style="hollow"
        className="absolute z-10 right-[10px] bottom-[10px] px-4 "
        onClick={() => resetCanvasPosition(true)}
      >
        重置畫布縮放
      </Button>
    </div>
  );
}

export default forwardRef<CanvasRef, CanvasProps>(Canvas);
