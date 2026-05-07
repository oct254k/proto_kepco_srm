"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import Tabs from "@/components/Tabs";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Drawer from "@/components/Drawer";
import Modal from "@/components/Modal";
import SearchForm from "@/components/SearchForm";
import { useToast } from "@/components/Toast";
import {
  C_ORDER_PLANS,
  C_ORDER_PLAN_HISTORIES,
  C_ORDER_PLAN_SUMMARY,
  C_PROFILE,
  type OrderPlan,
} from "@/lib/mock/users";

// ─── 유틸 ─────────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`;
  if (n >= 10_000) return `${(n / 10_000).toFixed(0)}만`;
  return n.toLocaleString();
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "대기",
  ACCEPTED: "수락",
  IN_PROGRESS: "진행중",
  AWARDED: "낙찰",
  CONTRACTED: "계약완료",
  CANCELLED: "취소",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#FEF3C7", text: "#92400E" },
  ACCEPTED: { bg: "#DBEAFE", text: "#1E40AF" },
  IN_PROGRESS: { bg: "#EDE9FE", text: "#5B21B6" },
  AWARDED: { bg: "#D1FAE5", text: "#065F46" },
  CONTRACTED: { bg: "#A7F3D0", text: "#047857" },
  CANCELLED: { bg: "#F3F4F6", text: "#6B7280" },
};

