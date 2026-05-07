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
              padding: "10px 16px",
              background: t.type === "error" ? "#f8d7da" : t.type === "info" ? "#cce5ff" : "#d4edda",
              color: t.type === "error" ? "#721c24" : t.type === "info" ? "#004085" : "#155724",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              fontSize: 12,
              fontWeight: 600,
              minWidth: 240,
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
