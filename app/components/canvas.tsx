"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import Button from "./button";
import { SegmentedWord, Transform } from "../lib/definitions";
import { generateWordCloud } from "../lib/wordCloudMethod";
import { useWordCloudStore } from "../lib/useWordCloudStore";
import { useCanvasStore } from "../lib/useCanvasStore";
import ColorPicker from "./colorPicker";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompress } from "@fortawesome/free-solid-svg-icons";

export default function Canvas() {
  const pathname = usePathname();

  //SEC useCanvasStore
  const svgRef = useRef<SVGSVGElement | null>(null);
  const setCanvasSVGRef = useCanvasStore((s) => s.setCanvasSVGRef);
  const groupRef = useRef<SVGGElement | null>(null);
  const setCanvasGRef = useCanvasStore((s) => s.setCanvasGRef);
  const canvasColor = useCanvasStore((s) => s.canvasColor);
  const setCanvasColor = useCanvasStore((s) => s.setCanvasColor);
  const setTriggerRegenerate = useCanvasStore((s) => s.setTriggerRegenerate);
  const setDownloadSVG = useCanvasStore((s) => s.setDownloadSVG);
  const setDownloadPNG = useCanvasStore((s) => s.setDownloadPNG);

  //SEC 控制畫布
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
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
  const mouseDown = useRef<{ x: number; y: number; time: number }>({
    x: 0,
    y: 0,
    time: 0,
  });
  Date.now();
  const panStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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

  function getMousePosition(e: React.MouseEvent | MouseEvent) {
    const CTM = groupRef.current!.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    const mouseX = (e.clientX - CTM.e) / CTM.a;
    const mouseY = (e.clientY - CTM.f) / CTM.d;
    return { x: mouseX, y: mouseY };
  }
  const handleTextMouseDown = (
    e: React.MouseEvent<SVGTextElement>,
    index: number
  ) => {
    const mousePosition = getMousePosition(e);
    mouseDown.current = {
      x: mousePosition.x,
      y: mousePosition.y,
      time: Date.now(),
    };

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

    if (
      isMiddleClick ||
      (isLeftClick &&
        (e.target instanceof SVGSVGElement ||
          e.target instanceof SVGRectElement))
    ) {
      e.preventDefault();
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY };
      return;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (dragState.index !== null) {
      e.preventDefault();
      const mousePosition = getMousePosition(e);
      const newX = mousePosition.x - dragState.offsetX;
      const newY = mousePosition.y - dragState.offsetY;

      const updated = composition.map((word, i) =>
        i === dragState.index ? { ...word, x: newX, y: newY } : word
      );

      setComposition(updated);
    }
    if (isPanning) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;

      setCanvasTransform((prev) => ({
        ...prev,
        translateX: prev.translateX + dx,
        translateY: prev.translateY + dy,
      }));

      panStart.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    // if (dragState.index !== null) {
    //   // TODO undo/redo
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

  // SEC 點擊詞彙
  const setSelectedWord = useWordCloudStore((s) => s.setSelectedWord);

  // SEC 文字雲繪製
  const {
    segmentedWords,
    removedWords,
    selectionCount,
    composition,
    getSelectedWords,
    setComposition,
  } = useWordCloudStore();
  const fontStyleMap = useWordCloudStore((s) => s.fontStyleMap);
  const globalFontStyle = useWordCloudStore((s) => s.globalFontStyle);
  const textColorMap = useWordCloudStore((s) => s.textColorMap);
  const defaultTextColor = useWordCloudStore((s) => s.defaultTextColor);
  const textShadowMap = useWordCloudStore((s) => s.textShadowMap);
  const globalTextShadow = useWordCloudStore((s) => s.globalTextShadow);
  // 生成新的
  const hasGeneratedRef = useRef(false);
  const lastDepsRef = useRef<{
    segmentedWords: SegmentedWord[];
    removedWords: SegmentedWord[];
    selectionCount: number;
  } | null>(null);
  useEffect(() => {
    if (pathname !== "/composition") return;

    if (!svgRef.current || !groupRef.current) return;
    const svgEl = svgRef.current;
    const width = svgEl.clientWidth;
    const height = svgEl.clientHeight;
    const selectedWords = getSelectedWords();

    if (!width || !height || selectedWords.length === 0) return;

    const currentDeps = {
      segmentedWords,
      removedWords,
      selectionCount,
    };

    const depsChanged = (() => {
      const last = lastDepsRef.current;
      if (!last) return true;
      return (
        last.selectionCount !== currentDeps.selectionCount ||
        last.removedWords.join(",") !== currentDeps.removedWords.join(",") ||
        last.segmentedWords.map((w) => w.text).join(",") !==
          currentDeps.segmentedWords.map((w) => w.text).join(",")
      );
    })();

    if (hasGeneratedRef.current && !depsChanged) return;

    const wordCloudComposition = generateWordCloud(selectedWords, svgEl);
    setComposition(wordCloudComposition);

    hasGeneratedRef.current = true;
    lastDepsRef.current = currentDeps;

    requestAnimationFrame(() => {
      resetCanvasPosition();
    });
  }, [segmentedWords, removedWords, selectionCount]);
  // 重畫
  function regenerateWordCloud() {
    if (!svgRef.current || !groupRef.current) return;
    const svgEl = svgRef.current;
    const selectedWords = getSelectedWords();
    const wordCloudComposition = generateWordCloud(selectedWords, svgEl);
    setComposition(wordCloudComposition);
    requestAnimationFrame(() => {
      resetCanvasPosition();
    });
  }

  // SEC 下載
  // SVG檔案
  function downloadSVG(bgTransIsChecked: boolean) {
    const words = useWordCloudStore.getState().composition;
    if (!words || words.length === 0) return;
    const {
      fontStyleMap,
      textColorMap,
      textShadowMap,
      globalFontStyle,
      globalTextShadow,
    } = useWordCloudStore.getState();

    const { canvasColor } = useCanvasStore.getState();

    const padding = 50;
    const minX = Math.min(...words.map((w) => w.x));
    const maxX = Math.max(...words.map((w) => w.x + w.width));
    const minY = Math.min(...words.map((w) => w.y - w.height));
    const maxY = Math.max(...words.map((w) => w.y));
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    const filterDefs: string[] = [];
    const wordFilterMap: Record<string, string> = {};

    // global shadow filter
    filterDefs.push(`<filter id="text-shadow-global" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="${
      globalTextShadow.dx
    }" dy="${globalTextShadow.dy}" stdDeviation="${
      globalTextShadow.blur / 2
    }" flood-color="rgba(${globalTextShadow.rgba.r},${
      globalTextShadow.rgba.g
    },${globalTextShadow.rgba.b},${globalTextShadow.rgba.a || 0})" />
        </filter>`);

    // single shadow filter
    Object.entries(textShadowMap).forEach(([text, shadow], index) => {
      const filterId = `text-shadow-${index}`;
      wordFilterMap[text] = filterId;

      filterDefs.push(`
        <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="${
        shadow.dx
      }" dy="${shadow.dy}" stdDeviation="${
        shadow.blur / 2
      }" flood-color="rgba(${shadow.rgba.r},${shadow.rgba.g},${shadow.rgba.b},${
        shadow.rgba.a || 0
      })" />
        </filter>
        `);
    });

    const bgRect = `<rect width="100%" height="100%" fill="${canvasColor}" />`;

    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        ${filterDefs.join("\n")}
      </defs>
      ${bgTransIsChecked ? "" : bgRect}
      <g>
        ${words
          .map((word) => {
            const currentFontStyle = {
              ...globalFontStyle,
              ...fontStyleMap[word.text],
            };
            const filterId = wordFilterMap[word.text] || "text-shadow-global";
            return `
            <text
              x="${word.x - minX + padding}"
              y="${word.y - minY + padding}"
              font-size="${word.fontSize}"
              font-family="${currentFontStyle.fontFamily}"
              font-weight="${currentFontStyle.fontWeight}"
              font-style="${currentFontStyle.italic ? "italic" : "normal"}"
              fill="${textColorMap[word.text]?.color || "#545454"}"
              filter="url(#${filterId})"
            >
              ${word.text}
            </text>
          `;
          })
          .join("")}
      </g>
    </svg>`;

    const blob = new Blob([svgContent], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wordcloud.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  // PNG檔案
  function downloadPNG(bgTransIsChecked: boolean) {
    const words = useWordCloudStore.getState().composition;
    if (!words || words.length === 0) return;

    const {
      fontStyleMap,
      textColorMap,
      textShadowMap,
      globalFontStyle,
      globalTextShadow,
    } = useWordCloudStore.getState();

    const { canvasColor } = useCanvasStore.getState();

    const padding = 50;
    const minX = Math.min(...words.map((w) => w.x));
    const maxX = Math.max(...words.map((w) => w.x + w.width));
    const minY = Math.min(...words.map((w) => w.y - w.height));
    const maxY = Math.max(...words.map((w) => w.y));
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (bgTransIsChecked) {
      ctx.fillStyle = "rgb(255 255 255 / 0%)";
    } else {
      ctx.fillStyle = canvasColor;
    }
    ctx.fillRect(0, 0, width, height);

    words.forEach((word) => {
      const currentFontStyle = {
        ...globalFontStyle,
        ...fontStyleMap[word.text],
      };
      const currentTextShadow = {
        ...globalTextShadow,
        ...textShadowMap[word.text],
      };
      ctx.shadowColor = `rgba(${currentTextShadow.rgba.r},${
        currentTextShadow.rgba.g
      },${currentTextShadow.rgba.b},${currentTextShadow.rgba.a || 0})`;
      ctx.shadowBlur = currentTextShadow.blur;
      ctx.shadowOffsetX = currentTextShadow.dx;
      ctx.shadowOffsetY = currentTextShadow.dy;
      ctx.font = `${currentFontStyle.italic ? "italic" : ""} ${
        currentFontStyle.fontWeight
      } ${word.fontSize}px ${currentFontStyle.fontFamily}`;
      ctx.fillStyle = textColorMap[word.text]?.color || "#545454";
      ctx.fillText(word.text, word.x - minX + padding, word.y - minY + padding);
      4;
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "wordcloud.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  // SEC 將canvas variables & methods傳至useCanvasStore供外部取用
  useEffect(() => {
    setCanvasSVGRef(svgRef.current);
    setCanvasGRef(groupRef.current);
    setTriggerRegenerate(regenerateWordCloud);

    setDownloadSVG(downloadSVG);

    setDownloadPNG(downloadPNG);
  }, []);

  // SEC 在composition page清空style map
  useEffect(() => {
    if (pathname === "/composition") {
      useWordCloudStore.getState().resetStyleMaps();
      useCanvasStore.getState().setCanvasColor("#ffffff");
    }
  }, [pathname]);

  return (
    <div className="h-full outline-4 outline-primary-dark outline-offset-[-4px] rounded-2xl relative max-md:rounded-none">
      <svg
        ref={svgRef}
        className="h-full w-full"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => setSelectedWord(null)}
        style={{ cursor: "move" }}
      >
        {pathname === "/style" && (
          <rect width="100%" height="100%" fill={canvasColor} rx={16} />
        )}

        <g
          ref={groupRef}
          transform={`translate(${canvasTransform.translateX}, ${canvasTransform.translateY}) scale(${canvasTransform.scale})`}
        >
          {hoverIndex !== null && (
            <rect
              x={composition[hoverIndex].x}
              y={
                composition[hoverIndex].y -
                composition[hoverIndex].height +
                composition[hoverIndex].descent
              }
              width={composition[hoverIndex].width}
              height={composition[hoverIndex].height}
              fill="none"
              stroke="#DF6F6F"
              strokeDasharray="2"
              strokeWidth={2}
              pointerEvents="none"
            />
          )}
          {composition.map((word, index) => {
            const currentFontStyle = {
              ...globalFontStyle,
              ...fontStyleMap[word.text],
            };
            const textShadow = textShadowMap[word.text] ?? globalTextShadow;
            return (
              <text
                key={index}
                x={word.x}
                y={word.y}
                fontSize={word.fontSize}
                fontFamily={currentFontStyle.fontFamily}
                fontWeight={currentFontStyle.fontWeight}
                fontStyle={currentFontStyle.italic ? "italic" : "normal"}
                style={{
                  textShadow: `${textShadow.dx * canvasTransform.scale}px ${
                    textShadow.dy * canvasTransform.scale
                  }px ${textShadow.blur}px rgba(${textShadow.rgba.r},${
                    textShadow.rgba.g
                  },${textShadow.rgba.b},${
                    textShadow.rgba.a ? textShadow.rgba.a : 0
                  })`,
                }}
                fill={textColorMap[word.text]?.color || defaultTextColor}
                onMouseDown={(e) => {
                  handleTextMouseDown(e, index);
                }}
                className={`${
                  dragState.index === null ? "cursor-grab" : "cursor-grabbing"
                }`}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  const mousePos = getMousePosition(e);
                  const down = mouseDown.current;
                  const dx = mousePos.x - down.x;
                  const dy = mousePos.y - down.y;
                  const dt = Date.now() - down.time;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  const isClick = distance < 5 && dt < 300;
                  if (isClick) setSelectedWord(word.text);
                  else return;
                }}
              >
                {word.text}
              </text>
            );
          })}
        </g>
      </svg>
      {pathname === "/style" && (
        <div className="absolute z-10 right-[10px] top-[10px] flex items-center max-md:text-sm">
          <ColorPicker color={canvasColor} onChange={setCanvasColor} />
        </div>
      )}

      <Button
        style="hollow"
        className="absolute z-10 right-[10px] bottom-[10px] px-4"
        onClick={() => resetCanvasPosition(true)}
      >
        <div className="flex items-center max-md:text-sm">
          <FontAwesomeIcon icon={faCompress} />
          <div className="pl-2">重置畫布縮放</div>
        </div>
      </Button>
    </div>
  );
}
