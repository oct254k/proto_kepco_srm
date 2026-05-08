"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchForm from "@/components/SearchForm";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Drawer from "@/components/Drawer";
import Tabs from "@/components/Tabs";
import QuoteWriteModal from "@/components/QuoteWriteModal";
import { MOCK_QUOTES, QUOTE_STATUS_LABELS } from "@/lib/mock/quotes";
import type { Quote } from "@/lib/types";

// 참고: QuoteWriteModal은 src/components/QuoteWriteModal.tsx 로 이동 (B·C 공유)

// ─── Drawer 상세 ───
interface QuoteDetailDrawerProps {
  quote: Quote | null;
  open: boolean;
  onClose: () => void;
  role: "B" | "C";
}

function QuoteDetailDrawer({ quote, open, onClose, role }: QuoteDetailDrawerProps) {
  if (!quote) return null;

  const drawerTabs = [
    { id: "info", label: "요청정보" },
    { id: "items", label: "품목목록" },
    { id: "compare", label: "견적비교" },
    { id: "history", label: "이력" },
  ];

  const fieldStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: "6px 12px",
    fontSize: 16,
    alignItems: "start",
  };

  const labelCol: React.CSSProperties = { color: "#888", fontWeight: 500, paddingTop: 2 };
  const valueCol: React.CSSProperties = { color: "#222", fontWeight: 500 };

  return (
    <Drawer open={open} onClose={onClose} title={`견적요청 상세 — ${quote.id}`} width={620}>
      <Tabs tabs={drawerTabs}>
        {(activeTab) => (
          <>
            {activeTab === "info" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={fieldStyle}>
                  <span style={labelCol}>요청번호</span><span style={valueCol}>{quote.id}</span>
                  <span style={labelCol}>상태</span><span><StatusBadge status={quote.status} /></span>
                  <span style={labelCol}>요청제목</span><span style={valueCol}>{quote.title}</span>
                  <span style={labelCol}>업체명</span><span style={valueCol}>{quote.vendorName || "-"}</span>
                  <span style={labelCol}>요청일</span><span style={valueCol}>{quote.requestedAt}</span>
                  <span style={labelCol}>마감일</span><span style={valueCol}>{quote.deadline}</span>
                  {quote.amount > 0 && (
                    <>
                      <span style={labelCol}>금액</span><span style={valueCol}>₩{quote.amount.toLocaleString()}</span>
                    </>
                  )}
                  {role === "C" && (
                    <>
                      <span style={labelCol}>PMS 연계</span><span style={valueCol}>PRJ-2026-001</span>
                      <span style={labelCol}>전달사항</span><span style={valueCol}>&quot;단가 기준은 2026년 1분기 적용 단가입니다.&quot;</span>
                      <span style={labelCol}>대상업체</span><span style={valueCol}>(주)대성전기 / (주)한진산업 (2개사)</span>
                    </>
                  )}
                </div>
                {role === "B" && quote.status !== "CLOSED" && quote.status !== "CANCELLED" && (
                  <div style={{ marginTop: 8 }}>
                    <button style={{ padding: "7px 16px", background: "#ffffff", color: "#654024", border: "1px solid #CFCFCF", borderRadius: 4, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                      취소하기
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "items" && (
              <div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                  <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                      {["#", "품목명", "수량", "단위", "규격"].map((h) => (
                        <th key={h} style={{ padding: "8px 12px", borderBottom: "1px solid #e0e0e0", textAlign: "center", fontWeight: 600, color: "#444" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "center" }}>1</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>케이블 트레이 300</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>50</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "center" }}>EA</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>300mm</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "center" }}>2</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>케이블 트레이 450</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>30</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "center" }}>EA</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>450mm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "compare" && (
              <div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                    <thead>
                      <tr style={{ background: "#f5f5f5" }}>
                        {["품목명", "수량", "단위", "(주)대성전기", "(주)한진산업", "최저가"].map((h) => (
                          <th key={h} style={{ padding: "8px 12px", borderBottom: "1px solid #e0e0e0", textAlign: "center", fontWeight: 600, color: "#444", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>케이블 트레이 300</td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>50</td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "center" }}>EA</td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>₩150,000</td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right", background: "#D1FAE5", color: "#065F46", fontWeight: 700 }} aria-label="최저가">₩145,000 ✓</td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right", fontWeight: 600 }}>₩145,000</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>케이블 트레이 450</td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>30</td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "center" }}>EA</td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "center", color: "#aaa" }}>미제출</td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "right" }}>₩195,000</td>
                        <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", textAlign: "center", color: "#aaa" }}>—</td>
                      </tr>
                      <tr style={{ background: "#f9f9f9", fontWeight: 700 }}>
                        <td colSpan={3} style={{ padding: "8px 12px", textAlign: "right" }}>총합계</td>
                        <td style={{ padding: "8px 12px", textAlign: "center", color: "#aaa" }}>—</td>
                        <td style={{ padding: "8px 12px", textAlign: "right" }}>₩13,100,000</td>
                        <td style={{ padding: "8px 12px", textAlign: "center", color: "#aaa" }}>—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {role === "B" && (
                  <div style={{ marginTop: 16, textAlign: "right" }}>
                    <button style={{ padding: "8px 18px", background: "#654024", color: "#fff", border: "1px solid #DFE8F0", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      발주요청 작성으로 이동 →
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                  <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                      {["일시", "이벤트", "처리자", "비고"].map((h) => (
                        <th key={h} style={{ padding: "8px 12px", borderBottom: "1px solid #e0e0e0", textAlign: "left", fontWeight: 600, color: "#444" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>2026-04-22 09:00</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>견적요청 발송</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>김담당</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>2개사 발송</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>2026-04-20 14:30</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>견적요청 임시저장</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>김담당</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Tabs>
    </Drawer>
  );
}

// ─── 메인 페이지 ───
export default function BQuoteRequestsPage() {
  void QUOTE_STATUS_LABELS;
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (row: Record<string, unknown>) => {
    const quote = MOCK_QUOTES.find((q) => q.id === (row.id as string));
    if (quote) {
      setSelectedQuote(quote);
      setDrawerOpen(true);
    }
  };

  const columns = [
    { key: "id", label: "견적요청번호", width: "150px" },
    { key: "title", label: "요청제목", align: "left" as const },
    { key: "deadline", label: "마감일", width: "110px" },
    { key: "vendorName", label: "업체명", align: "left" as const },
    {
      key: "amount",
      label: "금액",
      width: "140px",
      align: "right" as const,
      render: (val: unknown) => {
        const n = val as number;
        return n > 0 ? `₩${n.toLocaleString()}` : "-";
      },
    },
    {
      key: "status",
      label: "상태",
      width: "110px",
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
  ];

  const searchFields = [
    { label: "기간", type: "daterange" as const, name: "period" },
    {
      label: "상태",
      type: "select" as const,
      name: "status",
      options: [
        { label: "접수", value: "SUBMITTED" },
        { label: "진행중", value: "IN_PROGRESS" },
        { label: "완료", value: "ACTIVE" },
        { label: "마감", value: "CLOSED" },
        { label: "취소", value: "CANCELLED" },
      ],
    },
    { label: "요청제목", type: "text" as const, name: "title", placeholder: "요청 제목 검색" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <PageHeader
        title="견적요청 관리"
        actions={
          <button
            onClick={() => setModalOpen(true)}
            style={{ padding: "8px 18px", background: "#654024", color: "#fff", border: "1px solid #DFE8F0", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            + 견적요청 작성
          </button>
        }
      />

      <SearchForm fields={searchFields} onSearch={() => {}} />

      <DataTable
        columns={columns}
        data={MOCK_QUOTES as unknown as Record<string, unknown>[]}
        totalCount={MOCK_QUOTES.length}
        sectionLabel="견적요청 목록"
        showExcel={true}
        showCheckbox={false}
        onRowClick={handleRowClick}
      />

      <QuoteDetailDrawer
        quote={selectedQuote}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        role="B"
      />

      <QuoteWriteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
