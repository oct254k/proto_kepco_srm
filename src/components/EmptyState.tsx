import React from "react";

export default function EmptyState({ message = "데이터가 없습니다." }: { message?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "2rem", color: "#6c757d", fontSize: 12 }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
      {message}
    </div>
  );
}
