"use client";
import { useEffect, useRef, useState } from "react";
import { DragState, CanvasTransform } from "../lib/definitions";
import { useCompositionStore } from "../lib/compositionStore";

export default function Canvas() {
  const { composition, setComposition } = useCompositionStore();
  const [canvasTransform, setCanvasTransform] = useState<CanvasTransform>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const scaleInitRef = useRef(false);
  const svgWidth = 900;
  const svgHeight = 600;

  const [dragState, setDragState] = useState<DragState>({
    index: null,
    offsetX: 0,
    offsetY: 0,
  });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // inital scaling
  useEffect(() => {
    if (!scaleInitRef.current) {
      if (groupRef.current) {
        const bbox = groupRef.current.getBBox();

        const scaleX = svgWidth / bbox.width;
        const scaleY = svgHeight / bbox.height;
        const scale = Math.min(scaleX, scaleY);
        const translateX = svgWidth / 2 - (bbox.x + bbox.width / 2) * scale;
        const translateY = svgHeight / 2 - (bbox.y + bbox.height / 2) * scale;

        setCanvasTransform({
          scale,
          translateX,
          translateY,
        });
        scaleInitRef.current = true;
      }
    }
  }, []);

  // DL
  const handleDlSvg = () => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "makeWordCloud.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Drag & move text element / panning
  function getMousePosition(event: React.MouseEvent) {
    const CTM = groupRef.current!.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    const mouseX = (event.clientX - CTM.e) / CTM.a;
    const mouseY = (event.clientY - CTM.f) / CTM.d;
    return { x: mouseX, y: mouseY };
  }
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
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();

    if (!groupRef.current || !svgRef.current) return;
    const svg = svgRef.current;

    const { scale } = canvasTransform;

    const { x: svgX, y: svgY } = getMousePosition(e);

    const svgRect = svg.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    const mouseY = e.clientY - svgRect.top;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = scale * zoomFactor;

    const newTranslateX = mouseX - svgX * newScale;
    const newTranslateY = mouseY - svgY * newScale;
    setCanvasTransform({
      scale: newScale,
      translateX: newTranslateX,
      translateY: newTranslateY,
    });
  };

  return (
    <div className="flex">
      <div className="w-1/5 h-screen overflow-y-scroll">
        {composition.map((word, index) => (
          <div className="p-2 hover:bg-blue-200" key={index}>
            {word.text}
          </div>
        ))}
      </div>
      <div className="grow flex justify-center">
        <div className="">
          <svg
            ref={svgRef}
            width={svgWidth}
            height={svgHeight}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{ cursor: "move" }}
          >
            <g
              viewBox="0 0 600 400"
              ref={groupRef}
              transform={`translate(${canvasTransform.translateX}, ${canvasTransform.translateY}) scale(${canvasTransform.scale})`}
            >
              {composition.map((word, index) => (
                <text
                  key={index}
                  x={word.x}
                  y={word.y}
                  fontSize={word.fontSize}
                  fontFamily="Impact"
                  fill="black"
                  fontWeight="bold"
                  onMouseDown={(e) => {
                    handleTextMouseDown(e, index);
                  }}
                  className={`${
                    dragState.index ? "cursor-grabbing" : "cursor-grab"
                  }`}
                >
                  {word.text}
                </text>
              ))}
            </g>
          </svg>
          <button
            onClick={handleDlSvg}
            className="border-1 hover:bg-gray-300 px-1"
          >
            下載 (SVG)
          </button>
        </div>
      </div>
    </div>
  );
}
