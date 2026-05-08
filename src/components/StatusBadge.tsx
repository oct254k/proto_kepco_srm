import React from "react";
import { getStatusMeta } from "@/lib/status";

interface StatusBadgeProps {
  status: string;
  label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = getStatusMeta(status, label);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: style.bg,
        color: style.color,
        borderRadius: 9999,
        padding: "2px 8px",
        fontSize: "11px",
        fontWeight: 700,
        whiteSpace: "nowrap",
        lineHeight: 1.4,
      }}
    >
      {style.label}
    </span>
  );
}
