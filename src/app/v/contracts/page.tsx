"use client";

import React, { useState } from "react";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import SearchForm from "@/components/SearchForm";
import Drawer from "@/components/Drawer";
import Modal from "@/components/Modal";
import EmptyState from "@/components/EmptyState";
import Tabs from "@/components/Tabs";
import { useToast } from "@/components/Toast";
import {
  MOCK_CONTRACTS,
  MOCK_BONDS,
  MOCK_DOC_REQUESTS,
  MOCK_PMS_LOGS,
} from "@/lib/mock/contracts";
import type { Bond, DocRequest } from "@/lib/mock/contracts";
import type { Contract } from "@/lib/types";

// ── 인라인 유틸 ──────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString() + "원";
}

// ── 계약정보 탭 (읽기 전용) ─────────────────────────────────
function ContractDetailTab({ contract }: { contract: Contract }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px 24px",
        background: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: "20px",
      }}
    >
      {[
        ["계약번호", contract.id],
        ["계약명", contract.title],
        ["계약금액", fmt(contract.amount)],
        ["계약시작일", contract.startDate],
        ["계약종료일", contract.endDate],
        ["계약상태", contract.status],
        ["담당자", "이계약 (계약1팀)"],
        ["계약유형", "물품"],
        ["이행보증금률", "10%"],
        ["이행보증금액", fmt(Math.floor(contract.amount * 0.1))],
        ["계약서 파일", "계약서_" + contract.id + ".pdf"],
        ["특약사항", "품질보증기간 2년"],
      ].map(([label, value]) => (
        <div key={label} style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 16, color: "#6B7280", minWidth: 110, flexShrink: 0 }}>{label}</span>
          <span style={{ fontSize: 16, color: "#111", fontWeight: 500 }}>{value}</span>
        </div>
      ))}
      <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
        <button
          style={{
            background: "#ffffff",
            border: "1px solid #CFCFCF",
            color: "#654024",
            borderRadius: 4,
            padding: "6px 16px",
            fontSize: 16,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          계약서 다운로드
        </button>
      </div>
    </div>
  );
}

// ── 보증제출 탭 ──────────────────────────────────────────────
function BondSubmitTab({
  bonds,
  onOpenBondModal,
}: {
  bonds: Bond[];
  onOpenBondModal: () => void;
}) {
  const cols: Column[] = [
    { key: "type", label: "보증유형", width: "100px", align: "center" },
    { key: "amount", label: "보증금액", align: "right", render: (v) => fmt(Number(v)) },
    { key: "issuer", label: "발행기관", width: "120px", align: "center" },
    { key: "endDate", label: "만료일", width: "110px", align: "center" },
    {
      key: "status",
      label: "확인상태",
      width: "100px",
      align: "center",
      render: (v) => <StatusBadge status={String(v)} />,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onOpenBondModal}
          style={{
            background: "#654024",
            color: "#fff",
            border: "1px solid #DFE8F0",
            borderRadius: 4,
            padding: "6px 16px",
            fontSize: 16,
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
          }}
        >
          + 보증서 제출
        </button>
      </div>
      {bonds.length === 0 ? (
        <EmptyState message="제출된 보증서가 없습니다." />
      ) : (
        <DataTable
          columns={cols}
          data={bonds as unknown as Record<string, unknown>[]}
          sectionLabel="보증서"
          showExcel={false}
          showCheckbox={false}
        />
      )}
    </div>
  );
}

