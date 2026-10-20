import clsx from "clsx";
/**
 * TODO: tab 加一個 disable 狀態 
 */
interface Tab {
  label: string
  value: string
}

interface Props {
  tabs: Tab[]
  current: string
  onChange: (value: string) => void
  className: string
}

export default function TabSwitcher({
  tabs,
  current,
  onChange,
  className,
}: Readonly<Props>)
{
  return (
    <div className="text-center flex bg-gray-md rounded-md justify-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={clsx(
            "py-1 my-1 rounded",
            className,
            current === tab.value
              ? "bg-white"
              : "text-primary-light hover:bg-gray-light transition cursor-pointer"
          )}
          onClick={
            current === tab.value ? undefined : () => onChange(tab.value)
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
