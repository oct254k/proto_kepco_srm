"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number;
}

export default function Drawer({ open, onClose, title, children, width = 580 }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 200 }}
          onClick={onClose}
        />
      )}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width,
          height: "100vh",
          background: "#fff",
          boxShadow: "-4px 0 16px rgba(0,0,0,0.15)",
          zIndex: 201,
          transform: open ? "translateX(0)" : `translateX(${width}px)`,
          transition: "transform 300ms ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.875rem 1.25rem",
            borderBottom: "1px solid #dee2e6",
            background: "#f8f9fa",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>{title}</span>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}
          >
            <X size={16} color="#555" />
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "1.25rem" }}>{children}</div>
      </div>
    </>
  );
}
