"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Drawer from "@/components/Drawer";
import Tabs from "@/components/Tabs";
import { useToast } from "@/components/Toast";
import { V_QUOTE_REQUESTS, V_QUOTE_RESPONSES } from "@/lib/mock/quotes";
import type { Quote } from "@/lib/types";
import type { QuoteResponse } from "@/lib/mock/quotes";

// ─── 견적요청 목록 탭 ───
interface QuoteListTabProps {
  onRowClick: (row: Record<string, unknown>) => void;
}

function QuoteListTab({ onRowClick }: QuoteListTabProps) {
  const columns = [
    { key: "id", label: "요청번호", width: "150px" },
    { key: "title", label: "요청제목", align: "left" as const },
    { key: "deadline", label: "마감일", width: "110px" },
    {
      key: "status",
      label: "나의 상태",
      width: "120px",
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={V_QUOTE_REQUESTS as unknown as Record<string, unknown>[]}
      totalCount={V_QUOTE_REQUESTS.length}
      sectionLabel="수신된 견적요청"
      showExcel={false}
      showCheckbox={false}
      onRowClick={onRowClick}
    />
  );
}

// ─── 견적 작성 탭 ───
interface PriceItem {
  id: number;
  name: string;
  spec: string;
  qty: number;
  unit: string;
  unitPrice: string;
}

function QuoteWriteTab() {
  const toast = useToast();
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [managerName, setManagerName] = useState("홍길동");
  const [managerEmail, setManagerEmail] = useState("hong@vendor.com");
  const [managerTel, setManagerTel] = useState("010-1234-5678");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<PriceItem[]>([
    { id: 1, name: "태양광 인버터 5kW", spec: "IEC형", qty: 5, unit: "EA", unitPrice: "" },
    { id: 2, name: "태양광 인버터 10kW", spec: "IEC형", qty: 3, unit: "EA", unitPrice: "" },
    { id: 3, name: "인버터 설치 부속", spec: "-", qty: 10, unit: "SET", unitPrice: "" },
  ]);
  const [submitted, setSubmitted] = useState(false);

  const updatePrice = (id: number, val: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, unitPrice: val } : it)));
  };

  const getAmount = (item: PriceItem) => {
    const p = parseInt(item.unitPrice.replace(/,/g, ""), 10);
    return isNaN(p) ? 0 : p * item.qty;
  };

  const supplyTotal = items.reduce((acc, it) => acc + getAmount(it), 0);
  const vat = Math.floor(supplyTotal * 0.1);
  const grandTotal = supplyTotal + vat;

  const handleSubmit = () => {
    const allFilled = items.every((it) => it.unitPrice !== "");
    if (!allFilled) {
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      toast.show("견적서가 제출되었습니다. 사업담당자에게 알림이 발송되었습니다.", "success");
    }, 4000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px 10px",
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: 16,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 17,
    fontWeight: 700,
    color: "#222",
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: "1px solid #e0e0e0",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 견적요청 선택 */}
      <div>
        <p style={sectionTitle}>견적요청 선택</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <select
            value={selectedRequestId}
            onChange={(e) => setSelectedRequestId(e.target.value)}
            style={{ ...inputStyle, maxWidth: 360 }}
          >
            <option value="">-- 견적요청 선택 --</option>
            {V_QUOTE_REQUESTS.map((q) => (
              <option key={q.id} value={q.id}>
                {q.id} — {q.title}
              </option>
            ))}
          </select>
          {selectedRequestId && (
            <span style={{ fontSize: 16, color: "#888" }}>
              마감: {V_QUOTE_REQUESTS.find((q) => q.id === selectedRequestId)?.deadline}
            </span>
          )}
        </div>
      </div>

      {/* 요청 정보 (읽기전용) */}
      <div style={{ background: "#f8f9fa", borderRadius: 6, padding: 16 }}>
        <p style={sectionTitle}>요청 정보 (읽기전용)</p>
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 120px 1fr", gap: "6px 16px", fontSize: 16 }}>
          <span style={{ color: "#888" }}>요청자</span><span>김담당 (사업팀)</span>
          <span style={{ color: "#888" }}>마감일</span><span>2026-04-30</span>
          <span style={{ color: "#888" }}>납기희망일</span><span>2026-05-15</span>
          <span style={{ color: "#888" }}>전달사항</span>
          <span style={{ gridColumn: "2 / 5" }}>"2026년 1분기 적용 단가 기준으로 작성 부탁드립니다."</span>
        </div>
      </div>

      {/* 견적 담당자 정보 */}
      <div>
        <p style={sectionTitle}>견적 담당자 정보</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 15, color: "#555", display: "block", marginBottom: 4 }}>
              성명 <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <input value={managerName} onChange={(e) => setManagerName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 15, color: "#555", display: "block", marginBottom: 4 }}>
              이메일 <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <input type="email" value={managerEmail} onChange={(e) => setManagerEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 15, color: "#555", display: "block", marginBottom: 4 }}>
              전화번호 <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <input value={managerTel} onChange={(e) => setManagerTel(e.target.value)} style={inputStyle} />
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <label style={{ fontSize: 15, color: "#555", display: "block", marginBottom: 4 }}>전달사항 (선택, 최대 1000자)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={1000}
            rows={2}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="기타 전달사항을 입력하세요"
          />
        </div>
      </div>

      {/* 품목별 단가 입력 */}
      <div>
        <p style={sectionTitle}>품목별 단가 입력</p>
        <div style={{ overflowX: "auto", border: "1px solid #e0e0e0", borderRadius: 4 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                {["#", "품목명", "규격", "수량", "단위", "단가 (입력)", "금액 (자동)", "납기일"].map((h) => (
                  <th key={h} style={{ padding: "8px 10px", borderBottom: "1px solid #e0e0e0", textAlign: "center", fontWeight: 600, color: "#444", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const amount = getAmount(item);
                return (
                  <tr key={item.id}>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "center" }}>{idx + 1}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>{item.name}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "center" }}>{item.spec}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "right" }}>{item.qty}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "center" }}>{item.unit}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>
                      <input
                        value={item.unitPrice}
                        onChange={(e) => updatePrice(item.id, e.target.value)}
                        placeholder="단가 입력"
                        disabled={submitted}
                        style={{
                          width: "110px",
                          padding: "4px 8px",
                          border: `1px solid ${!item.unitPrice && !submitted ? "#f59e0b" : "#ccc"}`,
                          borderRadius: 3,
                          fontSize: 15,
                          textAlign: "right",
                          fontFamily: "inherit",
                          background: submitted ? "#f5f5f5" : "#fff",
                        }}
                      />
                    </td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "right", fontWeight: 600 }}>
                      {amount > 0 ? `₩${amount.toLocaleString()}` : "-"}
                    </td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>
                      <input
                        type="date"
                        disabled={submitted}
                        style={{ width: "120px", padding: "4px 6px", border: "1px solid #ccc", borderRadius: 3, fontSize: 15, fontFamily: "inherit", background: submitted ? "#f5f5f5" : "#fff" }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: "#f9f9f9" }}>
                <td colSpan={6} style={{ padding: "8px 10px", textAlign: "right", fontSize: 15, color: "#555" }}>공급가 합계</td>
                <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700 }}>₩{supplyTotal.toLocaleString()}</td>
                <td />
              </tr>
              <tr style={{ background: "#f9f9f9" }}>
                <td colSpan={6} style={{ padding: "8px 10px", textAlign: "right", fontSize: 15, color: "#555" }}>부가세 (10%)</td>
                <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700 }}>₩{vat.toLocaleString()}</td>
                <td />
              </tr>
              <tr style={{ background: "#EFF6FF" }}>
                <td colSpan={6} style={{ padding: "10px 10px", textAlign: "right", fontSize: 16, fontWeight: 700, color: "#1E40AF" }}>총합계</td>
                <td style={{ padding: "10px 10px", textAlign: "right", fontWeight: 700, fontSize: 17, color: "#1E40AF" }}>₩{grandTotal.toLocaleString()}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 액션 버튼 */}
      {!submitted ? (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 8 }}>
          <button
            style={{ padding: "8px 20px", border: "1px solid #CFCFCF", borderRadius: 4, background: "#ffffff", color: "#654024", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            임시저장
          </button>
          <button
            style={{ padding: "8px 20px", border: "1px solid #CFCFCF", borderRadius: 4, background: "#ffffff", color: "#654024", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            견적포기
          </button>
          <button
            onClick={handleSubmit}
            style={{ padding: "8px 20px", border: "1px solid #DFE8F0", borderRadius: 4, background: "#654024", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            최종 제출
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: 20, background: "#D1FAE5", borderRadius: 6, color: "#065F46", fontWeight: 600 }}>
          견적서가 제출되었습니다. 4초 후 Toast가 표시됩니다.
        </div>
      )}
    </div>
  );
}

