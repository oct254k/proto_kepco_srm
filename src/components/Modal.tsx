"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number;
  footer?: React.ReactNode;
}

export default function Modal({ open, onClose, title, children, width = 520, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 8, width, maxWidth: "90vw", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #dee2e6", flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>{title}</span>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={16} color="#555" />
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "1.25rem" }}>{children}</div>
        {footer && (
          <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid #dee2e6", display: "flex", justifyContent: "flex-end", gap: 6, flexShrink: 0 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
