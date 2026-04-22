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
      <div style={{ display: "flex", borderBottom: "2px solid #e0e0e0", marginBottom: 16 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{
              padding: "10px 20px",
              fontSize: 17,
              fontWeight: active === t.id ? 700 : 400,
              color: active === t.id ? "#01ACC8" : "#555",
              background: "transparent",
              border: "none",
              borderBottomWidth: 2,
              borderBottomStyle: "solid",
              borderBottomColor: active === t.id ? "#01ACC8" : "transparent",
              cursor: "pointer",
              marginBottom: -2,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {t.label}
            {t.count !== undefined && (
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: active === t.id ? "#fff" : "#888",
                background: active === t.id ? "#01ACC8" : "#e8e8e8",
                borderRadius: 10,
                padding: "1px 7px",
                lineHeight: "18px",
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
