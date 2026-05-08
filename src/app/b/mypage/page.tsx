"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import Tabs from "@/components/Tabs";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Drawer from "@/components/Drawer";
import { useToast } from "@/components/Toast";
import {
  B_MY_QUOTES,
  B_MY_ORDERS_DETAIL,
  B_SYSTEM_REQUESTS,
  B_MAIL_SEND_HISTORY,
  B_PROFILE,
} from "@/lib/mock/users";

// ─── 유틸 ─────────────────────────────────────────────────────────────────────
const METHOD_LABELS: Record<string, string> = {
  NEGOTIATION: "수의계약",
  LOWEST_PRICE: "최저가",
  LIMITED: "제한경쟁",
  TWO_STAGE: "2단계경쟁",
  QUALIFIED: "적격심사",
};

function fmt(n: number) {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`;
  if (n >= 10_000) return `${(n / 10_000).toFixed(0)}만`;
  return n.toLocaleString();
}

// ─── 프로필 카드 ──────────────────────────────────────────────────────────────
function ProfileCard() {
  return (
    <div
      style={{
        background: "#FAF7F2",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "20px 24px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "#654024",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 23,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {B_PROFILE.name.charAt(0)}
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <p style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "#111827" }}>{B_PROFILE.name}</p>
          <span
            style={{
              fontSize: 13,
              background: "#DBEAFE",
              color: "#1E40AF",
              padding: "2px 8px",
              borderRadius: 999,
              fontWeight: 600,
            }}
          >
            사업담당자
          </span>
        </div>
        <p style={{ margin: "2px 0 0", fontSize: 15, color: "#6B7280" }}>{B_PROFILE.dept} · {B_PROFILE.email}</p>
      </div>
    </div>
  );
}

// ─── 발주요청현황 탭 ──────────────────────────────────────────────────────────
function OrderStatusTab() {
  type DrawerOrder = (typeof B_MY_ORDERS_DETAIL)[number] | null;
  const [selected, setSelected] = useState<DrawerOrder>(null);
  const [drawerTab, setDrawerTab] = useState("info");

  const columns = [
    { key: "id", label: "발주번호", width: "150px" },
    { key: "title", label: "사업명·요청제목", align: "left" as const },
    {
      key: "method",
      label: "선정방법",
      width: "110px",
      render: (v: unknown) => <span style={{ fontSize: 14, color: "#374151" }}>{METHOD_LABELS[String(v)] ?? String(v)}</span>,
    },
    {
      key: "amount",
      label: "요청금액",
      width: "120px",
      align: "right" as const,
      render: (v: unknown) =>
        typeof v === "number" ? (
          <span style={{ fontWeight: 600 }}>
            {fmt(v)}
            <span style={{ fontSize: 13, color: "#6B7280", marginLeft: 2 }}>원</span>
          </span>
        ) : (
          String(v)
        ),
    },
    {
      key: "status",
      label: "상태",
      width: "100px",
      render: (v: unknown) => <StatusBadge status={String(v)} />,
    },
    { key: "assignee", label: "처리자", width: "130px", render: (v: unknown) => <span style={{ fontSize: 14, color: "#6B7280" }}>{String(v)}</span> },
  ];

  const drawerTabs = [
    { id: "info", label: "발주정보" },
    { id: "history", label: "처리이력" },
    { id: "linked", label: "연계정보" },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button
          onClick={() => window.location.assign("/b/orders/")}
          style={{
            padding: "8px 18px",
            background: "#654024",
            color: "#fff",
            border: "1px solid #DFE8F0",
            borderRadius: 4,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          + 신규 요청
        </button>
      </div>

      <DataTable
        columns={columns}
        data={B_MY_ORDERS_DETAIL as unknown as Record<string, unknown>[]}
        sectionLabel="내 발주요청현황"
        showExcel
        showCheckbox={false}
        totalCount={B_MY_ORDERS_DETAIL.length}
        onRowClick={(row) => {
          const found = B_MY_ORDERS_DETAIL.find((o) => o.id === row.id) ?? null;
          setSelected(found);
          setDrawerTab("info");
        }}
      />

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.title} — ${selected.id}` : ""}
        width={680}
      >
        {selected && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <StatusBadge status={selected.status} />
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
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, marginBottom: 14 }}>
                  <tbody>
                    {[
                      ["사업명", selected.title],
                      ["PMS 프로젝트", selected.pmsProject],
                      ["선정방법", METHOD_LABELS[selected.method] ?? selected.method],
                      ["요청금액", `${fmt(selected.amount)}원`],
                      ["제출일", selected.requestedAt],
                      ["계약담당자", selected.assignee],
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
                            width: 130,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {label}
                        </th>
                        <td style={{ padding: "9px 12px", borderBottom: "1px solid #e5e7eb", color: "#111827" }}>
                          {String(value ?? "")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: "12px 14px", background: "#f9fafb", borderRadius: 6, fontSize: 15, color: "#374151" }}>
                  <p style={{ margin: "0 0 6px", fontWeight: 600 }}>발주 사유:</p>
                  <p style={{ margin: 0 }}>{selected.description}</p>
                </div>
                <div style={{ marginTop: 14, fontSize: 15, color: "#9CA3AF" }}>
                  <span>📎 내역서.pdf</span>
                  <span style={{ marginLeft: 14 }}>📎 원가계산서.pdf</span>
                </div>
              </div>
            )}

            {/* 처리이력 탭 */}
            {drawerTab === "history" && (
              <div style={{ position: "relative", paddingLeft: 28 }}>
                <div style={{ position: "absolute", left: 8, top: 4, bottom: 4, width: 2, background: "#e5e7eb" }} />
                {selected.histories.map((h, i) => (
                  <div key={i} style={{ position: "relative", marginBottom: i < selected.histories.length - 1 ? 20 : 0 }}>
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
                    <div style={{ background: "#FAF7F2", border: "1px solid #e5e7eb", borderRadius: 6, padding: "10px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#00a7ea" }}>{h.status}</span>
                        <span style={{ fontSize: 14, color: "#9CA3AF" }}>{h.date}</span>
                      </div>
                      <span style={{ fontSize: 15, color: "#374151" }}>{h.actor}</span>
                      {h.note && <span style={{ fontSize: 14, color: "#6B7280", marginLeft: 8 }}>— {h.note}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 연계정보 탭 */}
            {drawerTab === "linked" && (
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 12 }}>연계된 발주계획·공고</p>
                {selected.linkedBid ? (
                  <div style={{ padding: "16px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                      <tbody>
                        {[
                          ["공고번호", selected.linkedBid.id],
                          ["공고명", selected.linkedBid.title],
                          ["공고일", selected.linkedBid.date],
                          ["마감일", selected.linkedBid.deadline],
                          ["공고상태", null],
                        ].map(([label, value]) => (
                          <tr key={String(label)}>
                            <td style={{ padding: "6px 12px 6px 0", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>
                              {label}
                            </td>
                            <td style={{ padding: "6px 0", color: "#111827" }}>
                              {label === "공고상태" ? (
                                <StatusBadge status={selected.linkedBid!.status} />
                              ) : String(value ?? "")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ padding: "20px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, textAlign: "center", color: "#9CA3AF", fontSize: 15 }}>
                    아직 연계된 발주계획·공고가 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Drawer>
    </>
  );
}

// ─── 수정요청 탭 ──────────────────────────────────────────────────────────────
function SystemRequestTab() {
  const { show } = useToast();
  const [requests, setRequests] = useState(B_SYSTEM_REQUESTS);
  const [formType, setFormType] = useState("버그신고");
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [errors, setErrors] = useState<{ title?: string }>({});

  const types = ["버그신고", "개선요청", "문의"];

  const handleSubmit = () => {
    if (!formTitle.trim()) {
      setErrors({ title: "제목을 입력하세요." });
      return;
    }
    const newId = `SRQ-${String(requests.length + 1).padStart(3, "0")}`;
    setRequests((prev) => [
      { id: newId, title: formTitle, type: formType, registeredAt: "2026-04-22", status: "접수" },
      ...prev,
    ]);
    setFormTitle("");
    setFormContent("");
    setErrors({});
    setTimeout(() => show("시스템 수정 요청이 등록되었습니다.", "info"), 4000);
  };

  const columns = [
    { key: "id", label: "번호", width: "100px" },
    { key: "title", label: "제목", align: "left" as const },
    { key: "type", label: "유형", width: "90px" },
    { key: "registeredAt", label: "등록일", width: "100px" },
    { key: "status", label: "처리상태", width: "100px", render: (v: unknown) => <StatusBadge status={String(v)} /> },
  ];

  return (
    <div>
      {/* 등록 폼 */}
      <div
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "20px 24px",
          marginBottom: 20,
        }}
      >
        <p style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, color: "#111827" }}>새 요청 등록</p>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 12, flexWrap: "wrap" }}>
          <label style={{ fontSize: 16, fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>
            유형 <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: 20 }}>
            {types.map((t) => (
              <label key={t} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 16 }}>
                <input
                  type="radio"
                  name="req-type"
                  value={t}
                  checked={formType === t}
                  onChange={() => setFormType(t)}
                  style={{ accentColor: "#00a7ea" }}
                />
                {t}
              </label>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 6 }}>
            제목 <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input
            value={formTitle}
            onChange={(e) => { setFormTitle(e.target.value); setErrors({}); }}
            placeholder="제목을 입력하세요."
            style={{
              width: "100%",
              border: errors.title ? "1px solid #EF4444" : "1px solid #d1d5db",
              borderRadius: 4,
              padding: "8px 12px",
              fontSize: 16,
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          {errors.title && <p style={{ margin: "4px 0 0", fontSize: 14, color: "#EF4444" }}>{errors.title}</p>}
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 6 }}>내용</label>
          <textarea
            value={formContent}
            onChange={(e) => setFormContent(e.target.value)}
            rows={3}
            placeholder="상세 내용을 입력하세요."
            style={{
              width: "100%",
              border: "1px solid #d1d5db",
              borderRadius: 4,
              padding: "8px 12px",
              fontSize: 15,
              fontFamily: "inherit",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleSubmit}
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
            등록
          </button>
        </div>
      </div>

      {/* 요청 목록 */}
      <DataTable
        columns={columns}
        data={requests as unknown as Record<string, unknown>[]}
        sectionLabel="내 요청 목록"
        showExcel={false}
        showCheckbox={false}
        totalCount={requests.length}
      />
    </div>
  );
}

// ─── 메일발송 탭 ──────────────────────────────────────────────────────────────
function MailSendTab() {
  const { show } = useToast();
  const [bidSearch, setBidSearch] = useState("BID-2026-005 태양광 인버터 구매 입찰 공고");
  const [targetType, setTargetType] = useState("ALL");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ subject?: string; body?: string }>({});

  const targetTypes = [
    { value: "ALL", label: "전체 참여업체" },
    { value: "AWARDED", label: "낙찰업체" },
    { value: "FAILED", label: "탈락업체" },
    { value: "CUSTOM", label: "직접 선택" },
  ];

  const histColumns = [
    { key: "sentAt", label: "발송일시", width: "150px" },
    { key: "bidTitle", label: "공고명", align: "left" as const },
    { key: "targetType", label: "대상", width: "120px" },
    { key: "sentCount", label: "발송수", width: "80px", align: "center" as const, render: (v: unknown) => <span style={{ fontWeight: 600 }}>{String(v)}건</span> },
    { key: "status", label: "상태", width: "100px", render: (v: unknown) => <StatusBadge status={String(v)} /> },
  ];

  const handleSend = () => {
    const e: typeof errors = {};
    if (!subject.trim()) e.subject = "메일 제목을 입력하세요.";
    if (!body.trim()) e.body = "메일 본문을 입력하세요.";
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    const count = targetType === "AWARDED" ? 1 : targetType === "FAILED" ? 4 : 12;
    setTimeout(() => show(`${count}개 업체에 이메일이 발송되었습니다.`, "info"), 4000);
  };

  return (
    <div>
      <div
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "20px 24px",
          marginBottom: 20,
        }}
      >
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 6 }}>
            발송 기준 공고 선택 <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={bidSearch}
              onChange={(e) => setBidSearch(e.target.value)}
              placeholder="공고명 또는 번호 검색"
              style={{
                flex: 1,
                border: "1px solid #d1d5db",
                borderRadius: 4,
                padding: "8px 12px",
                fontSize: 15,
                fontFamily: "inherit",
              }}
            />
            <button
              style={{
                padding: "8px 18px",
                background: "#ffffff",
                color: "#654024",
                border: "1px solid #CFCFCF",
                borderRadius: 4,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              검색
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 8 }}>발송 대상</label>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {targetTypes.map((t) => (
              <label key={t.value} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 15 }}>
                <input
                  type="radio"
                  name="target-type"
                  value={t.value}
                  checked={targetType === t.value}
                  onChange={() => setTargetType(t.value)}
                  style={{ accentColor: "#00a7ea" }}
                />
                {t.label}
              </label>
            ))}
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#6B7280" }}>
            선택된 수신자: <strong>{targetType === "AWARDED" ? 1 : targetType === "FAILED" ? 4 : 12}개 업체</strong>
          </p>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 6 }}>
            메일 제목 <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setErrors((p) => ({ ...p, subject: undefined })); }}
            placeholder="메일 제목을 입력하세요."
            style={{
              width: "100%",
              border: errors.subject ? "1px solid #EF4444" : "1px solid #d1d5db",
              borderRadius: 4,
              padding: "8px 12px",
              fontSize: 15,
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          {errors.subject && <p style={{ margin: "4px 0 0", fontSize: 14, color: "#EF4444" }}>{errors.subject}</p>}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 6 }}>
            메일 본문 <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => { setBody(e.target.value); setErrors((p) => ({ ...p, body: undefined })); }}
            rows={5}
            placeholder="메일 본문을 입력하세요."
            style={{
              width: "100%",
              border: errors.body ? "1px solid #EF4444" : "1px solid #d1d5db",
              borderRadius: 4,
              padding: "8px 12px",
              fontSize: 15,
              fontFamily: "inherit",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          {errors.body && <p style={{ margin: "4px 0 0", fontSize: 14, color: "#EF4444" }}>{errors.body}</p>}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            style={{
              padding: "8px 18px",
              background: "#ffffff",
              color: "#654024",
              border: "1px solid #CFCFCF",
              borderRadius: 4,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            발송 미리보기
          </button>
          <button
            onClick={handleSend}
            style={{
              padding: "8px 24px",
              background: "#654024",
              color: "#fff",
              border: "1px solid #DFE8F0",
              borderRadius: 4,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            발송
          </button>
        </div>
      </div>

      {/* 발송 이력 */}
      <DataTable
        columns={histColumns}
        data={B_MAIL_SEND_HISTORY as unknown as Record<string, unknown>[]}
        sectionLabel="발송 이력 (최근 5건)"
        showExcel={false}
        showCheckbox={false}
        totalCount={B_MAIL_SEND_HISTORY.length}
      />
    </div>
  );
}

// ─── 견적현황 탭 ──────────────────────────────────────────────────────────────
function QuoteStatusTab() {
  const columns = [
    { key: "id", label: "견적번호", width: "140px" },
    { key: "title", label: "견적명", align: "left" as const },
    {
      key: "status",
      label: "상태",
      width: "100px",
      render: (v: unknown) => <StatusBadge status={String(v)} />,
    },
    { key: "requestedAt", label: "요청일", width: "110px" },
    { key: "deadline", label: "마감일", width: "110px" },
  ];

  return (
    <DataTable
      columns={columns}
      data={B_MY_QUOTES as unknown as Record<string, unknown>[]}
      sectionLabel="견적현황"
      showExcel={false}
      showCheckbox={false}
      totalCount={B_MY_QUOTES.length}
    />
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────
export default function BMypagePage() {
  const tabs = [
    { id: "orders", label: "발주요청현황" },
    { id: "requests", label: "수정요청" },
    { id: "mail", label: "메일발송" },
    { id: "quotes", label: "견적현황" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <PageHeader title="마이페이지" />
      <ProfileCard />
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
            if (active === "orders") return <OrderStatusTab />;
            if (active === "requests") return <SystemRequestTab />;
            if (active === "mail") return <MailSendTab />;
            if (active === "quotes") return <QuoteStatusTab />;
            return null;
          }}
        </Tabs>
      </div>
    </div>
  );
}
