import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "100 900",
  display: "swap",
});

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
    <html lang="ko" className={pretendard.variable}>
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#f5f5f5",
          fontFamily: "var(--font-pretendard), -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
        }}
      >
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
