import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "虾王 — AI Agent 技能市场",
  description: "发现、安装和分享 AI Agent 技能、插件和经验",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
