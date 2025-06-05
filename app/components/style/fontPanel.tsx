import { FontDropdown } from "../dropdown";
import { useWordCloudStore } from "@/app/lib/wordCloudStore";
import { FontStyle } from "@/app/lib/definitions";

export default function FontPanel() {
  const globalFontStyle = useWordCloudStore((s) => s.globalFontStyle);
  const setGlobalFontStyle = useWordCloudStore((s) => s.setGlobalFontStyle);
  const handleChange = (key: keyof FontStyle, value: any) => {
    setGlobalFontStyle({ ...globalFontStyle, [key]: value });
  };
  const handleFontChange = (value: string) => {
    const lastSpace = value.lastIndexOf(" ");
    const fontFamily = value.slice(0, lastSpace);
    const fontWeight = value.slice(lastSpace + 1);

    setGlobalFontStyle({
      ...globalFontStyle,
      fontFamily,
      fontWeight,
    });
  };
  return (
    <div className="outline outline-4 outline-primary-dark outline-offset-[-4px] rounded-lg p-[15px]">
      <div className="text-center mb-[10px]">字型</div>
      <div className="flex flex-col gap-2">
        <FontDropdown
          value={`${globalFontStyle.fontFamily} ${globalFontStyle.fontWeight}`}
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
              globalFontStyle.italic
                ? "bg-primary-dark text-white hover:bg-primary-light"
                : "bg-gray-light hover:bg-gray-md"
            }`}
            onClick={() => handleChange("italic", !globalFontStyle.italic)}
          >
            斜體
          </button>
          <button
            className={`text-center rounded-lg h-[40px] text-shadow-lg ${
              globalFontStyle.shadow
                ? "bg-primary-dark text-white hover:bg-primary-light"
                : "bg-gray-light hover:bg-gray-md"
            }`}
            onClick={() => handleChange("shadow", !globalFontStyle.shadow)}
          >
            陰影
          </button>
        </div>
      </div>
    </div>
  );
}
