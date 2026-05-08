"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import DataTable, { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Drawer from "@/components/Drawer";
import Modal from "@/components/Modal";
import SearchForm from "@/components/SearchForm";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/Toast";
import { MOCK_NOTICES } from "@/lib/mock/common";
import {
  MOCK_MANUALS,
  MOCK_SYSTEM_SETTINGS,
  MOCK_COMMON_CODES,
  MOCK_AUDIT_LOGS,
  A_SYSTEM_STATS,
  ADMIN_SYSTEM_REQUESTS,
  type CommonCode,
  type AuditLog,
  type SystemSetting,
  type ManualDoc,
  type SystemRequest,
} from "@/lib/mock/items";
import type { Notice } from "@/lib/types";

// ────────── 스타일 헬퍼 ─────────────────────────────────────────────────────
const btnPrimary: React.CSSProperties = {
  padding: "6px 14px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  border: "1px solid #DFE8F0",
  background: "#654024",
  color: "#ffffff",
};
const btnOutline: React.CSSProperties = {
  padding: "6px 14px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  border: "1px solid #CFCFCF",
  background: "#ffffff",
  color: "#654024",
};
const btnDanger: React.CSSProperties = {
  padding: "6px 14px", borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  border: "1px solid #CFCFCF",
  background: "#ffffff",
  color: "#654024",
};
const labelStyle: React.CSSProperties = {
  fontSize: 16,
  color: "#555",
  fontWeight: 500,
  minWidth: 100,
  flexShrink: 0,
};
const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "6px 8px",
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 16,
  fontFamily: "inherit",
};
const fieldRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 12,
};

// ────────── 탭 목록 ─────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard", label: "대시보드" },
  { id: "requests", label: "요청사항" },
  { id: "notices", label: "공지사항" },
  { id: "manuals", label: "매뉴얼" },
  { id: "settings", label: "시스템 설정" },
  { id: "codes", label: "공통코드" },
  { id: "audit", label: "감사 로그" },
];

const STATUS_REQ_LABEL: Record<string, string> = {
  PENDING: "접수",
  IN_REVIEW: "검토중",
  RESOLVED: "처리완료",
  CLOSED: "종결",
};

