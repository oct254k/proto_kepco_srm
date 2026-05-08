"use client";

import React, { useState } from "react";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import SearchForm from "@/components/SearchForm";
import Drawer from "@/components/Drawer";
import Tabs from "@/components/Tabs";
import { MOCK_BIDS, METHOD_LABELS, BID_PARTICIPANTS } from "@/lib/mock/bids";
import type { Bid } from "@/lib/types";

// ── 공고 상세 Drawer (조회 전용) ─────────────────────────────────
function BidDetailDrawer({ bid, open, onClose }: { bid: Bid | null; open: boolean; onClose: () => void }) {
  const participants = bid ? BID_PARTICIPANTS.filter((p) => p.bidId === bid.id) : [];

  return (
    <Drawer open={open} onClose={onClose} title={`입찰공고 상세 — ${bid?.id ?? ""}`} width={620}>
      {bid && (
        <Tabs
          tabs={[
            { id: "info", label: "공고정보" },
            { id: "items", label: "품목목록" },
            { id: "vendors", label: "참여업체현황" },
            { id: "selfcheck", label: "자가심사현황" },
            { id: "history", label: "공고이력" },
          ]}
        >
          {(tab) => (
            <>
              {tab === "info" && (
                <div>
                  <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 6, padding: "8px 12px", marginBottom: 16, fontSize: 15, color: "#92400E" }}>
                    📋 사업담당자는 조회 전용입니다.
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
                    {[
                      { label: "공고번호", value: bid.id },
                      { label: "상태", value: <StatusBadge status={bid.status} /> },
                      { label: "공고명", value: bid.title },
                      { label: "선정방법", value: METHOD_LABELS[bid.method] ?? bid.method },
                      { label: "공고일", value: bid.publishedAt },
                      { label: "마감일", value: bid.deadline },
                      { label: "예정금액", value: `${bid.estAmount.toLocaleString()}원` },
                      { label: "보증금률", value: "입찰 5% / 이행 10%" },
                    ].map((item) => (
                      <div key={item.label} style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                        <div style={{ fontSize: 15, color: "#888", marginBottom: 3 }}>{item.label}</div>
                        <div style={{ fontSize: 17, fontWeight: 500 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab === "items" && (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                  <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                      {["#", "품목명", "규격", "수량", "단위"].map((h) => (
                        <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "태양광 인버터 5kW", spec: "IEC형", qty: 5, unit: "EA" },
                      { name: "태양광 인버터 10kW", spec: "IEC형", qty: 3, unit: "EA" },
                    ].map((item, i) => (
                      <tr key={i}>
                        <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{i + 1}</td>
                        <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0" }}>{item.name}</td>
                        <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{item.spec}</td>
                        <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{item.qty}</td>
                        <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {tab === "vendors" && (
                participants.length === 0 ? (
                  <div style={{ padding: 32, textAlign: "center", color: "#888" }}>참여업체가 없습니다.</div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                    <thead>
                      <tr style={{ background: "#f5f5f5" }}>
                        {["업체명", "투찰금액", "상태"].map((h) => (
                          <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p) => (
                        <tr key={p.id}>
                          <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0" }}>{p.vendorName}</td>
                          <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "right" }}>{p.amount.toLocaleString()}원</td>
                          <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}><StatusBadge status={p.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
              {tab === "selfcheck" && (
                <div>
                  <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 6, padding: "8px 12px", marginBottom: 14, fontSize: 15, color: "#92400E" }}>
                    📋 사업담당자는 조회 전용입니다.
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                    <thead>
                      <tr style={{ background: "#f5f5f5" }}>
                        {["업체명", "심사항목", "제출일", "결과"].map((h) => (
                          <th key={h} style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {participants.length === 0 ? (
                        <tr><td colSpan={4} style={{ padding: 24, textAlign: "center", color: "#888" }}>자가심사 데이터가 없습니다.</td></tr>
                      ) : participants.map((p) => (
                        <tr key={p.id}>
                          <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0" }}>{p.vendorName}</td>
                          <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>적격심사 체크리스트</td>
                          <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>2026-04-20</td>
                          <td style={{ padding: "8px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                            <StatusBadge status="제출완료" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {tab === "history" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { date: bid.publishedAt, event: "공고 게시", user: "이계약" },
                    { date: "2026-04-18", event: "계획 확정", user: "이계약" },
                  ].map((h, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <span style={{ fontSize: 15, color: "#888", minWidth: 90 }}>{h.date}</span>
                      <span style={{ fontSize: 16, color: "#333" }}>{h.event}</span>
                      <span style={{ fontSize: 15, color: "#888", marginLeft: "auto" }}>{h.user}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Tabs>
      )}
    </Drawer>
  );
}

// ── 메인 페이지 ─────────────────────────────────────────────────
export default function BBidsPage() {
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const columns: Column[] = [
    { key: "id", label: "공고번호", width: "130px", align: "center" },
    { key: "title", label: "공고명", align: "left" },
    { key: "method", label: "선정방법", width: "110px", align: "center", render: (val) => METHOD_LABELS[String(val)] ?? String(val) },
    { key: "estAmount", label: "예정금액", width: "130px", align: "right", render: (val) => `${Number(val).toLocaleString()}원` },
    { key: "publishedAt", label: "공고일", width: "100px", align: "center" },
    { key: "deadline", label: "마감일", width: "100px", align: "center" },
    { key: "status", label: "상태", width: "90px", align: "center", render: (val) => <StatusBadge status={String(val)} /> },
  ];

  const handleRowClick = (row: Record<string, unknown>) => {
    setSelectedBid(row as unknown as Bid);
    setDrawerOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <PageHeader title="입찰계획·공고 관리 (조회 전용)" />

      <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 6, padding: "10px 16px", fontSize: 16, color: "#1E40AF" }}>
        ℹ️ 사업담당자는 입찰 목록을 조회만 할 수 있습니다. 계획 등록 및 공고 등록은 계약담당자만 가능합니다.
      </div>

      <SearchForm
        fields={[
          { label: "기간", name: "period", type: "daterange" },
          { label: "상태", name: "status", type: "select", options: [{ label: "공고중", value: "ACTIVE" }, { label: "진행중", value: "IN_PROGRESS" }, { label: "개찰완료", value: "OPENED" }, { label: "마감", value: "CLOSED" }, { label: "낙찰완료", value: "AWARDED" }] },
          { label: "선정방법", name: "method", type: "select", options: Object.entries(METHOD_LABELS).map(([v, l]) => ({ value: v, label: l })) },
          { label: "키워드", name: "keyword", type: "text", placeholder: "공고명 검색" },
        ]}
      />
      <DataTable
        columns={columns}
        data={MOCK_BIDS as unknown as Record<string, unknown>[]}
        sectionLabel="입찰 목록"
        onRowClick={handleRowClick}
      />

      <BidDetailDrawer bid={selectedBid} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
