import React from "react";

export default function EmptyState({ message = "데이터가 없습니다." }: { message?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 0", color: "#888", fontSize: 17 }}>
      <div style={{ fontSize: 35, marginBottom: 8 }}>📭</div>
      {message}
    </div>
  );
}
