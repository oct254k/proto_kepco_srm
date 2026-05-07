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
        display: "inline-block",
        background: style.bg,
        color: style.color,
        borderRadius: "999px",
        padding: "2px 10px",
        fontSize: "12px",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {style.label}
    </span>
  );
}
