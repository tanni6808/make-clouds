import { useState, useEffect, useRef } from "react";
import clsx from "clsx";

import Button from "@/app/components/button";
import { useCanvasStore } from "@/app/lib/useCanvasStore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export default function DownloadFilePanel({
  className,
}: {
  className?: string;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const downloadSVG = useCanvasStore((s) => s.downloadSVG);
  const downloadPNG = useCanvasStore((s) => s.downloadPNG);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className={clsx("relative", className)} ref={panelRef}>
      <Button
        style="solid"
        className="w-full"
        onClick={() => setOpen((s) => !s)}
      >
        <div className="flex justify-center items-center">
          <FontAwesomeIcon icon={faDownload} />
          <div className="">下載檔案</div>
        </div>
      </Button>
      {open && (
        <div className="absolute z-100 top-[-190%] flex flex-col items-stretch w-full bg-white gap-1 rounded outline-2 outline-offset-[-2]">
          <div
            className="rounded m-1 hover:bg-gray-light text-center cursor-pointer"
            onClick={downloadSVG}
          >
            SVG
          </div>
          <div
            className="rounded m-1 hover:bg-gray-light text-center cursor-pointer"
            onClick={downloadPNG}
          >
            PNG
          </div>
        </div>
      )}
    </div>
  );
}
