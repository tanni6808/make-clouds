"use client";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import Header from "./header";
import Intro from "./intro";
import Workspace from "./workspace";
import StepNavigation from "./stepNav";
import Canvas from "./canvas";
import Footer from "./footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSteps = ["/", "/composition", "/style"].includes(pathname);
  const showCanvas = ["/composition", "/style"].includes(pathname);

  return (
    <div className="max-w-[1200px] mx-auto max-xl:mx-5 max-md:mx-0">
      <Header />
      {pathname === "/" && <Intro />}
      <Workspace
        className={clsx(
          "relative",
          showCanvas && "md:mt-0 mt-[460px]"
          // "max-md:grid max-md:grid-rows-[400px_100px_300px]"
        )}
      >
        {showSteps && <StepNavigation />}
        {showCanvas ? (
          <div className="grid grid-cols-4 gap-8 min-h-[600px] mx-2 md:max-xl:grid-cols-[1fr_1fr_1fr_226px] max-md:grid-cols-[1fr] max-md:mx-10 max-md:min-h-[300px]">
            <div
              className={clsx(
                "max-md:z-30 max-md:transition-all",
                "static col-start-1 col-end-4",
                showCanvas && "md:block",
                showCanvas
                  ? "relative h-[600px] bg-white max-md:fixed max-md:top-[60px] max-md:left-0 max-md:right-0 max-md:h-[400px] max-md:pb-10 "
                  : "hidden"
              )}
            >
              <Canvas />
            </div>
            {children}
          </div>
        ) : (
          <div className="pb-8">{children}</div>
        )}
      </Workspace>
      <Footer />
    </div>
  );
}
