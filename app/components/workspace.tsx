import clsx from "clsx";

export default function Workspace({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "bg-white rounded-3xl shadow mb-10 max-md:rounded-t-none md:mt-6",
        className
      )}
    >
      <div className="max-w-[1000px] mx-auto pb-10">{children}</div>
    </div>
  );
}
