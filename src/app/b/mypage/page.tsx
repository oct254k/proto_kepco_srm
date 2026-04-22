"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import Tabs from "@/components/Tabs";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Drawer from "@/components/Drawer";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import {
  B_MY_QUOTES,
  B_MY_ORDERS,
  B_MAIL_INBOX,
  B_PROFILE,
} from "@/lib/mock/users";

// ─── 유틸 ─────────────────────────────────────────────────────────────────────
const METHOD_LABELS: Record<string, string> = {
  NEGOTIATION: "수의계약",
  LOWEST_PRICE: "최저가",
  LIMITED: "제한경쟁",
  TWO_STAGE: "2단계",
};

// ─── 프로필 카드 ──────────────────────────────────────────────────────────────
function ProfileCard({ onChangePw }: { onChangePw: () => void }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "20px 24px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "#01ACC8",
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
          <p style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "#111827" }}>
            {B_PROFILE.name}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 16, color: "#6B7280" }}>
            {B_PROFILE.dept} · {B_PROFILE.role}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 15, color: "#9CA3AF" }}>
            {B_PROFILE.email}
          </p>
        </div>
      </div>
      <button
        onClick={onChangePw}
        style={{
          background: "#fff",
          color: "#374151",
          border: "1px solid #d1d5db",
          borderRadius: 4,
          padding: "7px 18px",
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        비밀번호 변경
      </button>
    </div>
  );
}

