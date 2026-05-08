"use client";

import React, { useState } from "react";
import { CheckCircle, RotateCcw, FileText } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SearchForm from "@/components/SearchForm";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Drawer from "@/components/Drawer";
import Tabs from "@/components/Tabs";
import { useToast } from "@/components/Toast";
import { MOCK_ORDERS, METHOD_LABELS, PMS_SYNC_INFO } from "@/lib/mock/orders";
import type { Order } from "@/lib/types";

// ─── 발주계획 등록 탭 콘텐츠 ───
interface PlanTabProps {
  order: Order;
  onConfirm: () => void;
}

function PlanTab({ order, onConfirm }: PlanTabProps) {
  const [bidMethod, setBidMethod] = useState("BID");
  const [planName, setPlanName] = useState(order.title);
  const [planDate, setPlanDate] = useState("2026-04-22");
  const [planAmount, setPlanAmount] = useState(String(order.amount));
  const [note, setNote] = useState("");
  const [syncStatus, setSyncStatus] = useState<"PENDING" | "SYNCED" | "FAILED">("PENDING");
  const [confirmed, setConfirmed] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "6px 10px",
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: 16,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm();
    setTimeout(() => {
      setSyncStatus("SYNCED");
    }, 4000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={{ fontSize: 15, color: "#555", display: "block", marginBottom: 4, fontWeight: 600 }}>발주방법</label>
        <div style={{ display: "flex", gap: 20 }}>
          {[{ val: "BID", label: "입찰" }, { val: "QUOTATION", label: "견적" }, { val: "NEGOTIATION", label: "수의계약" }].map((opt) => (
            <label key={opt.val} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 16, cursor: "pointer" }}>
              <input
                type="radio"
                name="bidMethod"
                value={opt.val}
                checked={bidMethod === opt.val}
                onChange={() => setBidMethod(opt.val)}
                disabled={confirmed}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label style={{ fontSize: 15, color: "#555", display: "block", marginBottom: 4, fontWeight: 600 }}>
          발주계획명 <span style={{ color: "#e53e3e" }}>*</span>
        </label>
        <input value={planName} onChange={(e) => setPlanName(e.target.value)} disabled={confirmed} style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ fontSize: 15, color: "#555", display: "block", marginBottom: 4, fontWeight: 600 }}>
            계획수립일 <span style={{ color: "#e53e3e" }}>*</span>
          </label>
          <input type="date" value={planDate} onChange={(e) => setPlanDate(e.target.value)} disabled={confirmed} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 15, color: "#555", display: "block", marginBottom: 4, fontWeight: 600 }}>
            계획금액 <span style={{ color: "#e53e3e" }}>*</span>
          </label>
          <input value={planAmount} onChange={(e) => setPlanAmount(e.target.value)} disabled={confirmed} style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={{ fontSize: 15, color: "#555", display: "block", marginBottom: 4, fontWeight: 600 }}>비고</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          disabled={confirmed}
          style={{ ...inputStyle, resize: "vertical" }}
          placeholder="비고 사항"
        />
      </div>

      {/* PMS 연동 상태 카드 */}
      <div
        style={{
          border: `1px solid ${syncStatus === "SYNCED" ? "#A7F3D0" : syncStatus === "FAILED" ? "#FECACA" : "#FDE68A"}`,
          borderRadius: 6,
          padding: 14,
          background: syncStatus === "SYNCED" ? "#D1FAE5" : syncStatus === "FAILED" ? "#FEE2E2" : "#FEF3C7",
        }}
        aria-live="polite"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: syncStatus === "SYNCED" ? "#065F46" : syncStatus === "FAILED" ? "#991B1B" : "#92400E" }}>
            PMS_SYNC_STATUS
          </span>
          <span style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 15, opacity: syncStatus === "PENDING" ? 1 : 0.4 }}>● PENDING</span>
            <span style={{ fontSize: 15, opacity: syncStatus === "SYNCED" ? 1 : 0.4 }}>● SYNCED</span>
            <span style={{ fontSize: 15, opacity: syncStatus === "FAILED" ? 1 : 0.4 }}>✗ FAILED</span>
          </span>
        </div>
        <div style={{ fontSize: 15, color: "#555", display: "flex", flexDirection: "column", gap: 4 }}>
          <span>PMS 수신일시: {confirmed ? "2026-04-22 14:05" : "-"}</span>
          <span>PMS 발주ID: {syncStatus === "SYNCED" ? "PMS-ORD-2026-001" : "-"}</span>
          {syncStatus === "FAILED" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span style={{ color: "#991B1B" }}>오류 코드: CONN_TIMEOUT</span>
              <button style={{ padding: "3px 10px", background: "#ffffff", color: "#654024", border: "1px solid #CFCFCF", borderRadius: 3, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                재연동
              </button>
            </div>
          )}
        </div>
      </div>

      {!confirmed ? (
        <div style={{ textAlign: "right" }}>
          <button
            onClick={handleConfirm}
            style={{ padding: "9px 22px", background: "#654024", color: "#fff", border: "1px solid #DFE8F0", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <CheckCircle size={14} />
            발주계획 확정
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: 12, background: "#D1FAE5", borderRadius: 6, color: "#065F46", fontSize: 16, fontWeight: 600 }}>
          {syncStatus === "SYNCED" ? "발주계획이 확정되었습니다. PMS 연동이 완료되었습니다." : "발주계획 확정 완료. PMS 연동 처리 중..."}
        </div>
      )}
    </div>
  );
}

