"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRole } from "@/lib/role";
import { canAccessPath } from "@/lib/access";
import ForbiddenView from "@/components/ForbiddenView";
import { ToastProvider } from "@/components/Toast";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [role] = useRole();

  useEffect(() => { setIsOpen(false); }, [pathname]);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const isLogin = pathname === "/login" || pathname === "/login/";
  const unauthorized = !isLogin && !canAccessPath(role, pathname);

  if (isLogin) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen" style={{ paddingTop: 48 }}>
        <Header onMenuClick={() => setIsOpen((v) => !v)} />
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        {isOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setIsOpen(false)} />
        )}
        <main style={{ flex: 1, minWidth: 0, background: "#ffffff", padding: "24px 32px 40px" }}>
          {unauthorized ? <ForbiddenView /> : children}
        </main>
      </div>
    </ToastProvider>
  );
}
