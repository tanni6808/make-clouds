import clsx from "clsx";

export default function Button({
  children,
  style,
  className,
  type,
  onClick,
}: {
  children: React.ReactNode;
  style: "solid" | "hollow";
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}) {
  const baseClass =
    "rounded-lg px-8 py-2 transition cursor-pointer inline-block";
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
    >
      {children}
    </button>
  );
}
