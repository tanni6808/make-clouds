import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./components/layoutWrapper";

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
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
