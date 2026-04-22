"use client";
import React from "react";
import { Home, ChevronRight } from "lucide-react";

interface BreadcrumbProps { items: string[]; }

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16, fontSize: 16, color: "#666" }}>
      <Home size={14} />
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <ChevronRight size={12} color="#aaa" />
          <span style={{ color: i === items.length - 1 ? "#222" : "#666", fontWeight: i === items.length - 1 ? 600 : 400 }}>
            {item}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}
