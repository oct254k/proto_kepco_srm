"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import SearchForm from "@/components/SearchForm";
import StatusBadge from "@/components/StatusBadge";
import Drawer from "@/components/Drawer";
import Modal from "@/components/Modal";
import Tabs from "@/components/Tabs";
import { useToast } from "@/components/Toast";
import {
  MOCK_USERS,
  MOCK_VENDORS,
  PENDING_VENDORS,
  PERM_GROUPS,
} from "@/lib/mock/admin_users";
import type { PermGroup } from "@/lib/mock/admin_users";
import type { User, Vendor } from "@/lib/types";

// ── 역할 배지 ──────────────────────────────────────────────────────
const ROLE_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  B: { bg: "#DBEAFE", color: "#1E40AF", label: "B-사업담당" },
  C: { bg: "#D1FAE5", color: "#065F46", label: "C-계약담당" },
  EXEC: { bg: "#EDE9FE", color: "#5B21B6", label: "EXEC-임원" },
  A: { bg: "#FEE2E2", color: "#991B1B", label: "A-관리자" },
};

function RoleBadge({ role }: { role: string }) {
  const s = ROLE_COLORS[role] ?? { bg: "#f0f0f0", color: "#666", label: role };
  return (
    <span
      style={{
        display: "inline-block",
        background: s.bg,
        color: s.color,
        borderRadius: 999,
        padding: "2px 10px",
        fontSize: 15,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

// ── 공통 버튼 스타일 ────────────────────────────────────────────────
function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
  small,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "danger" | "warning";
  disabled?: boolean;
  small?: boolean;
}) {
  const base: React.CSSProperties = {
    borderRadius: 4,
    padding: small ? "4px 10px" : "6px 16px",
    fontSize: small ? 12 : 13,
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    opacity: disabled ? 0.5 : 1,
    border: "1px solid transparent",
    whiteSpace: "nowrap" as const,
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: "#01ACC8", color: "#fff", borderColor: "#01ACC8" },
    outline: { background: "#fff", color: "#01ACC8", borderColor: "#01ACC8" },
    danger: { background: "#fff", color: "#DC2626", borderColor: "#DC2626" },
    warning: { background: "#fff", color: "#92400E", borderColor: "#D97706" },
  };
  return (
    <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// ── 상세 행 렌더러 ──────────────────────────────────────────────────
function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "110px 1fr",
        gap: 8,
        padding: "8px 0",
        borderBottom: "1px solid #f0f0f0",
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 15, color: "#888", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 17, color: "#222" }}>{value}</span>
    </div>
  );
}

