import { useState, useRef } from "react";
import clsx from "clsx";

import Button from "@/app/components/button";
import Modal from "@/app/components/modal";
import Checkbox from "@/app/components/checkbox";
import { useCanvasStore } from "@/app/lib/useCanvasStore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";

export default function DownloadFilePanel({
  className,
}: {
  className?: string;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const downloadSVG = useCanvasStore((s) => s.downloadSVG);
  const downloadPNG = useCanvasStore((s) => s.downloadPNG);
  return (
    <div className={clsx("relative", className)} ref={panelRef}>
      <Button
        style="solid"
        className="w-full"
        onClick={() => setOpen((s) => !s)}
      >
        <div className="flex justify-center items-center">
          <FontAwesomeIcon icon={faFileArrowDown} />
          <div className="pl-2">下載檔案</div>
        </div>
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className="p-6 flex flex-col items-center gap-3">
          <h3 className="text-xl">下載文字雲圖檔</h3>
          <div className="flex gap-3">
            <Button
              style="solid"
              className="px-8"
              onClick={() => downloadSVG(isChecked)}
            >
              SVG
            </Button>
            <Button
              style="solid"
              className="px-8"
              onClick={() => downloadPNG(isChecked)}
            >
              PNG
            </Button>
          </div>
          <Checkbox
            label="透明背景"
            isChecked={isChecked}
            onChange={() => setIsChecked((s) => !s)}
          />
        </div>
      </Modal>
    </div>
  );
}
