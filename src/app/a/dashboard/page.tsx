"use client";

import React from "react";
import PageHeader from "@/components/PageHeader";
import { A_SYSTEM_STATS, MOCK_AUDIT_LOGS } from "@/lib/mock/items";

export default function AdminDashboardPage() {
  const cards = [
    { label: "내부 사용자", value: `${A_SYSTEM_STATS.internalUsers} 명` },
    { label: "협력업체", value: `${A_SYSTEM_STATS.vendors} 업체` },
    { label: "진행중 입찰", value: `${A_SYSTEM_STATS.activeBids} 건` },
    { label: "이번달 계약", value: `${A_SYSTEM_STATS.monthlyContracts} 건` },
  ];

  return (
    <div>
      <PageHeader title="관리자 대시보드" showBack={false} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16, marginBottom: 24 }}>
        {cards.map((card) => (
          <div key={card.label} style={{ background: "#FAF7F2", border: "1px solid #e0e0e0", borderRadius: 8, padding: "20px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>{card.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#654024" }}>{card.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20 }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700 }}>최근 시스템 로그</h2>
        <div style={{ display: "grid", gap: 8 }}>
          {MOCK_AUDIT_LOGS.slice(0, 6).map((log) => (
            <div key={log.id} style={{ display: "grid", gridTemplateColumns: "150px 1fr 110px", gap: 12, fontSize: 13, color: "#333", borderBottom: "1px solid #f0f0f0", paddingBottom: 8 }}>
              <span>{log.createdAt}</span>
              <span>{log.action}</span>
              <span style={{ color: "#777" }}>{log.userName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
