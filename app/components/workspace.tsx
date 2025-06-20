export default function Workspace({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-3xl shadow mb-10 max-md:rounded-t-none ${
        className ?? ""
      }`}
    >
      <div className="max-w-[1000px] mx-auto pb-10">{children}</div>
    </div>
  );
}