// ── 내부 사용자 Drawer ──────────────────────────────────────────────
function UserDrawer({
  user,
  open,
  onClose,
  onDeactivate,
  onRoleChange,
}: {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onDeactivate: (id: string) => void;
  onRoleChange: (id: string, role: string) => void;
}) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);

  React.useEffect(() => {
    if (user) setSelectedRole(user.role);
  }, [user]);

  const ROLE_OPTIONS = [
    { value: "B", label: "B-사업담당자" },
    { value: "C", label: "C-계약담당자" },
    { value: "EXEC", label: "EXEC-임원" },
    { value: "A", label: "A-관리자" },
  ];

  const MENU_PERMS: Record<string, string[]> = {
    B: ["견적관리", "발주관리", "입찰공고", "마이페이지"],
    C: ["계약관리", "발주관리", "입찰공고", "낙찰관리", "참여업체평가", "계약체결", "마이페이지"],
    EXEC: ["계약관리", "발주관리", "입찰공고", "낙찰관리", "참여업체평가", "계약체결", "복수예비기초금액결정"],
    A: ["사용자관리", "협력업체관리", "기준정보관리", "시스템환경", "관리자메뉴"],
  };

  const allMenus = ["계약관리", "발주관리", "입찰공고", "낙찰관리", "참여업체평가", "계약체결", "견적관리", "마이페이지", "기준정보관리", "관리자메뉴", "복수예비기초금액결정"];

  if (!user) return null;

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        title={`사용자: ${user.name} (${user.id})`}
        width={640}
      >
        <Tabs
          tabs={[
            { id: "info", label: "사용자 기본정보" },
            { id: "role", label: "역할·권한 관리" },
            { id: "history", label: "이력" },
          ]}
        >
          {(tab) => (
            <>
              {tab === "info" && (
                <div>
                  <div
                    style={{
                      background: "#F0F9FF",
                      border: "1px solid #BAE6FD",
                      borderRadius: 6,
                      padding: "8px 12px",
                      marginBottom: 16,
                      fontSize: 15,
                      color: "#0369A1",
                    }}
                  >
                    그룹웨어 연동 정보는 읽기 전용입니다.
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                    <DetailRow label="사용자 ID" value={user.id} />
                    <DetailRow label="이름" value={user.name} />
                    <DetailRow label="부서" value={`${user.dept} (그룹웨어 연동)`} />
                    <DetailRow label="역할" value={<RoleBadge role={user.role} />} />
                    <DetailRow
                      label="이메일"
                      value={<span style={{ fontSize: 16 }}>{user.email}</span>}
                    />
                    <DetailRow label="등록일" value={user.createdAt} />
                    <DetailRow
                      label="계정 상태"
                      value={<StatusBadge status={user.status} />}
                    />
                  </div>
                  <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
                    {user.status === "ACTIVE" && (
                      <Btn
                        variant="danger"
                        onClick={() => setDeactivateModalOpen(true)}
                      >
                        비활성화 처리
                      </Btn>
                    )}
                    {user.status === "INACTIVE" && (
                      <Btn
                        variant="outline"
                        onClick={() => onDeactivate(user.id)}
                      >
                        재활성화
                      </Btn>
                    )}
                    <Btn variant="warning">비밀번호 초기화</Btn>
                  </div>
                </div>
              )}

              {tab === "role" && (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 16, color: "#555", fontWeight: 500 }}>
                      현재 역할:{" "}
                    </span>
                    <RoleBadge role={user.role} />
                  </div>
                  <div
                    style={{
                      background: "#f9f9f9",
                      border: "1px solid #e0e0e0",
                      borderRadius: 6,
                      padding: 16,
                      marginBottom: 16,
                    }}
                  >
                    <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: "#444" }}>
                      역할 변경
                    </p>
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                      {ROLE_OPTIONS.map((opt) => (
                        <label
                          key={opt.value}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            cursor: "pointer",
                            fontSize: 16,
                          }}
                        >
                          <input
                            type="radio"
                            name="roleChange"
                            value={opt.value}
                            checked={selectedRole === opt.value}
                            onChange={() => setSelectedRole(opt.value)}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#f9f9f9",
                      border: "1px solid #e0e0e0",
                      borderRadius: 6,
                      padding: 16,
                      marginBottom: 16,
                    }}
                  >
                    <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: "#444" }}>
                      역할별 접근 가능 메뉴 (참조용)
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {allMenus.map((menu) => {
                        const allowed = (MENU_PERMS[selectedRole] ?? []).includes(menu);
                        return (
                          <span
                            key={menu}
                            style={{
                              fontSize: 15,
                              padding: "3px 8px",
                              borderRadius: 4,
                              background: allowed ? "#D1FAE5" : "#F3F4F6",
                              color: allowed ? "#065F46" : "#9CA3AF",
                              fontWeight: 500,
                            }}
                          >
                            {allowed ? "✔" : "✗"} {menu}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Btn
                      onClick={() => onRoleChange(user.id, selectedRole)}
                      disabled={selectedRole === user.role}
                    >
                      역할 변경 저장
                    </Btn>
                  </div>
                </div>
              )}

              {tab === "history" && (
                <div>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#444",
                      marginBottom: 12,
                      borderBottom: "1px solid #e0e0e0",
                      paddingBottom: 8,
                    }}
                  >
                    역할 변경 이력
                  </p>
                  {[
                    {
                      date: "2025-01-10",
                      from: "B(사업담당자)",
                      to: "C(계약담당자)",
                      by: "관리자A",
                    },
                  ].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                        fontSize: 16,
                      }}
                    >
                      <span style={{ color: "#888", minWidth: 90, fontSize: 15 }}>{h.date}</span>
                      <span style={{ color: "#DC2626", fontSize: 15 }}>{h.from}</span>
                      <span style={{ color: "#888" }}>→</span>
                      <span style={{ color: "#065F46", fontSize: 15 }}>{h.to}</span>
                      <span style={{ color: "#888", marginLeft: "auto", fontSize: 15 }}>
                        처리자: {h.by}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Tabs>
      </Drawer>

      {/* 비활성화 확인 Modal */}
      <Modal
        open={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        title="비활성화 처리 확인"
        width={480}
        footer={
          <>
            <Btn variant="outline" onClick={() => setDeactivateModalOpen(false)}>
              취소
            </Btn>
            <Btn
              variant="danger"
              onClick={() => {
                setDeactivateModalOpen(false);
                onDeactivate(user.id);
              }}
            >
              비활성화 처리
            </Btn>
          </>
        }
      >
        <div style={{ fontSize: 17, color: "#444", lineHeight: 1.6 }}>
          <p style={{ marginBottom: 12 }}>
            <strong>{user.name}</strong> 계정을 비활성화 처리하시겠습니까?
          </p>
          <div
            style={{
              background: "#FEF3C7",
              border: "1px solid #FDE68A",
              borderRadius: 6,
              padding: "10px 14px",
              fontSize: 16,
              color: "#92400E",
            }}
          >
            ⚠️ 현재 진행 중인 발주계획·입찰공고 건이 있습니다. 비활성화 시 해당 작업 접근이
            제한됩니다.
          </div>
        </div>
      </Modal>
    </>
  );
}

