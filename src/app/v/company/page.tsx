"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import Tabs from "@/components/Tabs";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { useToast } from "@/components/Toast";
import {
  MY_COMPANY,
  MY_CONTACTS,
  type ContactPerson,
} from "@/lib/mock/users";

// ─── 유틸 ─────────────────────────────────────────────────────────────────────
function FieldRow({
  label,
  value,
  required,
  edit,
  readOnly,
  children,
}: {
  label: string;
  value?: string;
  required?: boolean;
  edit?: boolean;
  readOnly?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <tr>
      <th
        style={{
          width: 160,
          padding: "10px 16px",
          background: "#f9fafb",
          borderBottom: "1px solid #e5e7eb",
          borderRight: "1px solid #e5e7eb",
          textAlign: "left",
          fontSize: 16,
          fontWeight: 600,
          color: "#374151",
          whiteSpace: "nowrap",
        }}
      >
        {label}
        {required && <span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>}
      </th>
      <td
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid #e5e7eb",
          fontSize: 16,
          color: "#111827",
        }}
      >
        {readOnly ? (
          <span style={{ color: "#6B7280" }}>{value}</span>
        ) : edit ? (
          children ?? (
            <input
              defaultValue={value}
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 4,
                padding: "6px 10px",
                fontSize: 16,
                width: "100%",
                maxWidth: 360,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          )
        ) : (
          value
        )}
      </td>
    </tr>
  );
}

