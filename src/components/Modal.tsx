"use client";
import React from "react";
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
  if (!open) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 8, width, maxHeight: "80vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e0e0e0", flexShrink: 0 }}>
          <span style={{ fontSize: 19, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={18} color="#555" />
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>{children}</div>
        {footer && (
          <div style={{ padding: "12px 20px", borderTop: "1px solid #e0e0e0", display: "flex", justifyContent: "flex-end", gap: 8, flexShrink: 0 }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