// ── 서류요청 탭 (협력업체용: 제출 버튼) ─────────────────────
function DocSubmitTab({
  docs,
  onSubmit,
}: {
  docs: DocRequest[];
  onSubmit: (id: string) => void;
}) {
  const cols: Column[] = [
    { key: "id", label: "요청번호", width: "130px", align: "center" },
    { key: "docName", label: "서류명", align: "left" },
    { key: "dueDate", label: "제출기한", width: "110px", align: "center" },
    {
      key: "status",
      label: "상태",
      width: "100px",
      align: "center",
      render: (v) => <StatusBadge status={String(v)} />,
    },
    {
      key: "id",
      label: "액션",
      width: "80px",
      align: "center",
      render: (v, row) =>
        row.status === "PENDING" ? (
          <button
            onClick={(e) => { e.stopPropagation(); onSubmit(String(v)); }}
            style={{
              background: "#654024",
              color: "#fff",
              border: "1px solid #DFE8F0",
              borderRadius: 4,
              padding: "3px 12px",
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            제출
          </button>
        ) : (
          <span style={{ fontSize: 15, color: "#9CA3AF" }}>완료</span>
        ),
    },
  ];

  if (docs.length === 0) {
    return <EmptyState message="요청된 서류가 없습니다. 계약담당자의 요청을 기다려 주세요." />;
  }

  return (
    <DataTable
      columns={cols}
      data={docs as unknown as Record<string, unknown>[]}
      sectionLabel="서류요청"
      showExcel={false}
      showCheckbox={false}
    />
  );
}

// ── 확인상태 탭 ──────────────────────────────────────────────
function ConfirmStatusTab({ contract }: { contract: Contract }) {
  const logs = MOCK_PMS_LOGS[contract.id] ?? [];
  const pmsStatus = contract.pmsStatus ?? "PENDING";

  const isActive = contract.status === "ACTIVE";
  const cardColor =
    pmsStatus === "SYNCED"
      ? { bg: "#F0FDF4", border: "#BBF7D0", color: "#16A34A" }
      : pmsStatus === "FAILED"
      ? { bg: "#FEF2F2", border: "#FECACA", color: "#DC2626" }
      : { bg: "#FEFCE8", border: "#FDE68A", color: "#D97706" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 17, color: "#555" }}>계약 상태:</span>
        <StatusBadge status={contract.status} />
      </div>

      {!isActive ? (
        <div
          style={{
            background: "#FEF3C7",
            border: "1px solid #FDE68A",
            borderRadius: 8,
            padding: "16px 20px",
            fontSize: 16,
            color: "#92400E",
          }}
        >
          계약이 아직 확정되지 않았습니다. 계약담당자의 최종 확정 후 PMS 연동 상태를 확인할 수 있습니다.
        </div>
      ) : (
        <div
          style={{
            background: cardColor.bg,
            border: `1px solid ${cardColor.border}`,
            borderRadius: 8,
            padding: "20px",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: cardColor.color, marginBottom: 12 }}>
            PMS 연동 상태: {pmsStatus}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
            {[
              ["PMS 수신일시", pmsStatus === "SYNCED" ? (logs[0]?.requestedAt ?? "-") : "-"],
              ["PMS 계약 ID", pmsStatus === "SYNCED" ? "PMS-" + contract.id : "-"],
              ["연동 테이블", "SRM_ORDER_CONTRACT"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 16, color: "#6B7280", minWidth: 100 }}>{label}</span>
                <span style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>{value}</span>
              </div>
            ))}
          </div>
          {pmsStatus === "FAILED" && (
            <div
              style={{
                marginTop: 12,
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 6,
                padding: "10px 14px",
                fontSize: 16,
                color: "#DC2626",
              }}
            >
              PMS 연동 실패 — 계약담당자에게 문의하세요.
            </div>
          )}
          {pmsStatus === "SYNCED" && (
            <div
              style={{
                marginTop: 12,
                fontSize: 15,
                color: "#6B7280",
              }}
            >
              ※ SRM 계약 정보가 PMS(발주관리 시스템)에 연동되었습니다. 계약 이행 현황은 PMS에서 확인하세요.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── 보증서 제출 Modal ────────────────────────────────────────
interface BondFormState {
  type: string;
  amount: string;
  issuer: string;
  issueDate: string;
  expireDate: string;
}

function BondSubmitModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BondFormState) => void;
}) {
  const [form, setForm] = useState<BondFormState>({
    type: "이행보증서",
    amount: "",
    issuer: "",
    issueDate: "",
    expireDate: "",
  });

  const isValid =
    form.type && form.amount && form.issuer && form.issueDate && form.expireDate;

  const handleChange = (key: keyof BondFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: 16,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="보증서 제출"
      width={520}
      footer={
        <>
          <button
            onClick={onClose}
            style={{
              background: "#ffffff",
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
            onClick={() => isValid && onSubmit(form)}
            disabled={!isValid}
            style={{
              background: isValid ? "#00a7ea" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "6px 16px",
              fontSize: 16,
              cursor: isValid ? "pointer" : "not-allowed",
              fontFamily: "inherit",
            }}
          >
            제출
          </button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 16, color: "#555", display: "block", marginBottom: 6 }}>
            보증 유형 <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {["이행보증서", "하자보증서", "선급금보증", "기타"].map((t) => (
              <label key={t} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 16, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="bondType"
                  value={t}
                  checked={form.type === t}
                  onChange={() => handleChange("type", t)}
                />
                {t}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: 16, color: "#555", display: "block", marginBottom: 4 }}>
            보증금액 <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            placeholder="보증금액 (원)"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ fontSize: 16, color: "#555", display: "block", marginBottom: 4 }}>
            발행기관 <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <input
            value={form.issuer}
            onChange={(e) => handleChange("issuer", e.target.value)}
            placeholder="발행기관명"
            style={inputStyle}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 16, color: "#555", display: "block", marginBottom: 4 }}>
              발행일 <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="date"
              value={form.issueDate}
              onChange={(e) => handleChange("issueDate", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: 16, color: "#555", display: "block", marginBottom: 4 }}>
              만료일 <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="date"
              value={form.expireDate}
              onChange={(e) => handleChange("expireDate", e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 16, color: "#555", display: "block", marginBottom: 4 }}>
            보증서 파일 <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            style={{ fontSize: 16, fontFamily: "inherit" }}
          />
          <p style={{ fontSize: 14, color: "#9CA3AF", marginTop: 4 }}>
            PDF, JPG, PNG · 최대 20MB
          </p>
        </div>
        <div
          style={{
            background: "#FEF3C7",
            border: "1px solid #FDE68A",
            borderRadius: 6,
            padding: "8px 12px",
            fontSize: 15,
            color: "#92400E",
          }}
        >
          만료일이 납기일(계약 종료일) 이후인지 확인하세요.
        </div>
      </div>
    </Modal>
  );
}