// ─── 기업정보 탭 ──────────────────────────────────────────────────────────────
function CompanyInfoTab() {
  const [editMode, setEditMode] = useState(false);
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const { show } = useToast();

  const [company, setCompany] = useState({ ...MY_COMPANY });
  const [form, setForm] = useState({ ...MY_COMPANY });

  const handleSave = () => {
    setCompany({ ...form });
    setEditMode(false);
    setTimeout(() => {
      show("기업정보가 저장되었습니다.", "info");
    }, 4000);
  };

  const handleCancel = () => {
    setForm({ ...company });
    setEditMode(false);
  };

  return (
    <div>
      {/* 기업 기본정보 카드 */}
      <div
        style={{
          background: "#FAF7F2",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          marginBottom: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid #e5e7eb",
            background: "#f9fafb",
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>
            기업 기본정보
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {editMode ? (
              <>
                <button
                  onClick={handleCancel}
                  style={{
                    background: "#ffffff",
                    color: "#654024",
                    border: "1px solid #CFCFCF",
                    borderRadius: 4,
                    padding: "6px 16px",
                    fontSize: 16,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    background: "#654024",
                    color: "#fff",
                    border: "1px solid #DFE8F0",
                    borderRadius: 4,
                    padding: "6px 16px",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  저장
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  background: "#ffffff",
                  color: "#654024",
                  border: "1px solid #CFCFCF",
                  borderRadius: 4,
                  padding: "6px 16px",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                ✎ 수정/저장
              </button>
            )}
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <FieldRow
              label="사업자번호"
              value={company.bizNo}
              readOnly
            />
            <FieldRow
              label="상호명"
              value={company.name}
              readOnly
            />
            <FieldRow
              label="대표자명"
              required
              edit={editMode}
              value={form.ceoName}
            >
              <input
                value={form.ceoName}
                onChange={(e) => setForm((f) => ({ ...f, ceoName: e.target.value }))}
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  padding: "6px 10px",
                  fontSize: 16,
                  width: "100%",
                  maxWidth: 360,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </FieldRow>
            <FieldRow
              label="업종"
              required
              edit={editMode}
              value={form.category}
            >
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  padding: "6px 10px",
                  fontSize: 16,
                  width: "100%",
                  maxWidth: 360,
                  outline: "none",
                  fontFamily: "inherit",
                  background: "#FAF7F2",
                }}
              >
                <option>전기공사업</option>
                <option>전기통신공사업</option>
                <option>전기설비업</option>
                <option>소방시설공사업</option>
              </select>
            </FieldRow>
            <FieldRow
              label="업태"
              edit={editMode}
              value={form.bizType}
            >
              <input
                value={form.bizType}
                onChange={(e) => setForm((f) => ({ ...f, bizType: e.target.value }))}
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  padding: "6px 10px",
                  fontSize: 16,
                  width: "100%",
                  maxWidth: 360,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </FieldRow>
            <FieldRow
              label="전화번호"
              required
              edit={editMode}
              value={form.tel}
            >
              <input
                value={form.tel}
                onChange={(e) => setForm((f) => ({ ...f, tel: e.target.value }))}
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  padding: "6px 10px",
                  fontSize: 16,
                  width: "100%",
                  maxWidth: 240,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </FieldRow>
            <FieldRow
              label="이메일"
              value={company.email}
              readOnly
            />
            <FieldRow
              label="주소"
              required
              edit={editMode}
              value={form.address}
            >
              <input
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  padding: "6px 10px",
                  fontSize: 16,
                  width: "100%",
                  maxWidth: 480,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </FieldRow>
            <tr>
              <th
                style={{
                  width: 160,
                  padding: "10px 16px",
                  background: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                  borderRight: "1px solid #e5e7eb",
                  textAlign: "left",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                등록일
              </th>
              <td
                style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: 16,
                }}
              >
                {company.registeredAt}
              </td>
            </tr>
            <tr>
              <th
                style={{
                  width: 160,
                  padding: "10px 16px",
                  background: "#f9fafb",
                  borderRight: "1px solid #e5e7eb",
                  textAlign: "left",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                계정 상태
              </th>
              <td style={{ padding: "10px 16px", fontSize: 16 }}>
                <StatusBadge status={company.status} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 비밀번호 관리 카드 */}
      <div
        style={{
          background: "#FAF7F2",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>
            비밀번호 관리
          </span>
          <span style={{ fontSize: 15, color: "#6B7280", marginLeft: 16 }}>
            마지막 변경일: 2025-01-15
          </span>
        </div>
        <button
          onClick={() => setPwModalOpen(true)}
          style={{
            background: "#ffffff",
            color: "#654024",
            border: "1px solid #CFCFCF",
            borderRadius: 4,
            padding: "7px 18px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          비밀번호 변경 →
        </button>
      </div>

      {/* 비밀번호 변경 Modal */}
      <PasswordChangeModal
        open={pwModalOpen}
        onClose={() => setPwModalOpen(false)}
        onSuccess={() => {
          setPwModalOpen(false);
          setTimeout(() => show("비밀번호가 변경되었습니다.", "info"), 4000);
        }}
      />
    </div>
  );
}

// ─── 비밀번호 변경 Modal ──────────────────────────────────────────────────────
function PasswordChangeModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
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
      onSuccess();
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
              background: "#ffffff",
              color: "#654024",
              border: "1px solid #CFCFCF",
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
              background: "#654024",
              color: "#fff",
              border: "1px solid #DFE8F0",
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
          <label style={{ fontSize: 16, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
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
          {errors.cur && (
            <p style={{ margin: "4px 0 0", fontSize: 15, color: "#EF4444" }}>{errors.cur}</p>
          )}
        </div>
        <div>
          <label style={{ fontSize: 16, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
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
          <label style={{ fontSize: 16, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
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
          {errors.conf && (
            <p style={{ margin: "4px 0 0", fontSize: 15, color: "#EF4444" }}>{errors.conf}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ─── 담당자 추가 Modal ────────────────────────────────────────────────────────
function ContactAddModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (contact: ContactPerson) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    dept: "",
    position: "",
    tel: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "담당자명을 입력하세요.";
    if (!form.email.trim()) {
      e.email = "이메일을 입력하세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "올바른 이메일 형식이 아닙니다.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onAdd({
        id: `CP${Date.now()}`,
        ...form,
        isMain: false,
      });
      setForm({ name: "", dept: "", position: "", tel: "", email: "" });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setForm({ name: "", dept: "", position: "", tel: "", email: "" });
    setErrors({});
    onClose();
  };

  const inputStyle = (err?: string): React.CSSProperties => ({
    width: "100%",
    border: err ? "1px solid #EF4444" : "1px solid #d1d5db",
    borderRadius: 4,
    padding: "8px 12px",
    fontSize: 16,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="+ 담당자 추가"
      width={520}
      footer={
        <>
          <button
            onClick={handleClose}
            style={{
              background: "#ffffff",
              color: "#654024",
              border: "1px solid #CFCFCF",
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
              background: "#654024",
              color: "#fff",
              border: "1px solid #DFE8F0",
              borderRadius: 4,
              padding: "7px 20px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            저장
          </button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 5 }}>
            담당자명 <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            style={inputStyle(errors.name)}
          />
          {errors.name && <p style={{ margin: "3px 0 0", fontSize: 15, color: "#EF4444" }}>{errors.name}</p>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 5 }}>부서</label>
            <input
              value={form.dept}
              onChange={(e) => setForm((f) => ({ ...f, dept: e.target.value }))}
              style={inputStyle()}
            />
          </div>
          <div>
            <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 5 }}>직급</label>
            <input
              value={form.position}
              onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
              style={inputStyle()}
            />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 5 }}>연락처</label>
          <input
            value={form.tel}
            onChange={(e) => setForm((f) => ({ ...f, tel: e.target.value }))}
            placeholder="010-0000-0000"
            style={inputStyle()}
          />
        </div>
        <div>
          <label style={{ fontSize: 16, fontWeight: 600, display: "block", marginBottom: 5 }}>
            이메일 <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            style={inputStyle(errors.email)}
          />
          {errors.email && <p style={{ margin: "3px 0 0", fontSize: 15, color: "#EF4444" }}>{errors.email}</p>}
        </div>
        <p style={{ margin: 0, fontSize: 15, color: "#6B7280", padding: "8px 12px", background: "#f0f9ff", borderRadius: 4 }}>
          담당자 추가 후 관리자 승인이 완료되면 계정이 활성화됩니다.
        </p>
      </div>
    </Modal>
  );
}

// ─── 담당자정보 탭 ────────────────────────────────────────────────────────────
function ContactsTab() {
  const [contacts, setContacts] = useState<ContactPerson[]>(MY_CONTACTS);
  const [addOpen, setAddOpen] = useState(false);
  const { show } = useToast();

  const handleAdd = (contact: ContactPerson) => {
    setContacts((prev) => [...prev, contact]);
    show("담당자가 추가되었습니다. 관리자 승인 후 활성화됩니다.", "info");
  };

  const columns = [
    { key: "name", label: "담당자명", align: "left" as const,
      render: (v: unknown, row: Record<string, unknown>) =>
        row.isMain
          ? <span>{String(v)} <span title="주계정" style={{ fontSize: 15 }}>🔒</span></span>
          : <span>{String(v)}</span>,
    },
    { key: "dept", label: "부서", width: "120px" },
    { key: "position", label: "직급", width: "100px" },
    { key: "tel", label: "연락처", width: "140px" },
    { key: "email", label: "이메일", align: "left" as const },
    {
      key: "isMain",
      label: "주담당자",
      width: "80px",
      render: (v: unknown) =>
        v ? (
          <span style={{ fontSize: 15, background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>
            주계정
          </span>
        ) : null,
    },
    {
      key: "id",
      label: "관리",
      width: "120px",
      render: (_v: unknown, row: Record<string, unknown>) => (
        <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
          <button
            style={{
              background: "#ffffff",
              color: "#654024",
              border: "1px solid #CFCFCF",
              borderRadius: 4,
              padding: "2px 10px",
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onClick={(e) => {
              e.stopPropagation();
              show(`${String(row.name)} 담당자 정보 수정 (구현 예정)`, "info");
            }}
          >
            수정
          </button>
          <button
            disabled={Boolean(row.isMain)}
            onClick={(e) => {
              e.stopPropagation();
              if (!row.isMain) {
                setContacts((prev) => prev.filter((c) => c.id !== row.id));
                show(`${String(row.name)} 담당자가 비활성화되었습니다.`, "info");
              }
            }}
            style={{
              background: row.isMain ? "#f3f4f6" : "#fff",
              color: row.isMain ? "#9ca3af" : "#EF4444",
              border: `1px solid ${row.isMain ? "#e5e7eb" : "#EF4444"}`,
              borderRadius: 4,
              padding: "2px 10px",
              fontSize: 15,
              cursor: row.isMain ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            비활성화
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={contacts as unknown as Record<string, unknown>[]}
        sectionLabel="담당자 목록"
        showExcel={false}
        showCheckbox={false}
        totalCount={contacts.length}
        actionButton={
          <button
            onClick={() => setAddOpen(true)}
            style={{
              background: "#654024",
              color: "#fff",
              border: "1px solid #DFE8F0",
              borderRadius: 4,
              padding: "6px 16px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            + 담당자 추가
          </button>
        }
      />
      <p style={{ margin: "8px 0 0", fontSize: 15, color: "#6B7280" }}>
        🔒 = 주계정 (비활성화 불가)
      </p>
      <ContactAddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}

// ─── 알림설정 탭 ──────────────────────────────────────────────────────────────
function NotificationTab() {
  const { show } = useToast();
  const [settings, setSettings] = useState({
    orderMail: true,
    noticeMail: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      show(`알림 설정이 저장되었습니다.`, "info");
      return next;
    });
  };

  return (
    <div
      style={{
        background: "#FAF7F2",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        maxWidth: 600,
      }}
    >
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid #e5e7eb",
          background: "#f9fafb",
        }}
      >
        <span style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>
          이메일 알림 설정
        </span>
      </div>
      {[
        {
          key: "orderMail" as const,
          label: "발주메일 수신",
          desc: "새로운 발주 요청 시 이메일 수신",
        },
        {
          key: "noticeMail" as const,
          label: "공지알림 수신",
          desc: "시스템 공지사항 이메일 수신",
        },
      ].map((item) => (
        <div
          key={item.key}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#111827" }}>
              {item.label}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 15, color: "#6B7280" }}>
              {item.desc}
            </p>
          </div>
          <button
            role="switch"
            aria-checked={settings[item.key]}
            onClick={() => toggle(item.key)}
            style={{
              width: 48,
              height: 26,
              borderRadius: 999,
              background: settings[item.key] ? "#00a7ea" : "#d1d5db",
              border: "none",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                left: settings[item.key] ? 25 : 3,
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
  );
}

// ─── 활동이력 탭 ──────────────────────────────────────────────────────────────
const ACTIVITY_DATA = [
  { date: "2026-04-19", type: "입찰참여", title: "태양광 인버터 구매 입찰", status: "투찰 완료", result: "대기중" },
  { date: "2026-04-15", type: "견적제출", title: "서버실 UPS 교체 견적요청", status: "견적 제출완료", result: "—" },
  { date: "2026-03-20", type: "입찰참여", title: "변압기 교체 공사 입찰", status: "투찰 완료", result: "낙찰" },
  { date: "2026-02-10", type: "계약체결", title: "태양광 인버터 납품 계약", status: "계약완료", result: "진행중" },
];

function ActivityTab() {
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-12-31");
  const [typeFilter, setTypeFilter] = useState("전체");

  const filtered = ACTIVITY_DATA.filter((a) => {
    const inRange = a.date >= dateFrom && a.date <= dateTo;
    const matchType = typeFilter === "전체" || a.type === typeFilter;
    return inRange && matchType;
  });

  const columns = [
    { key: "date", label: "일자", width: "100px" },
    { key: "type", label: "구분", width: "100px" },
    { key: "title", label: "내용", align: "left" as const },
    { key: "status", label: "처리상태", width: "130px" },
    {
      key: "result",
      label: "처리결과",
      width: "100px",
      render: (v: unknown) => {
        const val = String(v);
        if (val === "낙찰") return <span style={{ color: "#065F46", fontWeight: 700 }}>낙찰</span>;
        if (val === "탈락") return <span style={{ color: "#991B1B" }}>탈락</span>;
        return <span style={{ color: "#6B7280" }}>{val}</span>;
      },
    },
  ];

  const summary = {
    quote: filtered.filter((a) => a.type === "견적제출").length,
    bid: filtered.filter((a) => a.type === "입찰참여").length,
    award: filtered.filter((a) => a.result === "낙찰").length,
  };

  return (
    <div>
      {/* 필터 */}
      <div
        style={{
          background: "#FAF7F2",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "14px 20px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600 }}>기간:</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          style={{ border: "1px solid #d1d5db", borderRadius: 4, padding: "5px 10px", fontSize: 16, fontFamily: "inherit" }}
        />
        <span style={{ color: "#6B7280" }}>~</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          style={{ border: "1px solid #d1d5db", borderRadius: 4, padding: "5px 10px", fontSize: 16, fontFamily: "inherit" }}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ border: "1px solid #d1d5db", borderRadius: 4, padding: "5px 10px", fontSize: 16, fontFamily: "inherit", background: "#ffffff" }}
        >
          {["전체", "견적제출", "입찰참여", "계약체결"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* 요약 카드 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "견적제출", count: summary.quote, color: "#00a7ea" },
          { label: "입찰참여", count: summary.bid, color: "#3B82F6" },
          { label: "낙찰", count: summary.award, color: "#10B981" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#FAF7F2",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "16px 20px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: 15, color: "#6B7280" }}>{s.label}</p>
            <p style={{ margin: "6px 0 0", fontSize: 31, fontWeight: 700, color: s.color }}>
              {summary.quote !== undefined ? s.count : 0}
              <span style={{ fontSize: 16, fontWeight: 400, color: "#9CA3AF", marginLeft: 3 }}>건</span>
            </p>
          </div>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered as unknown as Record<string, unknown>[]}
        sectionLabel="활동이력"
        showExcel={false}
        showCheckbox={false}
        totalCount={filtered.length}
      />
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────
export default function CompanyPage() {
  const tabs = [
    { id: "company", label: "기업정보" },
    { id: "contacts", label: "담당자정보" },
    { id: "notification", label: "알림설정" },
    { id: "activity", label: "활동이력" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <PageHeader title="기업정보" />
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
            if (active === "company") return <CompanyInfoTab />;
            if (active === "contacts") return <ContactsTab />;
            if (active === "notification") return <NotificationTab />;
            if (active === "activity") return <ActivityTab />;
            return null;
          }}
        </Tabs>
      </div>
    </div>
  );
}
