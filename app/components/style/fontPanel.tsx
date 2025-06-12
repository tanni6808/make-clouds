import { FontDropdown } from "../dropdown";
import { FontStyle } from "@/app/lib/definitions";
import { useWordCloudStore } from "@/app/lib/wordCloudStore";

import { MdDelete } from "react-icons/md";

export function GlobalFontPanel() {
  const defaultStyle = useWordCloudStore((s) => s.defaultFontStyle);
  const fontStyle = useWordCloudStore((s) => s.globalFontStyle);
  const setFontStyle = useWordCloudStore((s) => s.setGlobalFontStyle);

  const currentStyle = { ...defaultStyle, ...fontStyle };
  const handleChange = (key: keyof FontStyle, value: any) => {
    const updates = { [key]: value };
    setFontStyle({ ...currentStyle, ...updates });
  };
  const handleFontChange = (value: string) => {
    const lastSpace = value.lastIndexOf(" ");
    const fontFamily = value.slice(0, lastSpace);
    const fontWeight = value.slice(lastSpace + 1);

    const updates = {
      fontFamily,
      fontWeight,
    };
    setFontStyle({ ...currentStyle, ...updates });
  };
  return (
    <div className="outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]">
      <div className="text-center mb-[10px]">字型</div>
      <div className="flex flex-col gap-2">
        <FontDropdown
          value={`${fontStyle.fontFamily} ${fontStyle.fontWeight}`}
          onChange={(val) => handleFontChange(val)}
          options={[
            { label: "思源黑體 細", value: "Noto Sans TC 300" },
            { label: "思源黑體 標準", value: "Noto Sans TC 400" },
            { label: "思源黑體 粗", value: "Noto Sans TC 700" },
            { label: "思源黑體 濃", value: "Noto Sans TC 900" },
            { label: "思源宋體 細", value: "Noto Serif TC 300" },
            { label: "思源宋體 標準", value: "Noto Serif TC 400" },
            { label: "思源宋體 粗", value: "Noto Serif TC 700" },
            { label: "思源宋體 濃", value: "Noto Serif TC 900" },
            {
              label: "朱古力黑體 標準",
              value: "Chocolate Classical Sans 400",
            },
            { label: "霞鶩文楷 細", value: "LXGW WenKai TC 300" },
            { label: "霞鶩文楷 標準", value: "LXGW WenKai TC 400" },
            { label: "霞鶩文楷 粗", value: "LXGW WenKai TC 700" },
            {
              label: "仙人掌明體 標準",
              value: "Cactus Classical Serif 400",
            },
          ]}
        ></FontDropdown>
        <div className="grid grid-cols-[1fr_1fr] gap-2">
          <button
            className={`text-center rounded-lg h-[40px] italic ${
              fontStyle.italic
                ? "bg-primary-dark text-white hover:bg-primary-light"
                : "bg-gray-light hover:bg-gray-md"
            }`}
            onClick={() => handleChange("italic", !fontStyle.italic)}
          >
            斜體
          </button>
          <button
            className={`text-center rounded-lg h-[40px] underline ${
              fontStyle.underline
                ? "bg-primary-dark text-white hover:bg-primary-light"
                : "bg-gray-light hover:bg-gray-md"
            }`}
            onClick={() => handleChange("underline", !fontStyle.underline)}
          >
            底線
          </button>
        </div>
      </div>
    </div>
  );
}

export function IndividualFontPanel({ text }: { text: string }) {
  const defaultStyle = useWordCloudStore((s) => s.defaultFontStyle);
  const globalFontStyle = useWordCloudStore((s) => s.globalFontStyle);
  const fontStyle = useWordCloudStore((s) => s.fontStyleMap[text]);
  const setFontStyle = useWordCloudStore((s) => s.setIndividualFontStyle);
  const delFontStyle = useWordCloudStore((s) => s.clearIndividualFontStyle);

  const currentStyle = { ...defaultStyle, ...globalFontStyle, ...fontStyle };
  const handleChange = (key: keyof FontStyle, value: any) => {
    const updates = { [key]: value };
    setFontStyle(text, { ...currentStyle, ...updates });
  };
  const handleFontChange = (value: string) => {
    const lastSpace = value.lastIndexOf(" ");
    const fontFamily = value.slice(0, lastSpace);
    const fontWeight = value.slice(lastSpace + 1);

    const updates = {
      fontFamily,
      fontWeight,
    };
    setFontStyle(text, { ...currentStyle, ...updates });
  };
  const handleDeleteFontStyle = () => {
    delFontStyle(text);
  };
  return (
    <div className="rounded-lg p-[10px] bg-white text-sm relative">
      <MdDelete
        className="absolute right-[10px] top-[10px] h-[18px] w-[18px] hover:text-primary-light cursor-pointer"
        onClick={handleDeleteFontStyle}
      />
      <div className="text-center mb-[10px]">字型</div>
      <div className="flex flex-col gap-2">
        <FontDropdown
          value={`${currentStyle.fontFamily} ${currentStyle.fontWeight}`}
          onChange={(val) => handleFontChange(val)}
          options={[
            { label: "思源黑體 細", value: "Noto Sans TC 300" },
            { label: "思源黑體 標準", value: "Noto Sans TC 400" },
            { label: "思源黑體 粗", value: "Noto Sans TC 700" },
            { label: "思源黑體 濃", value: "Noto Sans TC 900" },
            { label: "思源宋體 細", value: "Noto Serif TC 300" },
            { label: "思源宋體 標準", value: "Noto Serif TC 400" },
            { label: "思源宋體 粗", value: "Noto Serif TC 700" },
            { label: "思源宋體 濃", value: "Noto Serif TC 900" },
            {
              label: "朱古力黑體 標準",
              value: "Chocolate Classical Sans 400",
            },
            { label: "霞鶩文楷 細", value: "LXGW WenKai TC 300" },
            { label: "霞鶩文楷 標準", value: "LXGW WenKai TC 400" },
            { label: "霞鶩文楷 粗", value: "LXGW WenKai TC 700" },
            {
              label: "仙人掌明體 標準",
              value: "Cactus Classical Serif 400",
            },
          ]}
        ></FontDropdown>
        <div className="grid grid-cols-[1fr_1fr] gap-2">
          <button
            className={`text-center rounded-lg h-[40px] italic ${
              currentStyle.italic
                ? "bg-primary-dark text-white hover:bg-primary-light"
                : "bg-gray-light hover:bg-gray-md"
            }`}
            onClick={() => handleChange("italic", !currentStyle.italic)}
          >
            斜體
          </button>
          <button
            className={`text-center rounded-lg h-[40px] underline ${
              currentStyle.underline
                ? "bg-primary-dark text-white hover:bg-primary-light"
                : "bg-gray-light hover:bg-gray-md"
            }`}
            onClick={() => handleChange("underline", !currentStyle.underline)}
          >
            底線
          </button>
        </div>
      </div>
    </div>
  );
}