// ─── StatusChipFilter ─────────────────────────────────────────────────────────
function StatusChipFilter({
  selected,
  onChange,
  summary,
}: {
  selected: string | null;
  onChange: (v: string | null) => void;
  summary: Record<string, number>;
}) {
  const chips = [
    { key: "PENDING", label: "PENDING" },
    { key: "ACCEPTED", label: "ACCEPTED" },
    { key: "IN_PROGRESS", label: "IN_PROGRESS" },
    { key: "AWARDED", label: "AWARDED" },
    { key: "CONTRACTED", label: "CONTRACTED" },
  ];

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
      {chips.map((c) => {
        const active = selected === c.key;
        const col = STATUS_COLORS[c.key] ?? { bg: "#E5E7EB", text: "#374151" };
        return (
          <button
            key={c.key}
            onClick={() => onChange(active ? null : c.key)}
            style={{
              minWidth: 110,
              padding: "10px 14px",
              borderRadius: 8,
              border: active ? "1px solid #DFE8F0" : "1px solid #CFCFCF",
              background: active ? "#654024" : "#ffffff",
              color: active ? "#ffffff" : "#654024",
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "center",
              boxShadow: active ? "0 0 0 1px #DFE8F0" : "none",
            }}
          >
            <div style={{ fontSize: 13, color: col.text, fontWeight: 700, marginBottom: 4 }}>
              {c.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
              {summary[c.key] ?? 0}
              <span style={{ fontSize: 14, color: "#6B7280", marginLeft: 2 }}>건</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── 발주 Drawer ──────────────────────────────────────────────────────────────
function OrderDrawer({
  order,
  onClose,
  onAccept,
  onReject,
  onPmsResync,
}: {
  order: OrderPlan | null;
  onClose: () => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onPmsResync: (id: string) => void;
}) {
  const [drawerTab, setDrawerTab] = useState("info");

  if (!order) return null;

  const histories = C_ORDER_PLAN_HISTORIES[order.id] ?? [];
  const isPending = order.status === "PENDING";

  const drawerTabs = [
    { id: "info", label: "발주정보" },
    { id: "history", label: "처리이력" },
    { id: "bid", label: "연계공고" },
  ];

  return (
    <Drawer
      open={!!order}
      onClose={onClose}
      title={`발주 상세 : ${order.id}`}
      width={560}
    >
      {/* 수락·거절 버튼 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => onAccept(order.id)}
          disabled={!isPending}
          style={{
            padding: "7px 20px",
            background: isPending ? "#00a7ea" : "#E5E7EB",
            color: isPending ? "#fff" : "#9CA3AF",
            border: "none",
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 600,
            cursor: isPending ? "pointer" : "not-allowed",
            fontFamily: "inherit",
          }}
        >
          수락
        </button>
        <button
          onClick={() => onReject(order.id)}
          disabled={!isPending}
          style={{
            padding: "7px 20px",
            background: "#FAF7F2",
            color: isPending ? "#EF4444" : "#9CA3AF",
            border: isPending ? "1px solid #EF4444" : "1px solid #E5E7EB",
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 600,
            cursor: isPending ? "pointer" : "not-allowed",
            fontFamily: "inherit",
          }}
        >
          거절
        </button>
      </div>

      {/* 탭 */}
      <div style={{ display: "flex", borderBottom: "2px solid #e5e7eb", marginBottom: 20 }}>
        {drawerTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setDrawerTab(t.id)}
            style={{
              padding: "10px 20px",
              border: "1px solid #CFCFCF",
              background: "#ffffff",
              borderBottom: drawerTab === t.id ? "2px solid #00a7ea" : "2px solid transparent",
              color: drawerTab === t.id ? "#00a7ea" : "#6B7280",
              fontWeight: drawerTab === t.id ? 700 : 400,
              fontSize: 16,
              cursor: "pointer",
              fontFamily: "inherit",
              marginBottom: -2,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 발주정보 탭 */}
      {drawerTab === "info" && (
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, marginBottom: 16 }}>
            <tbody>
              {[
                ["발주번호", order.id],
                ["상태", null],
                ["사업명", order.title],
                ["사업소", order.site],
                ["품목대분류", order.category],
                ["예산금액", `${fmt(order.amount)}원`],
                ["요청일자", order.requestedAt],
                ["요청자", order.requester],
              ].map(([label, value]) => (
                <tr key={String(label)}>
                  <th
                    style={{
                      padding: "9px 12px",
                      background: "#f9fafb",
                      borderBottom: "1px solid #e5e7eb",
                      borderRight: "1px solid #e5e7eb",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#374151",
                      width: 120,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </th>
                  <td style={{ padding: "9px 12px", borderBottom: "1px solid #e5e7eb", color: "#111827" }}>
                    {label === "상태" ? <StatusBadge status={order.status} /> : String(value ?? "")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PMS 연동 상태 */}
          <div
            style={{
              padding: "12px 14px",
              background: order.pmsSync === "FAILED" ? "#FEF2F2" : order.pmsSync === "SYNCED" ? "#F0FDF4" : "#FFFBEB",
              border: `1px solid ${order.pmsSync === "FAILED" ? "#FECACA" : order.pmsSync === "SYNCED" ? "#BBF7D0" : "#FDE68A"}`,
              borderRadius: 6,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>PMS 연동 상태: </span>
              <StatusBadge status={order.pmsSync} />
              {order.pmsSync === "FAILED" && (
                <span style={{ fontSize: 14, color: "#EF4444", marginLeft: 8 }}>— 재동기화가 필요합니다</span>
              )}
            </div>
            {order.pmsSync === "FAILED" && (
              <button
                onClick={() => onPmsResync(order.id)}
                style={{
                  padding: "5px 14px",
                  background: "#ffffff",
                  color: "#654024",
                  border: "1px solid #CFCFCF",
                  borderRadius: 4,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                PMS 재동기화
              </button>
            )}
          </div>

          <div style={{ padding: "12px 14px", background: "#f9fafb", borderRadius: 6, fontSize: 15, color: "#374151" }}>
            <p style={{ margin: "0 0 6px", fontWeight: 600 }}>발주 상세 설명:</p>
            <p style={{ margin: 0 }}>{order.description}</p>
          </div>
          <div style={{ marginTop: 14, fontSize: 15, color: "#9CA3AF" }}>
            <span>📎 발주요청서.pdf</span>
            <span style={{ marginLeft: 14 }}>📎 도면_v1.dwg</span>
          </div>
          {!isPending && (
            <p style={{ marginTop: 12, fontSize: 14, color: "#9CA3AF" }}>
              ※ PENDING 상태에서만 수락·거절이 가능합니다.
            </p>
          )}
        </div>
      )}

      {/* 처리이력 탭 */}
      {drawerTab === "history" && (
        <div style={{ position: "relative", paddingLeft: 28 }}>
          <div
            style={{
              position: "absolute",
              left: 8,
              top: 4,
              bottom: 4,
              width: 2,
              background: "#e5e7eb",
            }}
          />
          {histories.length === 0 && (
            <p style={{ color: "#9CA3AF", fontSize: 15 }}>처리이력이 없습니다.</p>
          )}
          {histories.map((h, i) => (
            <div key={i} style={{ position: "relative", marginBottom: i < histories.length - 1 ? 20 : 0 }}>
              <div
                style={{
                  position: "absolute",
                  left: -22,
                  top: 4,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#654024",
                  border: "2px solid #fff",
                  boxShadow: "0 0 0 2px #00a7ea",
                }}
              />
              <div
                style={{
                  background: "#FAF7F2",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  padding: "10px 14px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#00a7ea", background: "#f0f9ff", padding: "1px 8px", borderRadius: 999 }}>
                    {h.from} → {h.to}
                  </span>
                  <span style={{ fontSize: 14, color: "#9CA3AF" }}>{h.date}</span>
                </div>
                <span style={{ fontSize: 15, color: "#374151" }}>{h.actor}</span>
                {h.note && <span style={{ fontSize: 14, color: "#6B7280", marginLeft: 8 }}>— {h.note}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 연계공고 탭 */}
      {drawerTab === "bid" && (
        <div>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 12 }}>연계된 입찰 공고</p>
          <div
            style={{
              padding: "16px",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              color: "#6B7280",
              fontSize: 15,
              textAlign: "center",
            }}
          >
            아직 입찰 공고가 연계되지 않았습니다.
          </div>
          <p style={{ marginTop: 10, fontSize: 14, color: "#9CA3AF" }}>
            ※ 발주가 수락(ACCEPTED)된 후 입찰계획이 수립되면 공고가 연계됩니다.
          </p>
        </div>
      )}
    </Drawer>
  );
}

// ─── 입찰현황 탭 ──────────────────────────────────────────────────────────────
function BidStatusTab() {
  const { show } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<OrderPlan | null>(null);
  const [chipFilter, setChipFilter] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [acceptTarget, setAcceptTarget] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [orders, setOrders] = useState<OrderPlan[]>(C_ORDER_PLANS);

  const filtered = orders.filter((o) => {
    if (chipFilter && o.status !== chipFilter) return false;
    if (keyword && !o.title.includes(keyword) && !o.id.includes(keyword)) return false;
    return true;
  });

  const summary = {
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    ACCEPTED: orders.filter((o) => o.status === "ACCEPTED").length,
    IN_PROGRESS: orders.filter((o) => o.status === "IN_PROGRESS").length,
    AWARDED: orders.filter((o) => o.status === "AWARDED").length,
    CONTRACTED: orders.filter((o) => o.status === "CONTRACTED").length,
  };

  const columns = [
    { key: "id", label: "발주번호", width: "150px" },
    { key: "title", label: "사업명", align: "left" as const },
    { key: "site", label: "사업소", width: "90px" },
    { key: "category", label: "품목", width: "110px" },
    {
      key: "status",
      label: "상태",
      width: "110px",
      render: (v: unknown) => <StatusBadge status={String(v)} />,
    },
    { key: "requestedAt", label: "요청일", width: "100px" },
  ];

  const handleAccept = (id: string) => {
    setAcceptTarget(null);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "ACCEPTED" as const, pmsSync: "PENDING" as const } : o)));
    if (selectedOrder?.id === id) setSelectedOrder((p) => p ? { ...p, status: "ACCEPTED", pmsSync: "PENDING" } : null);
    setTimeout(() => show("발주가 수락되었습니다. 사업담당자에게 알림이 발송되었습니다.", "info"), 4000);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      setRejectError("거절 사유를 입력해 주세요 (최대 500자)");
      return;
    }
    const id = rejectTarget!;
    setRejectTarget(null);
    setRejectReason("");
    setRejectError("");
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "CANCELLED" as const } : o)));
    if (selectedOrder?.id === id) setSelectedOrder((p) => p ? { ...p, status: "CANCELLED" } : null);
    setTimeout(() => show("발주가 거절되었습니다. 사업담당자에게 알림이 발송되었습니다.", "info"), 4000);
  };

  const handlePmsResync = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, pmsSync: "PENDING" as const } : o)));
    if (selectedOrder?.id === id) setSelectedOrder((p) => p ? { ...p, pmsSync: "PENDING" } : null);
    setTimeout(() => show("PMS 연동이 완료되었습니다.", "success"), 4000);
  };

  return (
    <div>
      <StatusChipFilter selected={chipFilter} onChange={setChipFilter} summary={summary} />

      <SearchForm
        fields={[
          { name: "keyword", label: "발주번호·사업명", type: "text" },
          {
            name: "status",
            label: "상태",
            type: "select",
            options: [
              { value: "", label: "전체" },
              ...Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l })),
            ],
          },
          { name: "period", label: "요청일", type: "daterange" },
        ]}
        onSearch={(values) => {
          setKeyword(values.keyword ?? "");
          setChipFilter((values.status as string) || null);
        }}
      />

      <DataTable
        columns={columns}
        data={filtered as unknown as Record<string, unknown>[]}
        sectionLabel="발주요청 목록"
        showExcel
        showCheckbox={false}
        totalCount={filtered.length}
        onRowClick={(row) => setSelectedOrder(orders.find((o) => o.id === row.id) ?? null)}
        notice="행을 클릭하면 발주 상세를 확인하고 수락·거절할 수 있습니다."
      />

      <OrderDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAccept={(id) => { setSelectedOrder(null); setAcceptTarget(id); }}
        onReject={(id) => { setRejectTarget(id); }}
        onPmsResync={handlePmsResync}
      />

      {/* 수락 확인 Modal */}
      <Modal
        open={!!acceptTarget}
        onClose={() => setAcceptTarget(null)}
        title="발주 수락 확인"
        width={480}
        footer={
          <>
            <button
              onClick={() => setAcceptTarget(null)}
              style={{ padding: "7px 20px", background: "#ffffff", color: "#654024", border: "1px solid #CFCFCF", borderRadius: 4, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
            >
              취소
            </button>
            <button
              onClick={() => handleAccept(acceptTarget!)}
              style={{ padding: "7px 20px", background: "#654024", color: "#fff", border: "1px solid #DFE8F0", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              수락 확정
            </button>
          </>
        }
      >
        <p style={{ fontSize: 16, color: "#374151", margin: 0 }}>
          발주 <strong>{acceptTarget}</strong>을(를) 수락 처리하시겠습니까?
        </p>
        <p style={{ fontSize: 15, color: "#6B7280", marginTop: 8 }}>
          수락 후 PMS 자동 동기화가 진행됩니다. 사업담당자에게 알림이 발송됩니다.
        </p>
      </Modal>

      {/* 거절 사유 Modal */}
      <Modal
        open={!!rejectTarget}
        onClose={() => { setRejectTarget(null); setRejectReason(""); setRejectError(""); }}
        title="발주 거절 사유 입력"
        width={480}
        footer={
          <>
            <button
              onClick={() => { setRejectTarget(null); setRejectReason(""); setRejectError(""); }}
              style={{ padding: "7px 20px", background: "#ffffff", color: "#654024", border: "1px solid #CFCFCF", borderRadius: 4, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
            >
              취소
            </button>
            <button
              onClick={handleReject}
              style={{ padding: "7px 20px", background: "#ffffff", color: "#654024", border: "1px solid #CFCFCF", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              거절 확정
            </button>
          </>
        }
      >
        <div>
          <p style={{ margin: "0 0 12px", fontSize: 15, color: "#374151" }}>
            발주번호: <strong>{rejectTarget}</strong>
          </p>
          <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 6 }}>
            거절 사유 <span style={{ color: "#EF4444" }}>*</span>
            <span style={{ fontSize: 14, color: "#9CA3AF", fontWeight: 400, marginLeft: 6 }}>최대 500자</span>
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => { setRejectReason(e.target.value.slice(0, 500)); setRejectError(""); }}
            rows={4}
            placeholder="거절 사유를 입력하세요."
            style={{
              width: "100%",
              border: rejectError ? "1px solid #EF4444" : "1px solid #d1d5db",
              borderRadius: 4,
              padding: "8px 12px",
              fontSize: 15,
              resize: "vertical",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {rejectError ? (
              <span style={{ fontSize: 14, color: "#EF4444" }}>{rejectError}</span>
            ) : (
              <span />
            )}
            <span style={{ fontSize: 14, color: "#9CA3AF" }}>{rejectReason.length} / 500자</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── 기업정보 탭 ──────────────────────────────────────────────────────────────
function CompanyInfoTab() {
  const { show } = useToast();
  const [notif, setNotif] = useState({
    newOrder: true,
    bidResult: true,
    contractSign: true,
    pmsFail: false,
  });

  const toggles: { key: keyof typeof notif; label: string }[] = [
    { key: "newOrder", label: "발주 신규 배정 알림" },
    { key: "bidResult", label: "입찰 결과 알림" },
    { key: "contractSign", label: "계약 체결 알림" },
    { key: "pmsFail", label: "PMS 연동 실패 알림" },
  ];

  return (
    <div>
      {/* 개인정보 (ReadOnly) */}
      <div
        style={{
          background: "#FAF7F2",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "20px 24px",
          marginBottom: 20,
        }}
      >
        <p style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 700, color: "#111827" }}>
          개인 정보 (그룹웨어 SSO 연동 — 읽기 전용)
        </p>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#6366F1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 28,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {C_PROFILE.name.charAt(0)}
          </div>
          <table style={{ borderCollapse: "collapse", fontSize: 15 }}>
            <tbody>
              {[
                ["성명", C_PROFILE.name],
                ["사번", C_PROFILE.empNo],
                ["부서", C_PROFILE.dept],
                ["직급", C_PROFILE.position],
                ["이메일", `${C_PROFILE.email} (그룹웨어 연동)`],
                ["전화번호", C_PROFILE.tel],
                ["역할", "C (계약담당자)"],
                ["계정상태", null],
                ["최종로그인", C_PROFILE.lastLogin],
              ].map(([label, value]) => (
                <tr key={String(label)}>
                  <td style={{ padding: "5px 16px 5px 0", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>
                    {label}
                  </td>
                  <td style={{ padding: "5px 0", color: "#111827" }}>
                    {label === "계정상태" ? <StatusBadge status={C_PROFILE.accountStatus} /> : String(value ?? "")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            marginTop: 16,
            padding: "10px 14px",
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 6,
            fontSize: 14,
            color: "#92400E",
          }}
        >
          ⚠ 개인정보는 그룹웨어 시스템과 연동되며 SRM에서 직접 수정할 수 없습니다.
          정보 변경이 필요한 경우 그룹웨어(인사시스템)를 이용하십시오.
        </div>
      </div>

      {/* 알림 설정 */}
      <div
        style={{
          background: "#FAF7F2",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "20px 24px",
        }}
      >
        <p style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 700, color: "#111827" }}>
          알림 설정
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {toggles.map((t) => (
            <div key={t.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 16, color: "#374151" }}>{t.label}</span>
              <button
                onClick={() => setNotif((prev) => ({ ...prev, [t.key]: !prev[t.key] }))}
                style={{
                  width: 52,
                  height: 28,
                  borderRadius: 999,
                  background: notif[t.key] ? "#00a7ea" : "#D1D5DB",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    left: notif[t.key] ? 26 : 4,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#FAF7F2",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setTimeout(() => show("알림 설정이 저장되었습니다.", "info"), 4000)}
            style={{
              padding: "8px 24px",
              background: "#654024",
              color: "#fff",
              border: "1px solid #DFE8F0",
              borderRadius: 4,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────
export default function CMypagePage() {
  const tabs = [
    { id: "bids", label: "입찰현황" },
    { id: "company", label: "기업정보" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader title="마이페이지" />
      <div
        style={{
          background: "#FAF7F2",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          padding: "20px 24px",
        }}
      >
        <Tabs tabs={tabs}>
          {(active) => {
            if (active === "bids") return <BidStatusTab />;
            if (active === "company") return <CompanyInfoTab />;
            return null;
          }}
        </Tabs>
      </div>
    </div>
  );
}
