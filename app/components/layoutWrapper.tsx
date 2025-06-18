"use client";
import { usePathname } from "next/navigation";
import Header from "./header";
import Workspace from "./workspace";
import Canvas from "./canvas";
import Footer from "./footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showCanvas = ["/composition", "/style"].includes(pathname);

  return (
    <div className="w-[1200px] mx-auto">
      <Header />
      <Workspace>
        {showCanvas ? (
          <div className="grid grid-cols-4 gap-8 h-[600px]">
            <div className="col-start-1 col-end-4">
              <Canvas />
            </div>
            {children}
          </div>
        ) : (
          <div className="py-8">{children}</div>
        )}
      </Workspace>
      <Footer />
    </div>
  );
}
