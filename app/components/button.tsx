import clsx from "clsx";
/**
 * atom
 * TODO
 * 1. 給按鈕內容一定的限制（文字、prepend icon, icon only...）
 * 2. loading 狀態
 */
interface Props {
  children: React.ReactNode
  style: "solid" | "hollow"
  className?: string
  type?: "button" | "submit" | "reset";
  disabled?: boolean
  onClick?: () => void
}

export default function Button({
  children,
  style,
  className,
  type,
  disabled,
  onClick,
}: Readonly<Props>) {
  const baseClass =
    "rounded-lg py-2 transition cursor-pointer inline-block active:bg-black";
  const solidClass = "bg-primary-dark text-white hover:bg-primary-light";
  const hollowClass =
    "bg-white outline outline-4 outline-primary-dark outline-offset-[-4px] hover:bg-primary-dark hover:text-white";

  return (
    <button
      className={clsx(
        baseClass,
        style === "solid" ? solidClass : hollowClass,
        className
      )}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
