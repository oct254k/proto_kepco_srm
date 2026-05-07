import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: "GS ITM 구매시스템 (SRM)",
  description: "GS ITM 사내 구매시스템 (SRM)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#ffffff",
          fontFamily: '"Nanum Gothic", "Pretendard", "돋움", dotum, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", Helvetica, sans-serif',
        }}
      >
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
