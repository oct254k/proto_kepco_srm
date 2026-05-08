"use client";
import React from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

export default function PageHeader({ title, actions, showBack = true, onBack }: PageHeaderProps) {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "8px 0 24px",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="뒤로"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#1a1a1a",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ChevronLeft size={24} strokeWidth={2.2} />
          </button>
        )}
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#1a1a1a",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h1>
      </div>
      {actions && <div style={{ display: "flex", gap: 6, alignItems: "center" }}>{actions}</div>}
    </div>
  );
}