// ─── 견적 현황 탭 ───
function QuoteHistoryTab() {
  const columns = [
    { key: "id", label: "견적서번호", width: "150px" },
    { key: "quoteId", label: "견적요청번호", width: "150px" },
    { key: "title", label: "요청제목", align: "left" as const },
    {
      key: "amount",
      label: "제출금액",
      width: "140px",
      align: "right" as const,
      render: (val: unknown) => `₩${(val as number).toLocaleString()}`,
    },
    { key: "submittedAt", label: "제출일", width: "110px" },
    {
      key: "status",
      label: "상태",
      width: "110px",
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={V_QUOTE_RESPONSES as unknown as Record<string, unknown>[]}
      totalCount={V_QUOTE_RESPONSES.length}
      sectionLabel="제출한 견적 현황"
      showExcel={false}
      showCheckbox={false}
    />
  );
}

// ─── Drawer 상세 ───
interface QuoteDetailDrawerProps {
  quote: Quote | null;
  open: boolean;
  onClose: () => void;
}

function QuoteDetailDrawer({ quote, open, onClose }: QuoteDetailDrawerProps) {
  if (!quote) return null;
  const drawerTabs = [
    { id: "info", label: "요청정보" },
    { id: "items", label: "품목·단가" },
    { id: "attach", label: "첨부" },
    { id: "history", label: "제출이력" },
  ];

  const labelCol: React.CSSProperties = { color: "#888", fontWeight: 500, paddingTop: 2, fontSize: 16 };
  const valueCol: React.CSSProperties = { color: "#222", fontWeight: 500, fontSize: 16 };

  return (
    <Drawer open={open} onClose={onClose} title={`${quote.id} 견적 상세`} width={560}>
      <Tabs tabs={drawerTabs}>
        {(activeTab) => (
          <>
            {activeTab === "info" && (
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 12px" }}>
                <span style={labelCol}>요청번호</span><span style={valueCol}>{quote.id}</span>
                <span style={labelCol}>요청제목</span><span style={valueCol}>{quote.title}</span>
                <span style={labelCol}>마감일</span><span style={valueCol}>{quote.deadline}</span>
                <span style={labelCol}>요청일</span><span style={valueCol}>{quote.requestedAt}</span>
                <span style={labelCol}>상태</span><span><StatusBadge status={quote.status} /></span>
                <span style={labelCol}>전달사항</span><span style={valueCol}>"2026년 1분기 적용 단가 기준으로 작성 부탁드립니다."</span>
              </div>
            )}
            {activeTab === "items" && (
              <div style={{ color: "#888", fontSize: 16 }}>
                <p>제출된 견적서 내역이 없거나 임시저장 상태입니다.</p>
              </div>
            )}
            {activeTab === "attach" && (
              <div>
                <p style={{ fontSize: 16, color: "#888", marginBottom: 12 }}>첨부파일이 없습니다.</p>
                <p style={{ fontSize: 15, color: "#aaa" }}>견적서 제출 시 PDF·Excel 파일을 첨부할 수 있습니다.</p>
              </div>
            )}
            {activeTab === "history" && (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    {["일시", "이벤트", "처리자"].map((h) => (
                      <th key={h} style={{ padding: "8px 10px", borderBottom: "1px solid #e0e0e0", textAlign: "left", fontWeight: 600, color: "#444" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>2026-04-20 14:23</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>임시저장</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>홍길동</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>2026-04-19 09:00</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>견적요청 수신</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>시스템</td>
                  </tr>
                </tbody>
              </table>
            )}
          </>
        )}
      </Tabs>
    </Drawer>
  );
}

// ─── 메인 페이지 ───
export default function VQuotesPage() {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleListRowClick = (row: Record<string, unknown>) => {
    const quote = V_QUOTE_REQUESTS.find((q) => q.id === (row.id as string));
    if (quote) {
      setSelectedQuote(quote);
      setDrawerOpen(true);
    }
  };

  const mainTabs = [
    { id: "list", label: "견적요청 목록" },
    { id: "write", label: "견적작성" },
    { id: "status", label: "견적현황" },
  ];

  return (
    <div>
      <PageHeader title="견적작성 · 현황" />
      <Tabs tabs={mainTabs}>
        {(activeTab) => (
          <>
            {activeTab === "list" && <QuoteListTab onRowClick={handleListRowClick} />}
            {activeTab === "write" && <QuoteWriteTab />}
            {activeTab === "status" && <QuoteHistoryTab />}
          </>
        )}
      </Tabs>

      <QuoteDetailDrawer
        quote={selectedQuote}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
