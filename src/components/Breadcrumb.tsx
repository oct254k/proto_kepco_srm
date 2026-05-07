"use client";
import React from "react";
import { Home, ChevronRight } from "lucide-react";

interface BreadcrumbProps { items: string[]; }

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8, fontSize: 12, color: "#6c757d" }}>
      <Home size={12} />
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <ChevronRight size={11} color="#aaa" />
          <span style={{ color: i === items.length - 1 ? "#000" : "#6c757d", fontWeight: i === items.length - 1 ? 700 : 400 }}>
            {item}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}
