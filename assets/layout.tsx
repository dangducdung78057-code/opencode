import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StageOS Engineering System",
  description: "Integrated StageOS module registry and orchestration shell.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
