"use client";

import React, { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import SearchForm from "@/components/SearchForm";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Drawer from "@/components/Drawer";
import Tabs from "@/components/Tabs";
import StatusGuide, { type StatusGuideSection } from "@/components/StatusGuide";
import OrderWriteModal from "@/components/OrderWriteModal";
import { METHOD_LABELS, MOCK_ORDERS, PMS_SYNC_INFO } from "@/lib/mock/orders";
import type { Order } from "@/lib/types";

const ORDER_STATUS_GUIDE: StatusGuideSection[] = [
  {
    title: "발주계약요청 상태",
    description: "사업담당자가 직접 수정 가능한 시점과 계약담당자 접수 이후 잠금 시점을 구분합니다.",
    items: [
      {
        code: "DRAFT",
        meaning: "PMS 수주계약을 선택해 발주계약요청 초안을 작성하는 단계입니다.",
        owner: "사업담당자",
        actions: "수정, 임시저장, 취소",
        next: "제출 시 접수 상태로 전환",
        limit: "아직 계약담당자 처리 전이므로 외부 공개 없음",
      },
      {
        code: "RECEIVED",
        meaning: "계약담당자가 발주계약요청을 접수해 검토 중입니다.",
        owner: "계약담당자",
        actions: "검토, 보완요청, 반려, 입찰계획 전환",
        next: "입찰계획 등록 또는 반려",
        limit: "사업담당자는 더 이상 본문 수정 불가",
      },
      {
        code: "BID_OPEN",
        label: "투찰중",
        meaning: "입찰계획이 등록되어 협력업체 투찰이 진행 중인 상태입니다.",
        owner: "계약담당자, 협력업체",
        actions: "입찰 현황 조회",
        next: "개찰완료",
        limit: "사업담당자는 발주요청 내용을 직접 수정할 수 없음",
      },
      {
        code: "OPENED",
        meaning: "개찰이 완료되어 낙찰관리 단계로 넘어간 상태입니다.",
        owner: "계약담당자",
        actions: "낙찰관리 연계 확인",
        next: "계약 생성",
        limit: "기존 발주요청은 읽기 전용",
      },
      {
        code: "CANCELLED",
        meaning: "초안 단계에서 취소되었거나 반려 후 종료된 상태입니다.",
        owner: "사업담당자 또는 계약담당자",
        actions: "이력 확인",
        next: "없음",
        limit: "재사용 불가, 신규 요청 재작성 필요",
      },
    ],
  },
];

// PMS_PROJECTS, METHOD_INFO, OrderWriteModal은 src/components/OrderWriteModal.tsx 로 이동 (B·C 공유)

function fmtCurrency(value: number) {
  return `₩${value.toLocaleString()}`;
}


function OrderDetailDrawer({
  order,
  open,
  onClose,
}: {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!order) return null;

  const statusMessage = order.editableByRequester
    ? "초안 상태라 사업담당자가 수정/취소할 수 있습니다."
    : "접수 이후 상태라 사업담당자는 읽기 전용으로만 확인할 수 있습니다.";

  return (
    <Drawer open={open} onClose={onClose} title={`발주계약요청 상세 — ${order.id}`} width={700}>
      <Tabs tabs={[{ id: "info", label: "요청정보" }, { id: "items", label: "품목목록" }, { id: "history", label: "처리이력" }]}>
        {(activeTab) => (
          <>
            {activeTab === "info" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div
                  style={{
                    background: order.editableByRequester ? "#FEF3C7" : "#EFF6FF",
                    border: `1px solid ${order.editableByRequester ? "#FDE68A" : "#BFDBFE"}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                    fontSize: 15,
                    color: order.editableByRequester ? "#92400E" : "#1D4ED8",
                  }}
                >
                  {statusMessage}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "8px 12px" }}>
                  <span style={{ color: "#64748B" }}>요청번호</span>
                  <strong>{order.id}</strong>
                  <span style={{ color: "#64748B" }}>상태</span>
                  <div><StatusBadge status={order.status} /></div>
                  <span style={{ color: "#64748B" }}>요청명</span>
                  <strong>{order.title}</strong>
                  <span style={{ color: "#64748B" }}>선정방법</span>
                  <strong>{METHOD_LABELS[order.method] ?? order.method}</strong>
                  <span style={{ color: "#64748B" }}>요청금액</span>
                  <strong>{fmtCurrency(order.amount)}</strong>
                  <span style={{ color: "#64748B" }}>PMS 수주계약</span>
                  <strong>{order.pmsProjectId} · {order.pmsProjectName}</strong>
                  <span style={{ color: "#64748B" }}>요청일</span>
                  <strong>{order.requestedAt}</strong>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    disabled={!order.editableByRequester}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 6,
                      border: "1px solid #CBD5E1",
                      background: order.editableByRequester ? "#fff" : "#F8FAFC",
                      color: order.editableByRequester ? "#334155" : "#94A3B8",
                      cursor: order.editableByRequester ? "pointer" : "not-allowed",
                      fontFamily: "inherit",
                    }}
                  >
                    수정
                  </button>
                  <button
                    disabled={!order.canCancel}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 6,
                      border: "1px solid #FCA5A5",
                      background: order.canCancel ? "#FEF2F2" : "#FFF1F2",
                      color: order.canCancel ? "#B91C1C" : "#FDA4AF",
                      cursor: order.canCancel ? "pointer" : "not-allowed",
                      fontFamily: "inherit",
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
            {activeTab === "items" && (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["#", "품목명", "수량", "단위", "단가", "금액"].map((header) => (
                      <th key={header} style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0", textAlign: "center" }}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0", textAlign: "center" }}>1</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0" }}>{order.title}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0", textAlign: "right" }}>1</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0", textAlign: "center" }}>식</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0", textAlign: "right" }}>{fmtCurrency(order.amount)}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0", textAlign: "right" }}>{fmtCurrency(order.amount)}</td>
                  </tr>
                </tbody>
              </table>
            )}
            {activeTab === "history" && (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["일시", "이벤트", "처리자"].map((header) => (
                      <th key={header} style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0", textAlign: "left" }}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0" }}>{order.requestedAt} 10:00</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0" }}>{order.status === "DRAFT" ? "PMS 수주계약 선택 후 초안 저장" : "발주요청 제출 및 계약담당자 접수"}</td>
                    <td style={{ padding: "8px 10px", borderBottom: "1px solid #E2E8F0" }}>김사업</td>
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

export default function BOrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const searchFields = [
    { label: "기간", type: "daterange" as const, name: "period" },
    {
      label: "상태",
      type: "select" as const,
      name: "status",
      options: [
        { label: "초안", value: "DRAFT" },
        { label: "접수", value: "RECEIVED" },
        { label: "투찰중", value: "BID_OPEN" },
        { label: "개찰완료", value: "OPENED" },
        { label: "취소", value: "CANCELLED" },
      ],
    },
    {
      label: "선정방법",
      type: "select" as const,
      name: "method",
      options: Object.entries(METHOD_LABELS).map(([value, label]) => ({ label, value })),
    },
    { label: "키워드", type: "text" as const, name: "keyword", placeholder: "발주명 검색" },
  ];

  const columns = useMemo(
    () => [
      { key: "id", label: "발주번호", width: "130px", align: "center" as const },
      { key: "title", label: "요청명", align: "left" as const },
      {
        key: "pmsProjectId",
        label: "PMS 수주계약",
        width: "180px",
        align: "center" as const,
        render: (_value: unknown, row: Record<string, unknown>) => `${String(row.pmsProjectId)} · ${String(row.pmsProjectName)}`,
      },
      {
        key: "method",
        label: "선정방법",
        width: "100px",
        align: "center" as const,
        render: (value: unknown) => METHOD_LABELS[String(value)] ?? String(value),
      },
      {
        key: "amount",
        label: "금액",
        width: "140px",
        align: "right" as const,
        render: (value: unknown) => fmtCurrency(Number(value)),
      },
      {
        key: "status",
        label: "상태",
        width: "110px",
        align: "center" as const,
        render: (value: unknown) => <StatusBadge status={String(value)} />,
      },
    ],
    [],
  );

  function handleRowClick(row: Record<string, unknown>) {
    const found = orders.find((item) => item.id === row.id);
    if (found) {
      setSelectedOrder(found);
      setDrawerOpen(true);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <PageHeader
        title="발주계약요청 관리"
        actions={
          <>
            <StatusGuide screenName="SCR-S-05 발주계약요청" sections={ORDER_STATUS_GUIDE} />
            <button
              onClick={() => setModalOpen(true)}
              style={{ padding: "8px 18px", background: "#654024", color: "#fff", border: "1px solid #DFE8F0", borderRadius: 6, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >
              + 발주계약요청 작성
            </button>
          </>
        }
      />

      <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "14px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1E40AF" }}>PMS 연동 상태: {PMS_SYNC_INFO.status}</span>
        </div>
        <span style={{ fontSize: 15, color: "#334155" }}>마지막 동기화: {PMS_SYNC_INFO.lastSync}</span>
        <span style={{ fontSize: 15, color: "#334155" }}>PMS 기반 작성 대기 건수: {PMS_SYNC_INFO.pendingCount}건</span>
      </div>

      <SearchForm fields={searchFields} onSearch={() => {}} />

      <DataTable
        columns={columns}
        data={orders as unknown as Record<string, unknown>[]}
        totalCount={orders.length}
        sectionLabel="발주계약요청 목록"
        showExcel
        showCheckbox={false}
        onRowClick={handleRowClick}
      />

      <OrderDetailDrawer order={selectedOrder} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <OrderWriteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={(draft) => setOrders((prev) => [draft, ...prev])}
      />
    </div>
  );
}
