"use client";
import React from "react";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number;
}

export default function Drawer({ open, onClose, title, children, width = 580 }: DrawerProps) {
  return (
    <>
      {open && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50 }}
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
          boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
          zIndex: 51,
          transform: open ? "translateX(0)" : `translateX(${width}px)`,
          transition: "transform 0.25s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #e0e0e0",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 19, fontWeight: 700, color: "#222" }}>{title}</span>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}
          >
            <X size={20} color="#555" />
          </button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>{children}</div>
      </div>
    </>
  );
}
