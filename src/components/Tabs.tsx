"use client";
import React, { useState } from "react";

interface Tab { id: string; label: string; count?: number; }
interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  children: (activeTab: string) => React.ReactNode;
}

export default function Tabs({ tabs, defaultTab, children }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? "");
  return (
    <div>
      <div style={{ display: "flex", borderBottom: "2px solid #dee2e6", marginBottom: 16, gap: 0 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{
              padding: "0.5rem 1.25rem",
              fontSize: 12,
              fontWeight: active === t.id ? 700 : 400,
              color: active === t.id ? "#00a7ea" : "#6c757d",
              background: "#ffffff",
              border: "1px solid #CFCFCF",
              borderBottomWidth: 2,
              borderBottomStyle: "solid",
              borderBottomColor: active === t.id ? "#00a7ea" : "transparent",
              cursor: "pointer",
              marginBottom: -2,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
            {t.count !== undefined && (
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: active === t.id ? "#fff" : "#888",
                background: active === t.id ? "#00a7ea" : "#e9ecef",
                borderRadius: 9999,
                padding: "1px 7px",
                lineHeight: "16px",
              }}>
                {t.count}건
              </span>
            )}
          </button>
        ))}
      </div>
      {children(active)}
    </div>
  );
}
