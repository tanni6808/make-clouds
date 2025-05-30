import { useWordCloudStore } from "./wordCloudStore";

const updateWordPosition = useWordCloudStore.getState().updateWordPosition;
let currentTransform = { x: 0, y: 0, scale: 1 };

export function resetScale(svg: SVGSVGElement, group: SVGGElement) {
  const bbox = group.getBBox();
  const { width: svgWidth, height: svgHeight } = svg.getBoundingClientRect();

  const scaleX = svgWidth / bbox.width;
  const scaleY = svgHeight / bbox.height;
  const scale = Math.min(scaleX, scaleY) * 0.8;
  const translateX = svgWidth / 2 - (bbox.x + bbox.width / 2) * scale;
  const translateY = svgHeight / 2 - (bbox.y + bbox.height / 2) * scale;
  group.setAttribute(
    "transform",
    `translate(${translateX}, ${translateY}) scale(${scale})`
  );
  const match = group
    .getAttribute("transform")
    ?.match(/translate\(([^,]+),\s?([^)]+)\)\s?scale\(([^)]+)\)/);
  if (match) {
    currentTransform.x = parseFloat(match[1]);
    currentTransform.y = parseFloat(match[2]);
    currentTransform.scale = parseFloat(match[3]);
  }
}

export function getMousePosition(event: MouseEvent, group: SVGGElement) {
  const CTM = group.getScreenCTM();
  if (!CTM) return { x: 0, y: 0 };
  const mouseX = (event.clientX - CTM.e) / CTM.a;
  const mouseY = (event.clientY - CTM.f) / CTM.d;
  return { x: mouseX, y: mouseY };
}

export function addCanvasInteractions(
  svgEl: SVGSVGElement,
  groupEl: SVGGElement
) {
  let isDraggingCanvas = false;
  let dragButton: number | null = null;
  let canvasStart = { x: 0, y: 0 };

  const match = groupEl
    .getAttribute("transform")
    ?.match(/translate\(([^,]+),\s?([^)]+)\)\s?scale\(([^)]+)\)/);
  if (match) {
    currentTransform.x = parseFloat(match[1]);
    currentTransform.y = parseFloat(match[2]);
    currentTransform.scale = parseFloat(match[3]);
  }

  // 拖曳畫布（左鍵或中鍵）
  svgEl.addEventListener("mousedown", (e) => {
    // 左鍵（0）按在空白處 或 中鍵（1）按在任何地方
    if (
      (e.button === 0 && (e.target as Element).tagName !== "text") ||
      e.button === 1
    ) {
      e.preventDefault();
      isDraggingCanvas = true;
      dragButton = e.button;
      canvasStart = { x: e.clientX, y: e.clientY };
    }
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDraggingCanvas) return;
    e.preventDefault();
    const dx = e.clientX - canvasStart.x;
    const dy = e.clientY - canvasStart.y;
    groupEl.setAttribute(
      "transform",
      `translate(${currentTransform.x + dx}, ${
        currentTransform.y + dy
      }) scale(${currentTransform.scale})`
    );
  });

  window.addEventListener("mouseup", (e) => {
    if (isDraggingCanvas && e.button === dragButton) {
      const match = groupEl
        .getAttribute("transform")
        ?.match(/translate\(([^,]+),\s?([^)]+)\)\s?scale\(([^)]+)\)/);
      if (match) {
        currentTransform.x = parseFloat(match[1]);
        currentTransform.y = parseFloat(match[2]);
        currentTransform.scale = parseFloat(match[3]);
      }
    }
    isDraggingCanvas = false;
    dragButton = null;
  });

  // 拖曳詞彙（只限左鍵）
  const textElements = groupEl.querySelectorAll("text");
  textElements.forEach((text) => {
    let isDraggingText = false;
    let offset = { x: 0, y: 0 };

    text.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return; // 只接受左鍵拖曳
      e.stopPropagation();
      isDraggingText = true;
      const mousePosition = getMousePosition(e, groupEl);
      offset = {
        x: mousePosition.x - parseFloat(text.getAttribute("x") || "0"),
        y: mousePosition.y - parseFloat(text.getAttribute("y") || "0"),
      };
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDraggingText) return;
      const mousePosition = getMousePosition(e, groupEl);
      const newX = mousePosition.x - offset.x;
      const newY = mousePosition.y - offset.y;
      text.setAttribute("x", newX.toString());
      text.setAttribute("y", newY.toString());
      updateWordPosition(text.textContent || "", newX, newY);
    });

    window.addEventListener("mouseup", () => {
      isDraggingText = false;
    });

    // Text hover hint
  });

  // Zoom In/Out
  svgEl.addEventListener("wheel", (e) => {
    e.preventDefault();

    const scaleFactor = 1.1;
    const { offsetX, offsetY } = e;
    const direction = e.deltaY > 0 ? -1 : 1;
    const zoomAmount = direction > 0 ? scaleFactor : 1 / scaleFactor;

    const newScale = Math.max(
      0.1,
      Math.min(5, currentTransform.scale * zoomAmount)
    );
    const scaleChange = newScale / currentTransform.scale;

    const dx = (offsetX - currentTransform.x) * (1 - scaleChange);
    const dy = (offsetY - currentTransform.y) * (1 - scaleChange);

    currentTransform.x += dx;
    currentTransform.y += dy;
    currentTransform.scale = newScale;

    groupEl.setAttribute(
      "transform",
      `translate(${currentTransform.x}, ${currentTransform.y}) scale(${currentTransform.scale})`
    );
  });
}