// ── 메인 페이지 ─────────────────────────────────────────────
export default function VContractsPage() {
  const toast = useToast();

  // 협력업체: "(주)한국전기솔루션" 건만 필터
  const myContracts = MOCK_CONTRACTS.filter(
    (c) => c.vendorName === "(주)한국전기솔루션"
  );

  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bondModalOpen, setBondModalOpen] = useState(false);

  const handleRowClick = (row: Record<string, unknown>) => {
    const contract = myContracts.find((c) => c.id === row.id);
    if (contract) {
      setSelectedContract(contract);
      setDrawerOpen(true);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedContract(null);
  };

  const handleBondSubmit = () => {
    // 4초 후 Toast
    setTimeout(() => {
      toast.show("보증서가 제출되었습니다. 계약담당자 확인 후 안내드립니다.", "info");
    }, 4000);
    setBondModalOpen(false);
    toast.show("보증서 제출 요청이 접수되었습니다.", "success");
  };

  const handleDocSubmit = (id: string) => {
    toast.show(`서류(${id})가 제출되었습니다.`, "success");
  };

  const bonds = selectedContract
    ? MOCK_BONDS.filter((b) => b.contractId === selectedContract.id)
    : [];
  const docs = selectedContract
    ? MOCK_DOC_REQUESTS.filter((d) => d.contractId === selectedContract.id)
    : [];

  const columns: Column[] = [
    { key: "id", label: "계약번호", width: "130px", align: "center" },
    { key: "title", label: "계약명", align: "left" },
    {
      key: "amount",
      label: "계약금액",
      width: "140px",
      align: "right",
      render: (v) => fmt(Number(v)),
    },
    {
      key: "startDate",
      label: "계약기간",
      width: "200px",
      align: "center",
      render: (v, row) => `${String(v)} ~ ${String(row.endDate)}`,
    },
    {
      key: "status",
      label: "상태",
      width: "90px",
      align: "center",
      render: (v) => <StatusBadge status={String(v)} />,
    },
    {
      key: "id",
      label: "액션",
      width: "80px",
      align: "center",
      render: (v) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const contract = myContracts.find((c) => c.id === v);
            if (contract) { setSelectedContract(contract); setDrawerOpen(true); }
          }}
          style={{
            background: "#654024",
            color: "#fff",
            border: "1px solid #DFE8F0",
            borderRadius: 4,
            padding: "3px 12px",
            fontSize: 15,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          상세
        </button>
      ),
    },
  ];

  const drawerTabs = [
    { id: "detail", label: "계약정보" },
    { id: "bond", label: "보증제출" },
    { id: "doc", label: "서류요청" },
    { id: "changes", label: "변경이력" },
    { id: "confirm", label: "확인상태" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* PMS 공유접점 안내 배너 */}
      <div
        style={{
          background: "#EFF6FF",
          border: "1px solid #BFDBFE",
          borderRadius: 8,
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 19, color: "#2563EB" }}>ℹ</span>
        <span style={{ fontSize: 16, color: "#1E40AF" }}>
          본 계약 정보는 PMS 시스템과 공유접점으로 연결되어, PMS에서 직접 조회됩니다.
        </span>
      </div>

      <PageHeader title="계약·보증 관리" />

      <SearchForm
        fields={[
          {
            label: "계약상태",
            name: "status",
            type: "select",
            options: [
              { label: "진행중(ACTIVE)", value: "ACTIVE" },
              { label: "완료(CLOSED)", value: "CLOSED" },
            ],
          },
          { label: "계약기간", name: "period", type: "daterange" },
        ]}
      />

      {myContracts.length === 0 ? (
        <EmptyState message="현재 진행 중인 계약이 없습니다." />
      ) : (
        <DataTable
          columns={columns}
          data={myContracts as unknown as Record<string, unknown>[]}
          sectionLabel="나의 계약 목록"
          showCheckbox={false}
          showExcel={false}
          onRowClick={handleRowClick}
        />
      )}

      {/* 계약 상세 Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        title={selectedContract ? `${selectedContract.id} · ${selectedContract.title}` : "계약 상세"}
        width={680}
      >
        {selectedContract && (
          <Tabs tabs={drawerTabs}>
            {(active) => (
              <div>
                {active === "detail" && <ContractDetailTab contract={selectedContract} />}
                {active === "bond" && (
                  <BondSubmitTab
                    bonds={bonds}
                    onOpenBondModal={() => setBondModalOpen(true)}
                  />
                )}
                {active === "doc" && (
                  <DocSubmitTab docs={docs} onSubmit={handleDocSubmit} />
                )}
                {active === "changes" && (
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 12 }}>계약 변경이력</div>
                    {[
                      { date: selectedContract.startDate, type: "계약 체결", summary: "최초 계약 체결", actor: "이계약(C)" },
                    ].map((h, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "flex-start",
                          padding: "10px 0",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <span style={{ fontSize: 15, color: "#888", minWidth: 95, flexShrink: 0 }}>{h.date}</span>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{h.type}</div>
                          <div style={{ fontSize: 15, color: "#555", marginTop: 2 }}>{h.summary}</div>
                        </div>
                        <span style={{ fontSize: 15, color: "#888", marginLeft: "auto", whiteSpace: "nowrap" }}>{h.actor}</span>
                      </div>
                    ))}
                  </div>
                )}
                {active === "confirm" && (
                  <ConfirmStatusTab contract={selectedContract} />
                )}
              </div>
            )}
          </Tabs>
        )}
      </Drawer>

      {/* 보증서 제출 Modal */}
      <BondSubmitModal
        open={bondModalOpen}
        onClose={() => setBondModalOpen(false)}
        onSubmit={handleBondSubmit}
      />
    </div>
  );
}
