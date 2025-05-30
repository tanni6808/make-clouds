import StepNavigation from "./stepNav";

export default function Workspace({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl shadow mb-10">
      <div className="w-[1000px] mx-auto pb-10">
        <StepNavigation />
        {children}
      </div>
    </div>
  );
}
