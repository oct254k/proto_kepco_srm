"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Breadcrumb from "@/components/Breadcrumb";
import { useRole } from "@/lib/role";
import { getBreadcrumb } from "@/lib/menu";
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

  if (isLogin) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  const crumbs = getBreadcrumb(role, pathname);

  return (
    <ToastProvider>
      <div className="flex min-h-screen" style={{ paddingTop: 48 }}>
        <Header onMenuClick={() => setIsOpen(true)} />
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        {isOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setIsOpen(false)} />
        )}
        <main style={{ flex: 1, minWidth: 0, background: "#ffffff", padding: "1.5rem" }}>
          {crumbs.length > 0 && <Breadcrumb items={crumbs} />}
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
