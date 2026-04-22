"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import Tabs from "@/components/Tabs";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import {
  C_MY_BIDS,
  C_MY_CONTRACTS,
  C_PROCESS_HISTORY,
  C_PROFILE,
} from "@/lib/mock/users";

// ─── 유틸 ─────────────────────────────────────────────────────────────────────
const METHOD_LABELS: Record<string, string> = {
  LIMITED: "제한경쟁",
  TWO_STAGE: "2단계",
  NEGOTIATION: "수의계약",
  LOWEST_PRICE: "최저가",
};

function fmt(n: number) {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`;
  if (n >= 10_000) return `${(n / 10_000).toFixed(0)}만`;
  return n.toLocaleString();
}

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
            background: "#6366F1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 23,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {C_PROFILE.name.charAt(0)}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <p style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "#111827" }}>
              {C_PROFILE.name}
            </p>
            <span
              style={{
                fontSize: 14,
                background: "#e0e7ff",
                color: "#4338ca",
                padding: "2px 8px",
                borderRadius: 999,
                fontWeight: 600,
              }}
            >
              {C_PROFILE.role}
            </span>
          </div>
          <p style={{ margin: "2px 0 0", fontSize: 16, color: "#6B7280" }}>
            {C_PROFILE.dept} · {C_PROFILE.position} · {C_PROFILE.empNo}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 15, color: "#9CA3AF" }}>
            {C_PROFILE.email}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 15, color: "#6B7280" }}>계정상태:</span>
          <StatusBadge status={C_PROFILE.accountStatus} />
        </div>
        <p style={{ margin: 0, fontSize: 15, color: "#9CA3AF" }}>
          최종로그인: {C_PROFILE.lastLogin}
        </p>
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

// ─── 담당 입찰현황 탭 ─────────────────────────────────────────────────────────
function BidsTab() {
  const columns = [
    { key: "id", label: "공고번호", width: "140px" },
    { key: "title", label: "공고명", align: "left" as const },
    {
      key: "method",
      label: "입찰방법",
      width: "110px",
      render: (v: unknown) => (
        <span style={{ fontSize: 15, color: "#374151" }}>
          {METHOD_LABELS[String(v)] ?? String(v)}
        </span>
      ),
    },
    { key: "deadline", label: "마감일", width: "110px" },
    {
      key: "participantCount",
      label: "참여업체수",
      width: "100px",
      align: "center" as const,
      render: (v: unknown) => (
        <span style={{ fontWeight: 600, color: "#01ACC8" }}>{String(v)}개사</span>
      ),
    },
    {
      key: "status",
      label: "상태",
      width: "100px",
      render: (v: unknown) => <StatusBadge status={String(v)} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={C_MY_BIDS as unknown as Record<string, unknown>[]}
      sectionLabel="담당 입찰현황"
      showExcel={false}
      showCheckbox={false}
      totalCount={C_MY_BIDS.length}
    />
  );
}

// ─── 계약현황 탭 ──────────────────────────────────────────────────────────────
function ContractsTab() {
  const columns = [
    { key: "id", label: "계약번호", width: "140px" },
    { key: "title", label: "계약명", align: "left" as const },
    { key: "vendorName", label: "업체명", width: "160px", align: "left" as const },
    {
      key: "amount",
      label: "계약금액",
      width: "130px",
      align: "right" as const,
      render: (v: unknown) =>
        typeof v === "number" ? (
          <span style={{ fontWeight: 600 }}>
            {fmt(v)}
            <span style={{ fontSize: 14, color: "#6B7280", marginLeft: 2 }}>원</span>
          </span>
        ) : (
          String(v)
        ),
    },
    { key: "endDate", label: "만료일", width: "110px" },
    {
      key: "status",
      label: "상태",
      width: "90px",
      render: (v: unknown) => <StatusBadge status={String(v)} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={C_MY_CONTRACTS as unknown as Record<string, unknown>[]}
      sectionLabel="계약현황"
      showExcel={false}
      showCheckbox={false}
      totalCount={C_MY_CONTRACTS.length}
    />
  );
}

// ─── 처리이력 탭 ──────────────────────────────────────────────────────────────
function HistoryTab() {
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
          ▶ 처리이력 (총{" "}
          <span style={{ color: "#01ACC8" }}>{C_PROCESS_HISTORY.length}</span>건)
        </span>
      </div>
      <div style={{ position: "relative", paddingLeft: 32 }}>
        {/* 세로 선 */}
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 8,
            bottom: 8,
            width: 2,
            background: "#e5e7eb",
          }}
        />
        {C_PROCESS_HISTORY.map((item, idx) => (
          <div
            key={item.id}
            style={{
              position: "relative",
              marginBottom: idx < C_PROCESS_HISTORY.length - 1 ? 24 : 0,
            }}
          >
            {/* 원형 마커 */}
            <div
              style={{
                position: "absolute",
                left: -26,
                top: 4,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#01ACC8",
                border: "2px solid #fff",
                boxShadow: "0 0 0 2px #01ACC8",
              }}
            />
            {/* 카드 */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                padding: "12px 16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 15,
                      background: "#f0f9ff",
                      color: "#0369a1",
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontWeight: 600,
                    }}
                  >
                    {item.type}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>
                    {item.target}
                  </span>
                </div>
                <span style={{ fontSize: 15, color: "#9CA3AF" }}>{item.date}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15, color: "#6B7280" }}>처리결과:</span>
                <span
                  style={{
                    fontSize: 15,
                    background: item.result === "완료" ? "#D1FAE5" : "#FEF3C7",
                    color: item.result === "완료" ? "#065F46" : "#92400E",
                    padding: "1px 8px",
                    borderRadius: 999,
                    fontWeight: 600,
                  }}
                >
                  {item.result}
                </span>
              </div>
            </div>
          </div>
        ))}
        {C_PROCESS_HISTORY.length === 0 && (
          <div style={{ padding: "24px 0", textAlign: "center", color: "#9CA3AF", fontSize: 16 }}>
            처리이력이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────
export default function CMypagePage() {
  const [pwModalOpen, setPwModalOpen] = useState(false);

  const tabs = [
    { id: "bids", label: "담당 입찰현황" },
    { id: "contracts", label: "계약현황" },
    { id: "history", label: "처리이력" },
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
            if (active === "bids") return <BidsTab />;
            if (active === "contracts") return <ContractsTab />;
            if (active === "history") return <HistoryTab />;
            return null;
          }}
        </Tabs>
      </div>
      <PasswordChangeModal open={pwModalOpen} onClose={() => setPwModalOpen(false)} />
    </div>
  );
}
