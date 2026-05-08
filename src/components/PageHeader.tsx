import React from "react";

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <h1 style={{ fontSize: 15, fontWeight: 700, color: "#333", margin: 0, lineHeight: 1.4 }}>{title}</h1>
      {actions && <div style={{ display: "flex", gap: 6, alignItems: "center" }}>{actions}</div>}
    </div>
  );
}
