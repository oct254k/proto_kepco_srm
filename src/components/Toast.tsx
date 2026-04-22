"use client";
import React, { createContext, useCallback, useContext, useState } from "react";

interface ToastItem { id: number; message: string; type?: "success" | "error" | "info"; }

const ToastCtx = createContext<{ show: (msg: string, type?: ToastItem["type"]) => void }>({
  show: () => {},
});

export function useToast() { return useContext(ToastCtx); }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const show = useCallback((message: string, type: ToastItem["type"] = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 8, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: "12px 20px",
              background: t.type === "error" ? "#FEE2E2" : t.type === "info" ? "#DBEAFE" : "#D1FAE5",
              color: t.type === "error" ? "#991B1B" : t.type === "info" ? "#1E40AF" : "#065F46",
              borderRadius: 6,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              fontSize: 17,
              fontWeight: 500,
              minWidth: 280,
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