// ─── Drawer 상세 (C 역할) ───
interface OrderDetailDrawerProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onPlanConfirm: () => void;
}

function OrderDetailDrawer({ order, open, onClose, onPlanConfirm }: OrderDetailDrawerProps) {
  if (!order) return null;

  const drawerTabs = [
    { id: "info", label: "요청정보" },
    { id: "items", label: "품목목록" },
    { id: "docs", label: "첨부서류" },
    { id: "history", label: "처리이력" },
    { id: "plan", label: "발주계획 등록" },
  ];

  const labelCol: React.CSSProperties = { color: "#888", fontWeight: 500, paddingTop: 2, fontSize: 16 };
  const valueCol: React.CSSProperties = { color: "#222", fontWeight: 500, fontSize: 16 };

  return (
    <Drawer open={open} onClose={onClose} title={`발주계약요청 상세 — ${order.id}`} width={660}>
      <Tabs tabs={drawerTabs}>
        {(activeTab) => (
          <>
            {activeTab === "info" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 12px" }}>
                  <span style={labelCol}>요청번호</span><span style={valueCol}>{order.id}</span>
                  <span style={labelCol}>상태</span><span><StatusBadge status={order.status} /></span>
                  <span style={labelCol}>요청명</span><span style={valueCol}>{order.title}</span>
                  <span style={labelCol}>선정방법</span><span style={valueCol}>{METHOD_LABELS[order.method] ?? order.method}</span>
                  <span style={labelCol}>요청금액</span><span style={valueCol}>₩{order.amount.toLocaleString()}</span>
                  <span style={labelCol}>담당팀</span><span style={valueCol}>{order.assignee}</span>
                  <span style={labelCol}>요청일</span><span style={valueCol}>{order.requestedAt}</span>
                  <span style={labelCol}>PMS 연계</span><span style={valueCol}>PRJ-2026-001</span>
                  <span style={labelCol}>납기희망일</span><span style={valueCol}>2026-06-30</span>
                  <span style={labelCol}>요청자</span><span style={valueCol}>김담당 (사업팀)</span>
                </div>
                {/* C 역할 액션 버튼 */}
                <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button style={{ padding: "7px 16px", background: "#654024", color: "#fff", border: "1px solid #DFE8F0", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <CheckCircle size={13} />
                    접수처리
                  </button>
                  <button style={{ padding: "7px 16px", background: "#ffffff", color: "#654024", border: "1px solid #CFCFCF", borderRadius: 4, fontSize: 12, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <FileText size={13} />
                    자료보완요청
                  </button>
                  <button style={{ padding: "7px 16px", background: "#ffffff", color: "#B91C1C", border: "1px solid #FECACA", borderRadius: 4, fontSize: 12, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <RotateCcw size={13} />
                    반려
                  </button>
                </div>
              </div>
            )}

            {activeTab === "items" && (
              <div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                  <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                      {["#", "품목명", "수량", "단위", "단가", "금액"].map((h) => (
                        <th key={h} style={{ padding: "8px 10px", borderBottom: "1px solid #e0e0e0", textAlign: "center", fontWeight: 600, color: "#444" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "center" }}>1</td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>{order.title.replace(" 발주", "")}</td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "right" }}>1</td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "center" }}>SET</td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "right" }}>₩{order.amount.toLocaleString()}</td>
                      <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", textAlign: "right" }}>₩{order.amount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "docs" && (
              <div style={{ color: "#888", fontSize: 16 }}>
                <p>등록된 첨부서류가 없습니다.</p>
              </div>
            )}

            {activeTab === "history" && (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    {["일시", "이벤트", "처리자", "비고"].map((h) => (
                      <th key={h} style={{ padding: "8px 10px", borderBottom: "1px solid #e0e0e0", textAlign: "left", fontWeight: 600, color: "#444" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>2026-04-22 10:00</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>발주요청 제출</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>김담당</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>-</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>2026-04-22 10:05</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>접수 완료</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>이계약 (계약1팀)</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #eee" }}>-</td>
                  </tr>
                </tbody>
              </table>
            )}

            {activeTab === "plan" && (
              <PlanTab order={order} onConfirm={onPlanConfirm} />
            )}
          </>
        )}
      </Tabs>
    </Drawer>
  );
}

// ─── 메인 페이지 ───
export default function COrdersPage() {
  const toast = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleRowClick = (row: Record<string, unknown>) => {
    const order = MOCK_ORDERS.find((o) => o.id === (row.id as string));
    if (order) {
      setSelectedOrder(order);
      setDrawerOpen(true);
    }
  };

  const handlePlanConfirm = () => {
    setTimeout(() => {
      toast.show("발주계획이 확정되었습니다. PMS 연동이 완료되었습니다.", "success");
    }, 4000);
  };

  const columns = [
    { key: "id", label: "발주번호", width: "150px" },
    { key: "title", label: "요청명", align: "left" as const },
    {
      key: "method",
      label: "선정방법",
      width: "110px",
      render: (val: unknown) => METHOD_LABELS[val as string] ?? (val as string),
    },
    {
      key: "amount",
      label: "금액",
      width: "140px",
      align: "right" as const,
      render: (val: unknown) => `₩${(val as number).toLocaleString()}`,
    },
    { key: "assignee", label: "담당팀", width: "100px" },
    {
      key: "status",
      label: "상태",
      width: "110px",
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: "_action",
      label: "처리",
      width: "120px",
      render: (_val: unknown, row: Record<string, unknown>) => (
        row.status === "SUBMITTED" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.show(`${row.id as string} 발주계획 확정 처리`, "info");
            }}
            style={{ padding: "4px 10px", background: "#654024", color: "#fff", border: "1px solid #DFE8F0", borderRadius: 3, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <CheckCircle size={12} />
            계획확정
          </button>
        ) : null
      ),
    },
  ];

  const searchFields = [
    { label: "기간", type: "daterange" as const, name: "period", required: true },
    {
      label: "진행상태",
      type: "select" as const,
      name: "status",
      options: [
        { label: "접수", value: "SUBMITTED" },
        { label: "진행중", value: "IN_PROGRESS" },
        { label: "완료", value: "CLOSED" },
        { label: "취소", value: "CANCELLED" },
      ],
    },
    {
      label: "체크리스트",
      type: "select" as const,
      name: "checklist",
      options: [
        { label: "작성중", value: "DRAFTING" },
        { label: "완료", value: "DONE" },
      ],
    },
    { label: "키워드", type: "text" as const, name: "keyword" },
  ];

  return (
    <div>
      <PageHeader title="발주계약 관리" />

      <SearchForm fields={searchFields} onSearch={() => {}} />

      <DataTable
        columns={columns}
        data={MOCK_ORDERS as unknown as Record<string, unknown>[]}
        totalCount={MOCK_ORDERS.length}
        sectionLabel="발주계약요청 목록"
        showExcel={true}
        showCheckbox={true}
        onRowClick={handleRowClick}
        actionButton={
          <button
            type="button"
            style={{
              background: "#654024",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              height: 36,
              padding: "0 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            체크리스트 작성
          </button>
        }
      />

      <OrderDetailDrawer
        order={selectedOrder}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onPlanConfirm={handlePlanConfirm}
      />
    </div>
  );
}
