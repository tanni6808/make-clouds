import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import Workspace from "./components/workspace";
import Footer from "./components/footer";

const notoSansTC = Noto_Sans_TC({
  weight: "700",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "製雲",
  description: "繁體中文文字雲製作編輯器",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className={`${notoSansTC.className} antialiased`}>
        <div className="w-[1200px] mx-auto">
          <Header />
          <Workspace>{children}</Workspace>
          <Footer />
        </div>
      </body>
    </html>
  );
}