// ════════════════════════════════════════════════════════════════════════════
// 대시보드 탭
// ════════════════════════════════════════════════════════════════════════════
function DashboardTab({ onTabChange }: { onTabChange: (id: string) => void }) {
  const stats = A_SYSTEM_STATS;
  const recentLogs = MOCK_AUDIT_LOGS.slice(0, 10);

  const cards = [
    { label: "내부사용자", value: `${stats.internalUsers} 명`, tabId: null },
    { label: "협력업체", value: `${stats.vendors} 업체`, tabId: null },
    { label: "진행중 입찰", value: `${stats.activeBids} 건`, tabId: null },
    { label: "이번달 계약", value: `${stats.monthlyContracts} 건`, tabId: null },
  ];

  const logColumns: Column[] = [
    { key: "createdAt", label: "발생일시", width: "150px", align: "center" },
    { key: "action", label: "이벤트유형", align: "left" },
    { key: "userName", label: "액터", width: "90px", align: "center" },
    { key: "target", label: "대상", width: "130px", align: "center" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {cards.map((c) => (
          <div
            key={c.label}
            onClick={() => c.tabId && onTabChange(c.tabId)}
            style={{
              background: "#FAF7F2",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: "20px 24px",
              textAlign: "center",
              cursor: c.tabId ? "pointer" : "default",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: "#00a7ea" }}>{c.value}</div>
            <div style={{ fontSize: 16, color: "#555", marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#FAF7F2", border: "1px solid #e0e0e0", borderRadius: 6, padding: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 700, color: "#333" }}>최근 감사로그</span>
          <button
            style={{ ...btnOutline, padding: "4px 12px", fontSize: 12 }}
            onClick={() => onTabChange("audit")}
          >
            전체 보기
          </button>
        </div>
        <DataTable
          columns={logColumns}
          data={recentLogs as unknown as Record<string, unknown>[]}
          sectionLabel=""
          showExcel={false}
          showCheckbox={false}
        />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 요청사항 탭
// ════════════════════════════════════════════════════════════════════════════
function SystemRequestsTab() {
  const { show } = useToast();
  const [requests, setRequests] = useState<SystemRequest[]>(ADMIN_SYSTEM_REQUESTS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<SystemRequest | null>(null);
  const [statusValue, setStatusValue] = useState<string>("PENDING");

  function handleRowClick(row: Record<string, unknown>) {
    const req = requests.find((r) => r.id === (row.id as string));
    if (!req) return;
    setSelected(req);
    setStatusValue(req.status);
    setDrawerOpen(true);
  }

  function handleResolve() {
    if (!selected) return;
    const newStatus = statusValue as SystemRequest["status"];
    setRequests((prev) =>
      prev.map((r) => (r.id === selected.id ? { ...r, status: newStatus } : r))
    );
    setDrawerOpen(false);
    show("요청사항이 처리되었습니다.", "info");
  }

  const columns: Column[] = [
    { key: "id", label: "번호", width: "90px", align: "center" },
    { key: "title", label: "제목", align: "left" },
    { key: "type", label: "유형", width: "90px", align: "center" },
    { key: "requester", label: "요청자", width: "90px", align: "center" },
    { key: "dept", label: "부서", width: "110px", align: "center" },
    { key: "registeredAt", label: "등록일", width: "110px", align: "center" },
    {
      key: "status",
      label: "처리상태",
      width: "100px",
      align: "center",
      render: (v) => (
        <StatusBadge status={STATUS_REQ_LABEL[v as string] ?? (v as string)} />
      ),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={requests as unknown as Record<string, unknown>[]}
        sectionLabel="시스템 요청사항 목록"
        showExcel={true}
        showCheckbox={false}
        onRowClick={handleRowClick}
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={`요청사항 상세 — ${selected?.id}`}
        width={600}
      >
        {selected && (
          <div>
            <div style={{ marginBottom: 20 }}>
              {[
                { label: "유형", value: selected.type },
                { label: "제목", value: selected.title },
                { label: "요청자", value: `${selected.requester} (${selected.dept})` },
                { label: "등록일", value: selected.registeredAt },
              ].map((item) => (
                <div key={item.label} style={{ ...fieldRow, marginBottom: 10 }}>
                  <span style={{ ...labelStyle, minWidth: 70 }}>{item.label}</span>
                  <span style={{ fontSize: 16, color: "#333" }}>{item.value}</span>
                </div>
              ))}
              <div style={{ ...fieldRow, alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ ...labelStyle, minWidth: 70, marginTop: 2 }}>내용</span>
                <div
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: "#333",
                    background: "#f8f8f8",
                    border: "1px solid #e0e0e0",
                    borderRadius: 4,
                    padding: "8px 10px",
                    lineHeight: 1.7,
                  }}
                >
                  {selected.content}
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#f5f5f5",
                borderRadius: 6,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 10 }}>처리</div>
              <div style={fieldRow}>
                <label style={{ ...labelStyle, minWidth: 70 }}>처리상태</label>
                <select
                  style={inputStyle}
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                >
                  {Object.entries(STATUS_REQ_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button style={btnOutline} onClick={() => setDrawerOpen(false)}>취소</button>
              <button style={btnPrimary} onClick={handleResolve}>처리완료</button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 공지사항 탭
// ════════════════════════════════════════════════════════════════════════════
function NoticesTab() {
  const { show } = useToast();
  const [notices, setNotices] = useState<Notice[]>(MOCK_NOTICES);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"new" | "edit">("new");
  const [selected, setSelected] = useState<Notice | null>(null);
  const [form, setForm] = useState({ title: "", content: "", isPinned: false });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  function openNew() {
    setDrawerMode("new");
    setForm({ title: "", content: "", isPinned: false });
    setSelected(null);
    setDrawerOpen(true);
  }

  function handleRowClick(row: Record<string, unknown>) {
    const n = notices.find((x) => x.id === (row.id as string));
    if (!n) return;
    setSelected(n);
    setForm({ title: n.title, content: n.content, isPinned: n.isPinned });
    setDrawerMode("edit");
    setDrawerOpen(true);
  }

  function handleSave() {
    if (!form.title || !form.content) return;
    setTimeout(() => {
      if (drawerMode === "new") {
        const newNotice: Notice = {
          id: "N" + String(Date.now()).slice(-3),
          title: form.title,
          content: form.content,
          author: "관리자",
          createdAt: new Date().toISOString().slice(0, 10),
          isPinned: form.isPinned,
        };
        setNotices((prev) => [newNotice, ...prev]);
      } else if (selected) {
        setNotices((prev) =>
          prev.map((n) =>
            n.id === selected.id
              ? { ...n, title: form.title, content: form.content, isPinned: form.isPinned }
              : n
          )
        );
      }
      setDrawerOpen(false);
      show("공지 등록이 완료되었습니다.");
    }, 4000);
  }

  function handleDelete() {
    if (!selected) return;
    setDeleteModalOpen(false);
    setNotices((prev) => prev.filter((n) => n.id !== selected.id));
    setDrawerOpen(false);
    show("공지사항이 삭제되었습니다.", "info");
  }

  const columns: Column[] = [
    { key: "id", label: "번호", width: "70px", align: "center" },
    { key: "title", label: "제목", align: "left" },
    { key: "author", label: "작성자", width: "90px", align: "center" },
    { key: "createdAt", label: "등록일", width: "110px", align: "center" },
    {
      key: "isPinned",
      label: "고정",
      width: "60px",
      align: "center",
      render: (v) => (v ? "★" : ""),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={notices as unknown as Record<string, unknown>[]}
        sectionLabel="공지사항 목록"
        showExcel={false}
        showCheckbox={false}
        onRowClick={handleRowClick}
        actionButton={
          <button style={btnPrimary} onClick={openNew}>+ 공지 작성</button>
        }
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerMode === "new" ? "공지 작성" : `공지 수정 — ${selected?.id}`}
        width={640}
      >
        <div style={fieldRow}>
          <label style={labelStyle}>제목 *</label>
          <input
            style={inputStyle}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="공지 제목 입력"
          />
        </div>
        <div style={{ ...fieldRow, alignItems: "flex-start" }}>
          <label style={{ ...labelStyle, marginTop: 4 }}>내용 *</label>
          <textarea
            rows={8}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder="공지 내용을 입력하세요."
          />
        </div>
        <div style={fieldRow}>
          <label style={labelStyle}>상단 고정</label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 16 }}>
            <input
              type="checkbox"
              checked={form.isPinned}
              onChange={(e) => setForm((f) => ({ ...f, isPinned: e.target.checked }))}
            />
            중요공지로 상단 고정
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <button style={btnOutline} onClick={() => setDrawerOpen(false)}>취소</button>
          {drawerMode === "edit" && (
            <button style={btnDanger} onClick={() => setDeleteModalOpen(true)}>삭제</button>
          )}
          <button style={btnPrimary} onClick={handleSave}>저장</button>
        </div>
      </Drawer>

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="공지사항 삭제"
        width={400}
        footer={
          <>
            <button style={btnOutline} onClick={() => setDeleteModalOpen(false)}>취소</button>
            <button style={btnDanger} onClick={handleDelete}>삭제</button>
          </>
        }
      >
        <p style={{ fontSize: 17, color: "#333" }}>
          해당 공지사항을 삭제하시겠습니까?<br />
          삭제된 공지는 복구할 수 없습니다.
        </p>
      </Modal>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 매뉴얼 탭
// ════════════════════════════════════════════════════════════════════════════
function ManualsTab() {
  const { show } = useToast();
  const [manuals, setManuals] = useState<ManualDoc[]>(MOCK_MANUALS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", category: "사용자", version: "" });
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  function handleSave() {
    if (!form.title || !form.version || !uploadFile) return;
    setTimeout(() => {
      const newDoc: ManualDoc = {
        id: "MD" + String(Date.now()).slice(-3),
        title: form.title,
        category: form.category,
        version: form.version,
        updatedAt: new Date().toISOString().slice(0, 10),
        fileSize: (uploadFile.size / (1024 * 1024)).toFixed(1) + "MB",
      };
      setManuals((prev) => [newDoc, ...prev]);
      setModalOpen(false);
      setForm({ title: "", category: "사용자", version: "" });
      setUploadFile(null);
      show("매뉴얼이 업로드되었습니다.");
    }, 4000);
  }

  const columns: Column[] = [
    { key: "title", label: "제목", align: "left" },
    { key: "category", label: "구분", width: "80px", align: "center" },
    { key: "version", label: "버전", width: "70px", align: "center" },
    { key: "updatedAt", label: "수정일", width: "110px", align: "center" },
    { key: "fileSize", label: "파일크기", width: "90px", align: "center" },
    {
      key: "id",
      label: "다운로드",
      width: "90px",
      align: "center",
      render: () => (
        <button
          style={{ ...btnOutline, padding: "3px 8px", fontSize: 12 }}
          onClick={(e) => e.stopPropagation()}
        >
          다운로드
        </button>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={manuals as unknown as Record<string, unknown>[]}
        sectionLabel="매뉴얼 목록"
        showExcel={false}
        showCheckbox={false}
        actionButton={
          <button style={btnPrimary} onClick={() => setModalOpen(true)}>
            + 매뉴얼 업로드
          </button>
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="매뉴얼 업로드"
        width={480}
        footer={
          <>
            <button style={btnOutline} onClick={() => setModalOpen(false)}>취소</button>
            <button style={btnPrimary} onClick={handleSave}>업로드</button>
          </>
        }
      >
        <div style={fieldRow}>
          <label style={labelStyle}>제목 *</label>
          <input
            style={inputStyle}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="매뉴얼 제목"
          />
        </div>
        <div style={fieldRow}>
          <label style={labelStyle}>구분 *</label>
          <select
            style={inputStyle}
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            <option value="사용자">사용자</option>
            <option value="관리자">관리자</option>
          </select>
        </div>
        <div style={fieldRow}>
          <label style={labelStyle}>버전 *</label>
          <input
            style={inputStyle}
            value={form.version}
            onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
            placeholder="예: 2.2"
          />
        </div>
        <div style={fieldRow}>
          <label style={labelStyle}>파일 *</label>
          <label
            style={{
              ...btnOutline,
              cursor: "pointer",
              padding: "5px 12px",
            }}
          >
            파일 선택 (PDF/DOCX)
            <input
              type="file"
              accept=".pdf,.docx"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && f.size > 50 * 1024 * 1024) {
                  show("파일 크기는 50MB 이하여야 합니다.", "error");
                  return;
                }
                setUploadFile(f ?? null);
              }}
            />
          </label>
        </div>
        {uploadFile && (
          <p style={{ fontSize: 15, color: "#333", marginTop: 4, marginLeft: 108 }}>
            {uploadFile.name}
          </p>
        )}
      </Modal>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 시스템 설정 탭
// ════════════════════════════════════════════════════════════════════════════
function SystemSettingsTab() {
  const { show } = useToast();
  const [settings, setSettings] = useState<SystemSetting[]>(MOCK_SYSTEM_SETTINGS);

  function updateValue(key: string, value: string) {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  }

  function handleSave() {
    setTimeout(() => {
      show("시스템 설정이 저장되었습니다.");
    }, 4000);
  }

  return (
    <div>
      <div
        style={{
          background: "#FAF7F2",
          border: "1px solid #e0e0e0",
          borderRadius: 6,
          padding: 20,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: "#333" }}>
          시스템 설정 항목
        </div>
        {settings.map((s) => (
          <div
            key={s.key}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid #f0f0f0",
              gap: 12,
            }}
          >
            <span style={{ minWidth: 200, fontSize: 16, color: "#444", fontWeight: 500 }}>
              {s.label}
            </span>
            {s.type === "boolean" ? (
              // 토글 스위치
              <button
                onClick={() => updateValue(s.key, s.value === "true" ? "false" : "true")}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  border: "none",
                  background: s.value === "true" ? "#00a7ea" : "#ccc",
                  cursor: "pointer",
                  position: "relative",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
                aria-label={s.label}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    left: s.value === "true" ? 24 : 3,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#FAF7F2",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
            ) : (
              <input
                type="number"
                value={s.value}
                onChange={(e) => updateValue(s.key, e.target.value)}
                style={{ ...inputStyle, maxWidth: 120, flex: "none" }}
              />
            )}
            <span style={{ fontSize: 15, color: "#888" }}>
              {s.type === "boolean"
                ? s.value === "true"
                  ? "ON"
                  : "OFF"
                : ""}
            </span>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button style={btnPrimary} onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 공통코드 탭
// ════════════════════════════════════════════════════════════════════════════
function CommonCodesTab() {
  const { show } = useToast();
  const [codes, setCodes] = useState<CommonCode[]>(MOCK_COMMON_CODES);
  const [selectedGroup, setSelectedGroup] = useState<string>("BID_METHOD");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"new" | "edit">("new");
  const [selected, setSelected] = useState<CommonCode | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ groupCode: "", groupName: "", code: "", name: "", sortOrder: "1" });

  const groups = Array.from(
    new Map(codes.map((c) => [c.groupCode, c.groupName])).entries()
  ).map(([groupCode, groupName]) => ({ groupCode, groupName }));

  const filteredCodes = codes.filter((c) => c.groupCode === selectedGroup);

  function openNew() {
    setDrawerMode("new");
    const grp = groups.find((g) => g.groupCode === selectedGroup);
    setForm({
      groupCode: selectedGroup,
      groupName: grp?.groupName ?? "",
      code: "",
      name: "",
      sortOrder: String(filteredCodes.length + 1),
    });
    setDrawerOpen(true);
  }

  function handleRowClick(row: Record<string, unknown>) {
    const c = codes.find((x) => x.id === (row.id as string));
    if (!c) return;
    setSelected(c);
    setForm({
      groupCode: c.groupCode,
      groupName: c.groupName,
      code: c.code,
      name: c.name,
      sortOrder: String(c.sortOrder),
    });
    setDrawerMode("edit");
    setDrawerOpen(true);
  }

  function handleSave() {
    if (!form.code || !form.name) return;
    setTimeout(() => {
      if (drawerMode === "new") {
        const newCode: CommonCode = {
          id: "CC" + String(Date.now()).slice(-3),
          groupCode: form.groupCode,
          groupName: form.groupName,
          code: form.code,
          name: form.name,
          sortOrder: Number(form.sortOrder),
          active: true,
        };
        setCodes((prev) => [...prev, newCode]);
      } else if (selected) {
        setCodes((prev) =>
          prev.map((c) =>
            c.id === selected.id
              ? { ...c, code: form.code, name: form.name, sortOrder: Number(form.sortOrder) }
              : c
          )
        );
      }
      setDrawerOpen(false);
      show("코드가 등록되었습니다.");
    }, 4000);
  }

  function handleAddGroup() {
    setModalOpen(true);
    setForm({ groupCode: "", groupName: "", code: "", name: "", sortOrder: "1" });
  }

  function handleGroupSave() {
    if (!form.groupCode || !form.groupName) return;
    setModalOpen(false);
    show("코드그룹이 등록되었습니다.");
  }

  const columns: Column[] = [
    { key: "groupCode", label: "그룹코드", width: "130px", align: "center" },
    { key: "groupName", label: "그룹명", width: "100px", align: "center" },
    { key: "code", label: "코드", align: "left" },
    { key: "name", label: "코드명", align: "left" },
    { key: "sortOrder", label: "정렬순서", width: "80px", align: "center" },
    {
      key: "active",
      label: "활성여부",
      width: "90px",
      align: "center",
      render: (v) => <StatusBadge status={(v as boolean) ? "활성" : "비활성"} />,
    },
  ];

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {/* 좌측 코드그룹 목록 */}
      <div
        style={{
          width: 200,
          flexShrink: 0,
          background: "#FAF7F2",
          border: "1px solid #e0e0e0",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "10px 14px",
            borderBottom: "1px solid #e0e0e0",
            fontWeight: 700,
            fontSize: 16,
            color: "#333",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>코드그룹</span>
          <button
            style={{ ...btnPrimary, padding: "2px 8px", fontSize: 12 }}
            onClick={handleAddGroup}
          >
            + 그룹
          </button>
        </div>
        {groups.map((g) => {
          const isSelected = g.groupCode === selectedGroup;
          return (
            <button
              key={g.groupCode}
              onClick={() => setSelectedGroup(g.groupCode)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                border: "1px solid #CFCFCF",
                borderBottom: "1px solid #f0f0f0",
                background: isSelected ? "#e6f7fa" : "#fff",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 16,
                fontWeight: isSelected ? 700 : 400,
                color: isSelected ? "#00a7ea" : "#333",
                borderLeft: isSelected ? "3px solid #00a7ea" : "3px solid transparent",
              }}
            >
              <div>{g.groupName}</div>
              <div style={{ fontSize: 14, color: "#888", marginTop: 2 }}>{g.groupCode}</div>
            </button>
          );
        })}
      </div>

      {/* 우측 코드값 목록 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <DataTable
          columns={columns}
          data={filteredCodes as unknown as Record<string, unknown>[]}
          sectionLabel="코드 목록"
          showExcel={false}
          showCheckbox={false}
          onRowClick={handleRowClick}
          actionButton={
            <button style={btnPrimary} onClick={openNew}>+ 코드 추가</button>
          }
        />
      </div>

      {/* Drawer: 코드 추가/수정 */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerMode === "new" ? "코드 추가" : `코드 수정 — ${selected?.code}`}
        width={500}
      >
        <div style={fieldRow}>
          <label style={labelStyle}>그룹코드</label>
          <input
            style={{ ...inputStyle, background: "#f5f5f5" }}
            value={form.groupCode}
            disabled
          />
        </div>
        <div style={fieldRow}>
          <label style={labelStyle}>그룹명</label>
          <input
            style={{ ...inputStyle, background: "#f5f5f5" }}
            value={form.groupName}
            disabled
          />
        </div>
        <div style={fieldRow}>
          <label style={labelStyle}>코드 *</label>
          <input
            style={inputStyle}
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            placeholder="코드값 입력 (영문/숫자)"
          />
        </div>
        <div style={fieldRow}>
          <label style={labelStyle}>코드명 *</label>
          <input
            style={inputStyle}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="코드명 입력"
          />
        </div>
        <div style={fieldRow}>
          <label style={labelStyle}>정렬순서</label>
          <input
            style={{ ...inputStyle, maxWidth: 80 }}
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <button style={btnOutline} onClick={() => setDrawerOpen(false)}>취소</button>
          <button style={btnPrimary} onClick={handleSave}>저장</button>
        </div>
      </Drawer>

      {/* Modal: 코드그룹 추가 */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="코드그룹 추가"
        width={440}
        footer={
          <>
            <button style={btnOutline} onClick={() => setModalOpen(false)}>취소</button>
            <button style={btnPrimary} onClick={handleGroupSave}>저장</button>
          </>
        }
      >
        <div style={fieldRow}>
          <label style={labelStyle}>그룹코드 *</label>
          <input
            style={inputStyle}
            value={form.groupCode}
            onChange={(e) => setForm((f) => ({ ...f, groupCode: e.target.value }))}
            placeholder="예: UNIT_CODE"
          />
        </div>
        <div style={fieldRow}>
          <label style={labelStyle}>그룹명 *</label>
          <input
            style={inputStyle}
            value={form.groupName}
            onChange={(e) => setForm((f) => ({ ...f, groupName: e.target.value }))}
            placeholder="예: 단위코드"
          />
        </div>
      </Modal>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 감사 로그 탭
// ════════════════════════════════════════════════════════════════════════════
function AuditLogsTab() {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [filtered, setFiltered] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<AuditLog | null>(null);

  function handleSearch(values: Record<string, string>) {
    let result = [...logs];
    if (values.userName) {
      result = result.filter((l) => l.userName.includes(values.userName));
    }
    if (values.action) {
      result = result.filter((l) => l.action.includes(values.action));
    }
    setFiltered(result);
  }

  function handleRowClick(row: Record<string, unknown>) {
    const log = logs.find((l) => l.id === (row.id as string));
    if (log) {
      setSelected(log);
      setDrawerOpen(true);
    }
  }

  const columns: Column[] = [
    { key: "userName", label: "사용자", width: "90px", align: "center" },
    { key: "userId", label: "사용자ID", width: "80px", align: "center" },
    { key: "action", label: "액션", align: "left" },
    { key: "target", label: "대상", width: "140px", align: "center" },
    { key: "ip", label: "IP", width: "130px", align: "center" },
    { key: "createdAt", label: "일시", width: "140px", align: "center" },
  ];

  const auditDetail = selected
    ? JSON.stringify(
        {
          id: selected.id,
          userId: selected.userId,
          userName: selected.userName,
          action: selected.action,
          target: selected.target,
          ip: selected.ip,
          createdAt: selected.createdAt,
        },
        null,
        2
      )
    : "";

  return (
    <div>
      <SearchForm
        fields={[
          { label: "사용자", type: "text", name: "userName", placeholder: "사용자명 검색" },
          { label: "액션", type: "text", name: "action", placeholder: "액션 검색" },
          { label: "기간", type: "daterange", name: "date" },
        ]}
        onSearch={handleSearch}
      />

      {filtered.length === 0 ? (
        <EmptyState message="검색 결과가 없습니다." />
      ) : (
        <DataTable
          columns={columns}
          data={filtered as unknown as Record<string, unknown>[]}
          sectionLabel="감사 로그"
          showExcel={true}
          showCheckbox={false}
          onRowClick={handleRowClick}
        />
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={`감사 로그 상세 — ${selected?.id}`}
        width={560}
      >
        {selected && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#333" }}>기본 정보</div>
              {[
                { label: "사용자", value: `${selected.userName} (${selected.userId})` },
                { label: "액션", value: selected.action },
                { label: "대상", value: selected.target },
                { label: "IP", value: selected.ip },
                { label: "일시", value: selected.createdAt },
              ].map((item) => (
                <div key={item.label} style={{ ...fieldRow, marginBottom: 8 }}>
                  <span style={{ ...labelStyle, minWidth: 70 }}>{item.label}</span>
                  <span style={{ fontSize: 16, color: "#444" }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#333" }}>
                JSON 상세 로그
              </div>
              <pre
                style={{
                  background: "#1e1e1e",
                  color: "#d4d4d4",
                  borderRadius: 6,
                  padding: 16,
                  fontSize: 15,
                  overflow: "auto",
                  maxHeight: 300,
                  lineHeight: 1.6,
                  fontFamily: "'Consolas', 'Monaco', monospace",
                }}
              >
                {auditDetail}
              </pre>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 메인 페이지 컴포넌트
// ════════════════════════════════════════════════════════════════════════════
export default function SystemPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const pendingRequestCount = ADMIN_SYSTEM_REQUESTS.filter(
    (r) => r.status === "PENDING" || r.status === "IN_REVIEW"
  ).length;

  return (
    <div>
      <PageHeader title="시스템 환경설정" />

      {/* 탭 바 */}
      <div
        style={{
          display: "flex",
          borderBottom: "2px solid #e0e0e0",
          marginBottom: 20,
          background: "#FAF7F2",
          borderRadius: "6px 6px 0 0",
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          borderBottomColor: "#e0e0e0",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const badge = tab.id === "requests" && pendingRequestCount > 0 ? pendingRequestCount : null;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 22px",
                fontSize: 17,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? "#00a7ea" : "#555",
                borderBottom: isActive ? "2px solid #00a7ea" : "2px solid transparent",
                background: isActive ? "#f0fbfd" : "transparent",
                border: "1px solid #CFCFCF",
                borderBottomWidth: 2,
                borderBottomStyle: "solid",
                borderBottomColor: isActive ? "#00a7ea" : "transparent",
                cursor: "pointer",
                marginBottom: -2,
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {tab.label}
              {badge !== null && (
                <span
                  style={{
                    background: "#e53e3e",
                    color: "#fff",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "1px 6px",
                    lineHeight: 1.4,
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === "dashboard" && <DashboardTab onTabChange={setActiveTab} />}
        {activeTab === "requests" && <SystemRequestsTab />}
        {activeTab === "notices" && <NoticesTab />}
        {activeTab === "manuals" && <ManualsTab />}
        {activeTab === "settings" && <SystemSettingsTab />}
        {activeTab === "codes" && <CommonCodesTab />}
        {activeTab === "audit" && <AuditLogsTab />}
      </div>
    </div>
  );
}