// ── 협력업체 Drawer (사용자관리 탭) ────────────────────────────────
function VendorDetailDrawer({
  vendor,
  open,
  onClose,
}: {
  vendor: Vendor | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!vendor) return null;
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`협력업체 상세 — ${vendor.name}`}
      width={620}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
        <DetailRow label="업체 ID" value={vendor.id} />
        <DetailRow label="업체명" value={vendor.name} />
        <DetailRow label="사업자번호" value={vendor.bizNo} />
        <DetailRow label="업종" value={vendor.category} />
        <DetailRow label="담당자명" value={vendor.contactName} />
        <DetailRow
          label="담당자 이메일"
          value={<span style={{ fontSize: 16 }}>{vendor.contactEmail}</span>}
        />
        <DetailRow
          label="상태"
          value={<StatusBadge status={vendor.status} />}
        />
        <DetailRow label="가입일" value={vendor.joinedAt} />
      </div>
      <div
        style={{
          marginTop: 24,
          background: "#f9f9f9",
          border: "1px solid #e0e0e0",
          borderRadius: 6,
          padding: 16,
        }}
      >
        <p style={{ fontSize: 16, fontWeight: 600, color: "#444", marginBottom: 12 }}>
          거래 이력 요약
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { label: "견적 제출", value: "12건" },
            { label: "낙찰 건수", value: "7건" },
            { label: "계약 체결", value: "5건" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 6,
                padding: "10px 14px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 15, color: "#888", marginBottom: 4 }}>{s.label}</p>
              <p style={{ fontSize: 21, fontWeight: 700, color: "#01ACC8" }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
}

// ── 권한그룹 Drawer ─────────────────────────────────────────────────
function PermGroupDrawer({
  group,
  open,
  onClose,
}: {
  group: PermGroup | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!group) return null;
  const groupUsers = MOCK_USERS.filter((u) => u.role === group.role).slice(0, group.userCount);
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`권한그룹: ${group.name}`}
      width={560}
    >
      <div style={{ marginBottom: 16 }}>
        <DetailRow label="그룹명" value={group.name} />
        <DetailRow label="대상 역할" value={<RoleBadge role={group.role} />} />
        <DetailRow label="소속 인원" value={`${group.userCount}명`} />
        <DetailRow label="설명" value={group.description} />
      </div>
      <div
        style={{
          background: "#f9f9f9",
          border: "1px solid #e0e0e0",
          borderRadius: 6,
          padding: 16,
        }}
      >
        <p style={{ fontSize: 16, fontWeight: 600, color: "#444", marginBottom: 10 }}>
          소속 사용자 목록
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              {["이름", "부서", "이메일", "상태"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "7px 10px",
                    border: "1px solid #e0e0e0",
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{ padding: "20px", textAlign: "center", color: "#888" }}
                >
                  소속 사용자가 없습니다.
                </td>
              </tr>
            ) : (
              groupUsers.map((u) => (
                <tr key={u.id}>
                  <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0" }}>{u.name}</td>
                  <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                    {u.dept}
                  </td>
                  <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0", fontSize: 15 }}>
                    {u.email}
                  </td>
                  <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                    <StatusBadge status={u.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Drawer>
  );
}

// ── 사용자 등록 Modal ───────────────────────────────────────────────
function UserRegisterModal({
  open,
  onClose,
  onRegister,
}: {
  open: boolean;
  onClose: () => void;
  onRegister: () => void;
}) {
  const [form, setForm] = useState({
    keyword: "",
    searchResults: [] as { empNo: string; name: string; dept: string; grade: string }[],
    selected: null as { empNo: string; name: string; dept: string; grade: string } | null,
    role: "B",
  });

  const MOCK_GW_EMPLOYEES = [
    { empNo: "20231", name: "박신입", dept: "계약2팀", grade: "사원" },
    { empNo: "20232", name: "강대리", dept: "사업1팀", grade: "대리" },
    { empNo: "20233", name: "윤팀장", dept: "계약1팀", grade: "팀장" },
  ];

  const handleSearch = () => {
    const results = MOCK_GW_EMPLOYEES.filter(
      (e) =>
        e.name.includes(form.keyword) || e.empNo.includes(form.keyword)
    );
    setForm((f) => ({ ...f, searchResults: results }));
  };

  const handleClose = () => {
    setForm({ keyword: "", searchResults: [], selected: null, role: "B" });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="그룹웨어 사원 등록"
      width={560}
      footer={
        <>
          <Btn variant="outline" onClick={handleClose}>
            취소
          </Btn>
          <Btn
            disabled={!form.selected}
            onClick={() => {
              handleClose();
              onRegister();
            }}
          >
            등록
          </Btn>
        </>
      }
    >
      <div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input
            type="text"
            placeholder="이름 또는 사번 입력"
            value={form.keyword}
            onChange={(e) => setForm((f) => ({ ...f, keyword: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              flex: 1,
              padding: "6px 10px",
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: 16,
              fontFamily: "inherit",
            }}
          />
          <Btn onClick={handleSearch}>검색</Btn>
        </div>

        {form.searchResults.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 16,
              marginBottom: 16,
            }}
          >
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                {["사번", "이름", "부서", "직급", "선택"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "7px 10px",
                      border: "1px solid #e0e0e0",
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {form.searchResults.map((emp) => (
                <tr
                  key={emp.empNo}
                  style={{
                    background: form.selected?.empNo === emp.empNo ? "#F0F9FF" : "#fff",
                  }}
                >
                  <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                    {emp.empNo}
                  </td>
                  <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0" }}>{emp.name}</td>
                  <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                    {emp.dept}
                  </td>
                  <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                    {emp.grade}
                  </td>
                  <td style={{ padding: "7px 10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                    <Btn
                      small
                      variant={form.selected?.empNo === emp.empNo ? "primary" : "outline"}
                      onClick={() => setForm((f) => ({ ...f, selected: emp }))}
                    >
                      {form.selected?.empNo === emp.empNo ? "선택됨" : "선택"}
                    </Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {form.selected && (
          <div
            style={{
              background: "#F0F9FF",
              border: "1px solid #BAE6FD",
              borderRadius: 6,
              padding: "10px 14px",
              marginBottom: 14,
              fontSize: 16,
            }}
          >
            선택한 사원:{" "}
            <strong>
              {form.selected.name} ({form.selected.dept})
            </strong>
          </div>
        )}

        <div
          style={{
            background: "#f9f9f9",
            border: "1px solid #e0e0e0",
            borderRadius: 6,
            padding: 14,
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 600, color: "#444", marginBottom: 10 }}>
            SRM 역할 부여 *
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { value: "B", label: "사업담당자(B)" },
              { value: "C", label: "계약담당자(C)" },
              { value: "EXEC", label: "임원(EXEC)" },
              { value: "A", label: "관리자(A)" },
            ].map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                <input
                  type="radio"
                  name="newRole"
                  value={opt.value}
                  checked={form.role === opt.value}
                  onChange={() => setForm((f) => ({ ...f, role: opt.value }))}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── 권한그룹 추가 Modal ─────────────────────────────────────────────
function PermGroupAddModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("B");
  const [desc, setDesc] = useState("");

  const handleClose = () => {
    setName("");
    setRole("B");
    setDesc("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="권한그룹 추가"
      width={480}
      footer={
        <>
          <Btn variant="outline" onClick={handleClose}>
            취소
          </Btn>
          <Btn disabled={!name.trim()} onClick={() => { handleClose(); onAdd(); }}>
            등록
          </Btn>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 16, fontWeight: 500, color: "#555", display: "block", marginBottom: 4 }}>
            그룹명 *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="그룹명 입력"
            style={{
              width: "100%",
              padding: "7px 10px",
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: 16,
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: 16, fontWeight: 500, color: "#555", display: "block", marginBottom: 4 }}>
            대상 역할
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 10px",
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: 16,
              fontFamily: "inherit",
            }}
          >
            <option value="B">B-사업담당자</option>
            <option value="C">C-계약담당자</option>
            <option value="EXEC">EXEC-임원</option>
            <option value="A">A-관리자</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 16, fontWeight: 500, color: "#555", display: "block", marginBottom: 4 }}>
            설명
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="권한그룹 설명"
            rows={3}
            style={{
              width: "100%",
              padding: "7px 10px",
              border: "1px solid #ccc",
              borderRadius: 4,
              fontSize: 16,
              fontFamily: "inherit",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const { show } = useToast();

  // 내부 사용자 탭 상태
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [userRegisterOpen, setUserRegisterOpen] = useState(false);

  // 협력업체 관리 탭 상태
  const [vendors] = useState<Vendor[]>([...MOCK_VENDORS, ...PENDING_VENDORS]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendorDrawerOpen, setVendorDrawerOpen] = useState(false);

  // 권한그룹 탭 상태
  const [selectedGroup, setSelectedGroup] = useState<PermGroup | null>(null);
  const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
  const [groupAddOpen, setGroupAddOpen] = useState(false);

  // 사용자 비활성화/재활성화
  const handleDeactivate = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
          : u
      )
    );
    setUserDrawerOpen(false);
    setTimeout(() => {
      show("계정이 비활성화 처리되었습니다.", "success");
    }, 4000);
  };

  // 역할 변경
  const handleRoleChange = (id: string, role: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: role as User["role"] } : u))
    );
    setTimeout(() => {
      show("역할이 변경되었습니다.", "info");
    }, 4000);
  };

  // 사용자 등록
  const handleUserRegister = () => {
    setTimeout(() => {
      show("사용자가 등록되었습니다.", "info");
    }, 4000);
  };

  // 권한그룹 추가
  const handleGroupAdd = () => {
    setTimeout(() => {
      show("권한그룹이 등록되었습니다.", "success");
    }, 4000);
  };

  // ── 컬럼 정의 ──
  const userColumns: Column[] = [
    { key: "id", label: "사용자 ID", width: "90px", align: "center" },
    { key: "name", label: "이름", width: "80px", align: "center" },
    {
      key: "role",
      label: "역할",
      width: "120px",
      align: "center",
      render: (val) => <RoleBadge role={String(val)} />,
    },
    { key: "dept", label: "부서", align: "left" },
    { key: "email", label: "이메일", align: "left" },
    {
      key: "status",
      label: "상태",
      width: "90px",
      align: "center",
      render: (val) => <StatusBadge status={String(val)} />,
    },
    { key: "createdAt", label: "등록일", width: "100px", align: "center" },
  ];

  const vendorColumns: Column[] = [
    { key: "id", label: "업체 ID", width: "80px", align: "center" },
    { key: "name", label: "업체명", align: "left" },
    { key: "bizNo", label: "사업자번호", width: "130px", align: "center" },
    { key: "category", label: "업종", width: "110px", align: "center" },
    { key: "contactName", label: "담당자", width: "80px", align: "center" },
    {
      key: "status",
      label: "상태",
      width: "90px",
      align: "center",
      render: (val) => <StatusBadge status={String(val)} />,
    },
    { key: "joinedAt", label: "가입일", width: "100px", align: "center" },
  ];

  const permGroupColumns: Column[] = [
    { key: "id", label: "그룹 ID", width: "80px", align: "center" },
    { key: "name", label: "그룹명", align: "left" },
    {
      key: "role",
      label: "대상 역할",
      width: "120px",
      align: "center",
      render: (val) => <RoleBadge role={String(val)} />,
    },
    { key: "userCount", label: "소속 인원", width: "90px", align: "center" },
    { key: "description", label: "설명", align: "left" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader title="사용자·협력업체 관리 (SCR-S-15)" />

      <Tabs
        tabs={[
          { id: "users", label: "내부 사용자" },
          { id: "vendors", label: "협력업체 관리" },
          { id: "groups", label: "권한그룹" },
        ]}
      >
        {(tab) => (
          <>
            {/* ── Tab 1: 내부 사용자 ── */}
            {tab === "users" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <SearchForm
                  fields={[
                    { label: "이름", name: "name", type: "text", placeholder: "이름 검색" },
                    { label: "이메일", name: "email", type: "text", placeholder: "이메일 검색" },
                    { label: "부서", name: "dept", type: "text", placeholder: "부서 검색" },
                    {
                      label: "역할",
                      name: "role",
                      type: "select",
                      options: [
                        { label: "사업담당자(B)", value: "B" },
                        { label: "계약담당자(C)", value: "C" },
                        { label: "임원(EXEC)", value: "EXEC" },
                        { label: "관리자(A)", value: "A" },
                      ],
                    },
                    {
                      label: "상태",
                      name: "status",
                      type: "select",
                      options: [
                        { label: "활성", value: "ACTIVE" },
                        { label: "비활성", value: "INACTIVE" },
                      ],
                    },
                  ]}
                />
                <DataTable
                  columns={userColumns}
                  data={users as unknown as Record<string, unknown>[]}
                  sectionLabel="내부 사용자 목록"
                  actionButton={
                    <Btn onClick={() => setUserRegisterOpen(true)}>+ 사용자 등록</Btn>
                  }
                  onRowClick={(row) => {
                    setSelectedUser(row as unknown as User);
                    setUserDrawerOpen(true);
                  }}
                />
              </div>
            )}

            {/* ── Tab 2: 협력업체 관리 ── */}
            {tab === "vendors" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <SearchForm
                  fields={[
                    { label: "업체명", name: "name", type: "text", placeholder: "업체명 검색" },
                    {
                      label: "사업자번호",
                      name: "bizNo",
                      type: "text",
                      placeholder: "사업자번호 검색",
                    },
                    { label: "업종", name: "category", type: "text", placeholder: "업종 검색" },
                    {
                      label: "상태",
                      name: "status",
                      type: "select",
                      options: [
                        { label: "활성", value: "ACTIVE" },
                        { label: "비활성", value: "INACTIVE" },
                        { label: "승인대기", value: "PENDING" },
                      ],
                    },
                  ]}
                />
                <DataTable
                  columns={vendorColumns}
                  data={vendors as unknown as Record<string, unknown>[]}
                  sectionLabel="협력업체 목록"
                  onRowClick={(row) => {
                    setSelectedVendor(row as unknown as Vendor);
                    setVendorDrawerOpen(true);
                  }}
                />
              </div>
            )}

            {/* ── Tab 3: 권한그룹 ── */}
            {tab === "groups" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <DataTable
                  columns={permGroupColumns}
                  data={PERM_GROUPS as unknown as Record<string, unknown>[]}
                  sectionLabel="권한그룹 목록"
                  actionButton={
                    <Btn onClick={() => setGroupAddOpen(true)}>그룹 추가</Btn>
                  }
                  onRowClick={(row) => {
                    setSelectedGroup(row as unknown as PermGroup);
                    setGroupDrawerOpen(true);
                  }}
                />
              </div>
            )}
          </>
        )}
      </Tabs>

      {/* Drawers & Modals */}
      <UserDrawer
        user={selectedUser}
        open={userDrawerOpen}
        onClose={() => setUserDrawerOpen(false)}
        onDeactivate={handleDeactivate}
        onRoleChange={handleRoleChange}
      />

      <VendorDetailDrawer
        vendor={selectedVendor}
        open={vendorDrawerOpen}
        onClose={() => setVendorDrawerOpen(false)}
      />

      <PermGroupDrawer
        group={selectedGroup}
        open={groupDrawerOpen}
        onClose={() => setGroupDrawerOpen(false)}
      />

      <UserRegisterModal
        open={userRegisterOpen}
        onClose={() => setUserRegisterOpen(false)}
        onRegister={handleUserRegister}
      />

      <PermGroupAddModal
        open={groupAddOpen}
        onClose={() => setGroupAddOpen(false)}
        onAdd={handleGroupAdd}
      />
    </div>
  );
}