// ─── 비밀번호 변경 Modal ──────────────────────────────────────────────────────
function PasswordChangeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { show } = useToast();
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confPw, setConfPw] = useState("");
  const [errors, setErrors] = useState<{ cur?: string; new?: string; conf?: string }>({});

  const pwPolicy = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,16}$/;

  const validate = () => {
    const e: typeof errors = {};
    if (!curPw) e.cur = "기존 비밀번호를 입력하세요.";
    if (!pwPolicy.test(newPw)) e.new = "영문+숫자+특수문자 조합, 8~16자로 입력하세요.";
    if (newPw !== confPw) e.conf = "비밀번호가 일치하지 않습니다.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setCurPw("");
      setNewPw("");
      setConfPw("");
      setErrors({});
      onClose();
      setTimeout(() => show("비밀번호가 변경되었습니다.", "info"), 4000);
    }
  };

  const handleClose = () => {
    setCurPw("");
    setNewPw("");
    setConfPw("");
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="비밀번호 변경"
      width={480}
      footer={
        <>
          <button
            onClick={handleClose}
            style={{
              background: "#fff",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: 4,
              padding: "7px 20px",
              fontSize: 16,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            style={{
              background: "#01ACC8",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "7px 20px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            변경
          </button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 6 }}>
            기존 비밀번호 <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input
            type="password"
            value={curPw}
            onChange={(e) => setCurPw(e.target.value)}
            style={{
              width: "100%",
              border: errors.cur ? "1px solid #EF4444" : "1px solid #d1d5db",
              borderRadius: 4,
              padding: "8px 12px",
              fontSize: 16,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          {errors.cur && <p style={{ margin: "4px 0 0", fontSize: 15, color: "#EF4444" }}>{errors.cur}</p>}
        </div>
        <div>
          <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 6 }}>
            새 비밀번호 <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            style={{
              width: "100%",
              border: errors.new ? "1px solid #EF4444" : "1px solid #d1d5db",
              borderRadius: 4,
              padding: "8px 12px",
              fontSize: 16,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          <p style={{ margin: "4px 0 0", fontSize: 15, color: errors.new ? "#EF4444" : "#6B7280" }}>
            {errors.new ?? "✔ 영문+숫자+특수문자 조합, 8~16자"}
          </p>
        </div>
        <div>
          <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 6 }}>
            새 비밀번호 확인 <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input
            type="password"
            value={confPw}
            onChange={(e) => setConfPw(e.target.value)}
            style={{
              width: "100%",
              border: errors.conf ? "1px solid #EF4444" : "1px solid #d1d5db",
              borderRadius: 4,
              padding: "8px 12px",
              fontSize: 16,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          {errors.conf && <p style={{ margin: "4px 0 0", fontSize: 15, color: "#EF4444" }}>{errors.conf}</p>}
        </div>
      </div>
    </Modal>
  );
}

// ─── 견적요청 탭 ──────────────────────────────────────────────────────────────
function QuoteTab() {
  const [selectedQuote, setSelectedQuote] = useState<Record<string, unknown> | null>(null);

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
    <>
      <DataTable
        columns={columns}
        data={B_MY_QUOTES as unknown as Record<string, unknown>[]}
        sectionLabel="나의 견적요청"
        showExcel={false}
        showCheckbox={false}
        totalCount={B_MY_QUOTES.length}
        onRowClick={(row) => setSelectedQuote(row)}
      />

      <Drawer
        open={!!selectedQuote}
        onClose={() => setSelectedQuote(null)}
        title={selectedQuote ? String(selectedQuote.title) : ""}
        width={560}
      >
        {selectedQuote && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <StatusBadge status={String(selectedQuote.status)} />
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
              <tbody>
                {[
                  ["견적번호", selectedQuote.id],
                  ["견적명", selectedQuote.title],
                  ["요청일", selectedQuote.requestedAt],
                  ["마감일", selectedQuote.deadline],
                  ["상태", selectedQuote.status],
                ].map(([label, value]) => (
                  <tr key={String(label)}>
                    <th
                      style={{
                        padding: "10px 14px",
                        background: "#f9fafb",
                        borderBottom: "1px solid #e5e7eb",
                        borderRight: "1px solid #e5e7eb",
                        textAlign: "left",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#374151",
                        width: 130,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {String(label)}
                    </th>
                    <td
                      style={{
                        padding: "10px 14px",
                        borderBottom: "1px solid #e5e7eb",
                        fontSize: 16,
                        color: "#111827",
                      }}
                    >
                      {label === "상태"
                        ? <StatusBadge status={String(value)} />
                        : String(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              style={{
                marginTop: 20,
                padding: "14px 16px",
                background: "#f0f9ff",
                borderRadius: 6,
                border: "1px solid #bae6fd",
              }}
            >
              <p style={{ margin: 0, fontSize: 16, color: "#0369a1" }}>
                견적 요청에 대한 협력업체 응답을 기다리고 있습니다.
                마감일 전까지 응답이 없으면 자동 마감됩니다.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}

// ─── 발주현황 탭 ──────────────────────────────────────────────────────────────
function OrderTab() {
  const columns = [
    { key: "id", label: "발주번호", width: "140px" },
    { key: "title", label: "발주명", align: "left" as const },
    {
      key: "method",
      label: "선정방법",
      width: "120px",
      render: (v: unknown) => (
        <span style={{ fontSize: 15, color: "#374151" }}>
          {METHOD_LABELS[String(v)] ?? String(v)}
        </span>
      ),
    },
    {
      key: "status",
      label: "상태",
      width: "100px",
      render: (v: unknown) => <StatusBadge status={String(v)} />,
    },
    { key: "requestedAt", label: "요청일", width: "110px" },
  ];

  return (
    <DataTable
      columns={columns}
      data={B_MY_ORDERS as unknown as Record<string, unknown>[]}
      sectionLabel="나의 발주현황"
      showExcel={false}
      showCheckbox={false}
      totalCount={B_MY_ORDERS.length}
    />
  );
}

// ─── 메일 수신함 탭 ───────────────────────────────────────────────────────────
function MailTab() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
          ▶ 메일 수신함 (총{" "}
          <span style={{ color: "#01ACC8" }}>{B_MAIL_INBOX.length}</span>건 /{" "}
          <span style={{ color: "#EF4444" }}>
            {B_MAIL_INBOX.filter((m) => !m.read).length}
          </span>
          건 미읽음)
        </span>
      </div>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 6, overflow: "hidden" }}>
        {/* 헤더 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "8px 180px 1fr 160px",
            background: "#f5f5f5",
            padding: "10px 14px",
            fontSize: 16,
            fontWeight: 600,
            color: "#444",
            borderBottom: "1px solid #e5e7eb",
            gap: 12,
          }}
        >
          <span />
          <span>발신자</span>
          <span>제목</span>
          <span style={{ textAlign: "right" }}>수신일시</span>
        </div>
        {B_MAIL_INBOX.map((mail, idx) => (
          <div
            key={mail.id}
            onClick={() => setSelected(selected === mail.id ? null : mail.id)}
            style={{
              display: "grid",
              gridTemplateColumns: "8px 180px 1fr 160px",
              padding: "12px 14px",
              borderBottom: idx < B_MAIL_INBOX.length - 1 ? "1px solid #f3f4f6" : "none",
              cursor: "pointer",
              background: selected === mail.id ? "#f0f9ff" : "#fff",
              gap: 12,
              alignItems: "center",
            }}
            onMouseEnter={(e) => {
              if (selected !== mail.id)
                (e.currentTarget as HTMLDivElement).style.background = "#f9fafb";
            }}
            onMouseLeave={(e) => {
              if (selected !== mail.id)
                (e.currentTarget as HTMLDivElement).style.background = "#fff";
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: mail.read ? "transparent" : "#EF4444",
                display: "block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 15,
                color: "#6B7280",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {mail.from}
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: mail.read ? 400 : 700,
                color: "#111827",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {mail.subject}
            </span>
            <span
              style={{
                fontSize: 15,
                color: "#9CA3AF",
                textAlign: "right",
                whiteSpace: "nowrap",
              }}
            >
              {mail.receivedAt}
            </span>
          </div>
        ))}
        {B_MAIL_INBOX.length === 0 && (
          <div style={{ padding: 32, textAlign: "center", color: "#888", fontSize: 16 }}>
            수신된 메일이 없습니다.
          </div>
        )}
      </div>
      <p style={{ margin: "8px 0 0", fontSize: 15, color: "#9CA3AF" }}>
        ● 빨간 점 = 미읽음 메일
      </p>
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────
export default function BMypagePage() {
  const [pwModalOpen, setPwModalOpen] = useState(false);

  const tabs = [
    { id: "quotes", label: "나의 견적요청" },
    { id: "orders", label: "발주현황" },
    { id: "mail", label: "메일 수신함" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <PageHeader title="마이페이지" />
      <ProfileCard onChangePw={() => setPwModalOpen(true)} />
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          padding: "20px 24px",
        }}
      >
        <Tabs tabs={tabs}>
          {(active) => {
            if (active === "quotes") return <QuoteTab />;
            if (active === "orders") return <OrderTab />;
            if (active === "mail") return <MailTab />;
            return null;
          }}
        </Tabs>
      </div>
      <PasswordChangeModal open={pwModalOpen} onClose={() => setPwModalOpen(false)} />
    </div>
  );
}
