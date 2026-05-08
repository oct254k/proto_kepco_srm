"use client";

import React, { useMemo, useState } from "react";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import SearchForm from "@/components/SearchForm";
import Drawer from "@/components/Drawer";
import Modal from "@/components/Modal";
import EmptyState from "@/components/EmptyState";
import Tabs from "@/components/Tabs";
import StatusGuide, { type StatusGuideSection } from "@/components/StatusGuide";
import { useToast } from "@/components/Toast";
import { CONTRACT_AUTHORITY_LABELS, type Contract } from "@/lib/types";
import { useContractAuthority } from "@/lib/role";
import {
  MOCK_BONDS,
  MOCK_CONTRACT_HISTORIES,
  MOCK_CONTRACTS,
  MOCK_DOC_REQUESTS,
  MOCK_PMS_LOGS,
  type Bond,
  type DocRequest,
} from "@/lib/mock/contracts";

const CONTRACT_GUIDE: StatusGuideSection[] = [
  {
    title: "계약 진행 상태",
    description: "계약상태, 보증상태, PMS 전송상태를 하나로 합치지 않고 분리해서 관리합니다.",
    items: [
      {
        code: "DRAFT",
        meaning: "계약 초안 단계로 계약담당자만 수정/취소 가능합니다.",
        owner: "계약담당자",
        actions: "수정, 취소",
        next: "협력업체 확인대기",
        limit: "협력업체/사업담당자 승인 전",
      },
      {
        code: "PENDING_SUPPLIER_APPROVAL",
        meaning: "협력업체가 계약서와 보증 제출 준비를 하는 단계입니다.",
        owner: "협력업체",
        actions: "계약 확인, 보증 제출",
        next: "사업담당 승인대기 또는 보증반려",
        limit: "일반 계약취소 버튼 비노출",
      },
      {
        code: "PENDING_BUSINESS_APPROVAL",
        meaning: "협력업체 제출과 계약 검토가 끝나 사업담당자 승인 대기인 상태입니다.",
        owner: "사업담당자, 계약담당자",
        actions: "승인 요청 현황 조회",
        next: "계약확정",
        limit: "사업담당 승인 전 최종 확정 금지",
      },
      {
        code: "ACTIVE",
        label: "계약확정",
        meaning: "계약이 확정되었고 일반 수정/취소는 종료된 상태입니다.",
        owner: "계약담당자",
        actions: "계약변경 요청, PMS 재전송",
        next: "PMS 전송완료 또는 계약변경",
        limit: "일반 수정/취소 버튼 제거",
      },
      {
        code: "PMS_SYNCED",
        label: "PMS 전송완료",
        meaning: "계약확정 정보가 PMS에 반영된 상태입니다.",
        owner: "계약담당자",
        actions: "변경 이력 조회",
        next: "계약변경 또는 종료",
        limit: "핵심 계약정보 직접 수정 제한",
      },
    ],
  },
  {
    title: "보증 / PMS 상태",
    items: [
      {
        code: "REJECTED",
        label: "보증반려",
        meaning: "보증 서류에 문제가 있어 재제출이 필요한 상태입니다.",
        owner: "계약담당자, 협력업체",
        actions: "반려사유 확인, 재제출",
        next: "보증제출완료",
        limit: "반려 사유 필수",
      },
      {
        code: "PMS_FAILED",
        label: "PMS 전송실패",
        meaning: "계약 정보가 PMS로 전송되지 못한 상태입니다.",
        owner: "계약담당자",
        actions: "재전송",
        next: "PMS 전송완료",
        limit: "실패 원인 확인 후만 재전송",
      },
    ],
  },
];

function fmt(amount: number) {
  return `${amount.toLocaleString()}원`;
}

function StatusSummaryBar({ contract }: { contract: Contract }) {
  const items = [
    { label: "계약상태", value: contract.contractStatus ?? contract.status },
    { label: "보증상태", value: contract.bondStatus ?? "NOT_SUBMITTED" },
    { label: "PMS 전송", value: contract.pmsSyncStatus ?? contract.pmsStatus ?? "PMS_PENDING" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 10,
        padding: 12,
        border: "1px solid #E2E8F0",
        borderRadius: 10,
        background: "#F8FAFC",
      }}
    >
      {items.map((item) => (
        <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#64748B", fontWeight: 700 }}>{item.label}</span>
          <div><StatusBadge status={item.value} /></div>
        </div>
      ))}
    </div>
  );
}

function isDraftContract(contract: Contract) {
  return contract.contractStatus === "DRAFT";
}

function isPendingBusiness(contract: Contract) {
  return contract.contractStatus === "PENDING_BUSINESS_APPROVAL";
}

function isFinalized(contract: Contract) {
  return contract.contractStatus === "ACTIVE" || contract.pmsSyncStatus === "PMS_SYNCED";
}

function ContractInfoTab({
  contract,
  canManage,
  onOpenChangeModal,
  onCancelDraft,
  onFinalApprove,
}: {
  contract: Contract;
  canManage: boolean;
  onOpenChangeModal: () => void;
  onCancelDraft: () => void;
  onFinalApprove: () => void;
}) {
  const canEditDraft = canManage && isDraftContract(contract);
  const canCancel = canManage && isDraftContract(contract);
  const canChange = canManage && isFinalized(contract);
  const canFinalize = canManage && isPendingBusiness(contract) && contract.businessApprovalStatus === "APPROVED";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StatusSummaryBar contract={contract} />
      <div
        style={{
          background: canManage ? "#F8FAFC" : "#FEF3C7",
          border: `1px solid ${canManage ? "#E2E8F0" : "#FDE68A"}`,
          borderRadius: 10,
          padding: "14px 16px",
          fontSize: 15,
          color: canManage ? "#334155" : "#92400E",
          lineHeight: 1.7,
        }}
      >
        {canManage
          ? "계약담당자 권한 기준으로 상태별 액션을 제어합니다."
          : "가격등록자/임원 권한은 계약 본문 수정 대신 상태 조회 중심으로 제한됩니다."}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "8px 12px", fontSize: 15 }}>
        <span style={{ color: "#64748B" }}>계약번호</span>
        <strong>{contract.id}</strong>
        <span style={{ color: "#64748B" }}>계약명</span>
        <strong>{contract.title}</strong>
        <span style={{ color: "#64748B" }}>업체명</span>
        <strong>{contract.vendorName}</strong>
        <span style={{ color: "#64748B" }}>계약금액</span>
        <strong>{fmt(contract.amount)}</strong>
        <span style={{ color: "#64748B" }}>사업담당 승인</span>
        <div><StatusBadge status={contract.businessApprovalStatus === "APPROVED" ? "APPROVED" : "PENDING_APPROVAL"} label={contract.businessApprovalStatus === "APPROVED" ? "승인완료" : "승인대기"} /></div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          style={{
            padding: "8px 14px",
            borderRadius: 6,
            border: "1px solid #7DD3FC",
            background: "#EFF6FF",
            color: "#0369A1",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          계약서 다운로드
        </button>
      </div>

      {isPendingBusiness(contract) && contract.businessApprovalStatus !== "APPROVED" && (
        <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "14px 16px", fontSize: 15, color: "#9A3412" }}>
          사업담당자 승인 전이라 계약 최종 확정 액션은 아직 노출하지 않습니다.
        </div>
      )}

      {isFinalized(contract) && (
        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "14px 16px", fontSize: 15, color: "#1D4ED8" }}>
          고객사 요구사항 강조포인트: 확정 이후에는 일반 수정이 아니라 계약변경 모달만 제공해 변경 이력을 남기도록 표현합니다.
        </div>
      )}

      {(canEditDraft || canCancel || canFinalize || canChange) && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {canEditDraft && (
            <button
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: "1px solid #CBD5E1",
                background: "#fff",
                color: "#334155",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              계약서 초안 수정
            </button>
          )}
          {canCancel && (
            <button
              onClick={onCancelDraft}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: "1px solid #FCA5A5",
                background: "#FEF2F2",
                color: "#B91C1C",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              계약 취소
            </button>
          )}
          {canFinalize && (
            <button
              onClick={onFinalApprove}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: "1px solid #DFE8F0",
                background: "#654024",
                color: "#fff",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              계약 최종 확정
            </button>
          )}
          {canChange && (
            <button
              onClick={onOpenChangeModal}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: "1px solid #7DD3FC",
                background: "#E0F2FE",
                color: "#0369A1",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              계약변경
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ContractOpsTab({
  bonds,
  docs,
  canManage,
  onApprove,
  onReject,
}: {
  bonds: Bond[];
  docs: DocRequest[];
  canManage: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const columns: Column[] = [
    { key: "type", label: "보증유형", width: "100px", align: "center" },
    { key: "amount", label: "보증금액", width: "120px", align: "right", render: (value) => fmt(Number(value)) },
    { key: "issuer", label: "발행기관", width: "110px", align: "center" },
    { key: "endDate", label: "만료일", width: "110px", align: "center" },
    { key: "status", label: "상태", width: "110px", align: "center", render: (value) => <StatusBadge status={String(value)} /> },
    {
      key: "id",
      label: "액션",
      width: "150px",
      align: "center",
      render: (value, row) => {
        const actionable = canManage && row.status === "SUBMITTED";
        if (!actionable) {
          return <span style={{ fontSize: 14, color: "#94A3B8" }}>{row.status === "REJECTED" ? "반려 완료" : "대기중"}</span>;
        }
        return (
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            <button
              onClick={(event) => { event.stopPropagation(); onApprove(String(value)); }}
              style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #A7F3D0", background: "#ECFDF5", color: "#166534", cursor: "pointer", fontFamily: "inherit" }}
            >
              승인
            </button>
            <button
              onClick={(event) => { event.stopPropagation(); onReject(String(value)); }}
              style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #FECACA", background: "#FEF2F2", color: "#B91C1C", cursor: "pointer", fontFamily: "inherit" }}
            >
              반려
            </button>
          </div>
        );
      },
    },
  ];

  const docColumns: Column[] = [
    { key: "id", label: "요청번호", width: "130px", align: "center" },
    { key: "docName", label: "서류명", align: "left" },
    { key: "dueDate", label: "제출기한", width: "110px", align: "center" },
    { key: "status", label: "상태", width: "100px", align: "center", render: (value) => <StatusBadge status={String(value)} /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px", fontSize: 15, color: "#334155", lineHeight: 1.7 }}>
        `서류요청`은 보증서 외 추가 계약 문서를 요청/추적하는 영역입니다.
        보증 반려가 있으면 같은 탭 안에서 반려 상태와 추가 요청 문서를 함께 확인하게 구성했습니다.
      </div>
      <DataTable columns={columns} data={bonds as unknown as Record<string, unknown>[]} sectionLabel="보증서 현황" showCheckbox={false} showExcel={false} />
      {docs.length === 0 ? (
        <EmptyState message="요청된 추가 서류가 없습니다." />
      ) : (
        <DataTable columns={docColumns} data={docs as unknown as Record<string, unknown>[]} sectionLabel="추가 서류요청" showCheckbox={false} showExcel={false} />
      )}
    </div>
  );
}

function PmsTab({
  contract,
  canManage,
  onResync,
}: {
  contract: Contract;
  canManage: boolean;
  onResync: () => void;
}) {
  const logs = MOCK_PMS_LOGS[contract.id] ?? [];
  const pmsStatus = contract.pmsSyncStatus ?? contract.pmsStatus ?? "PMS_PENDING";

  const columns: Column[] = [
    { key: "requestedAt", label: "요청일시", width: "160px", align: "center" },
    { key: "status", label: "상태", width: "110px", align: "center", render: (value) => <StatusBadge status={String(value)} /> },
    { key: "responseCode", label: "응답코드", width: "90px", align: "center" },
    { key: "note", label: "비고", align: "left" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "8px 12px", fontSize: 15 }}>
        <span style={{ color: "#64748B" }}>PMS 전송상태</span>
        <div><StatusBadge status={pmsStatus} /></div>
        <span style={{ color: "#64748B" }}>PMS 계약 ID</span>
        <strong>{pmsStatus === "PMS_SYNCED" ? `PMS-${contract.id}` : "-"}</strong>
      </div>
      {(pmsStatus === "PMS_FAILED" || pmsStatus === "PMS_PENDING") && (
        canManage ? (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={onResync}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: "none",
                background: "#DC2626",
                color: "#fff",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              PMS 재전송
            </button>
          </div>
        ) : (
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#64748B" }}>
            PMS 재전송은 계약담당자 권한에서만 처리합니다.
          </div>
        )
      )}
      <DataTable columns={columns} data={logs as unknown as Record<string, unknown>[]} sectionLabel="PMS 전송 이력" showCheckbox={false} showExcel={false} />
    </div>
  );
}

function HistoryTab({ contractId }: { contractId: string }) {
  const items = MOCK_CONTRACT_HISTORIES.filter((item) => item.contractId === contractId);
  if (items.length === 0) return <EmptyState message="변경 이력이 없습니다." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item) => (
        <div key={item.id} style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 14, color: "#94A3B8", marginBottom: 4 }}>{item.changedAt} · {item.changedBy}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 6 }}>{item.item} 변경</div>
          <div style={{ fontSize: 15, color: "#334155", marginBottom: 6 }}>{item.before} → {item.after}</div>
          <div style={{ fontSize: 14, color: "#64748B" }}>사유: {item.reason}</div>
        </div>
      ))}
    </div>
  );
}

function HistoryAndPmsTab({
  contract,
  canManage,
  onResync,
}: {
  contract: Contract;
  canManage: boolean;
  onResync: () => void;
}) {
  const logs = MOCK_PMS_LOGS[contract.id] ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px", fontSize: 15, color: "#334155", lineHeight: 1.7 }}>
        이 탭은 계약변경 이력과 PMS 전송 이력을 함께 보여줍니다. 상태 3분리는 유지하되, 이력성 정보는 한 곳에서 보는 구조로 단순화했습니다.
      </div>
      <HistoryTab contractId={contract.id} />
      <div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 10 }}>PMS 전송 이력</div>
        <PmsTab contract={contract} canManage={canManage} onResync={onResync} />
      </div>
    </div>
  );
}

export default function CContractsPage() {
  const toast = useToast();
  const [authority] = useContractAuthority();
  const [contracts, setContracts] = useState(MOCK_CONTRACTS);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [rejectBondId, setRejectBondId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [changeReason, setChangeReason] = useState("");

  const canManage = authority === "CONTRACT_MANAGER";
  const bonds = selectedContract ? MOCK_BONDS.filter((bond) => bond.contractId === selectedContract.id) : [];
  const docs = selectedContract ? MOCK_DOC_REQUESTS.filter((doc) => doc.contractId === selectedContract.id) : [];

  const columns: Column[] = useMemo(
    () => [
      { key: "id", label: "계약번호", width: "120px", align: "center" },
      { key: "title", label: "계약명", align: "left" },
      { key: "vendorName", label: "업체명", width: "160px", align: "center" },
      { key: "amount", label: "계약금액", width: "130px", align: "right", render: (value) => fmt(Number(value)) },
      { key: "contractStatus", label: "계약상태", width: "110px", align: "center", render: (_value, row) => <StatusBadge status={String(row.contractStatus ?? row.status)} /> },
      { key: "bondStatus", label: "보증상태", width: "110px", align: "center", render: (value) => <StatusBadge status={String(value ?? "NOT_SUBMITTED")} /> },
      { key: "pmsSyncStatus", label: "PMS 전송", width: "110px", align: "center", render: (_value, row) => <StatusBadge status={String(row.pmsSyncStatus ?? row.pmsStatus ?? "PMS_PENDING")} /> },
    ],
    [],
  );

  function openContract(row: Record<string, unknown>) {
    const found = contracts.find((item) => item.id === row.id);
    if (!found) return;
    setSelectedContract(found);
    setDrawerOpen(true);
  }

  function handleApproveBond(id: string) {
    toast.show(`보증서 ${id} 승인 처리되었습니다.`, "success");
  }

  function handleRejectBond(id: string) {
    setRejectBondId(id);
    setRejectReason("");
    setRejectModalOpen(true);
  }

  function submitRejectReason() {
    if (!rejectReason.trim()) return;
    toast.show(`보증서 ${rejectBondId}가 반려되었습니다.`, "error");
    setRejectModalOpen(false);
  }

  function handleDraftCancel() {
    if (!selectedContract) return;
    setContracts((prev) => prev.map((item) => (
      item.id === selectedContract.id
        ? { ...item, status: "CANCELLED", contractStatus: "CANCELLED", canCancel: false }
        : item
    )));
    setSelectedContract((prev) => prev ? { ...prev, status: "CANCELLED", contractStatus: "CANCELLED", canCancel: false } : prev);
    toast.show("초안 계약이 취소되었습니다.", "success");
  }

  function handleFinalApprove() {
    if (!selectedContract) return;
    setContracts((prev) => prev.map((item) => (
      item.id === selectedContract.id
        ? { ...item, status: "ACTIVE", contractStatus: "ACTIVE", pmsSyncStatus: "PMS_PENDING", pmsStatus: "PMS_PENDING" }
        : item
    )));
    setSelectedContract((prev) => prev ? { ...prev, status: "ACTIVE", contractStatus: "ACTIVE", pmsSyncStatus: "PMS_PENDING", pmsStatus: "PMS_PENDING" } : prev);
    toast.show("계약이 최종 확정되었습니다.", "success");
  }

  function handleResync() {
    if (!selectedContract) return;
    setContracts((prev) => prev.map((item) => (
      item.id === selectedContract.id
        ? { ...item, pmsSyncStatus: "PMS_SYNCED", pmsStatus: "PMS_SYNCED" }
        : item
    )));
    setSelectedContract((prev) => prev ? { ...prev, pmsSyncStatus: "PMS_SYNCED", pmsStatus: "PMS_SYNCED" } : prev);
    toast.show("PMS 재전송이 완료되었습니다.", "success");
  }

  function handleSubmitChange() {
    if (!changeReason.trim()) return;
    setChangeModalOpen(false);
    toast.show("계약변경 요청이 변경이력으로 기록되었습니다.", "success");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader
        title="계약 관리"
        actions={<StatusGuide screenName="SCR-S-11 계약 관리" sections={CONTRACT_GUIDE} />}
      />

      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 18px", fontSize: 15, color: "#334155", lineHeight: 1.7 }}>
        현재 시연 권한: <strong>{CONTRACT_AUTHORITY_LABELS[authority]}</strong>
        {" · "}
        계약상태, 보증상태, PMS 전송상태를 분리해서 표시합니다.
      </div>

      <SearchForm
        fields={[
          { label: "키워드", name: "keyword", type: "text", placeholder: "계약번호·계약명 검색" },
          { label: "계약상태", name: "contractStatus", type: "select", options: [
            { label: "초안", value: "DRAFT" },
            { label: "협력업체 확인대기", value: "PENDING_SUPPLIER_APPROVAL" },
            { label: "사업담당 승인대기", value: "PENDING_BUSINESS_APPROVAL" },
            { label: "계약확정", value: "ACTIVE" },
            { label: "계약종료", value: "TERMINATED" },
          ] },
          { label: "보증상태", name: "bondStatus", type: "select", options: [
            { label: "미제출", value: "NOT_SUBMITTED" },
            { label: "제출완료", value: "SUBMITTED" },
            { label: "반려", value: "REJECTED" },
            { label: "승인완료", value: "APPROVED" },
          ] },
        ]}
      />

      <DataTable columns={columns} data={contracts as unknown as Record<string, unknown>[]} sectionLabel="계약 목록" showCheckbox={false} onRowClick={openContract} />

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={selectedContract ? `${selectedContract.id} · ${selectedContract.title}` : "계약 상세"} width={760}>
        {selectedContract && (
          <Tabs tabs={[
            { id: "info", label: "계약개요" },
            { id: "ops", label: "보증/서류" },
            { id: "history", label: "변경/PMS 이력" },
          ]}>
            {(tab) => (
              <>
                {tab === "info" && (
                  <ContractInfoTab
                    contract={selectedContract}
                    canManage={canManage}
                    onOpenChangeModal={() => setChangeModalOpen(true)}
                    onCancelDraft={handleDraftCancel}
                    onFinalApprove={handleFinalApprove}
                  />
                )}
                {tab === "ops" && <ContractOpsTab bonds={bonds} docs={docs} canManage={canManage} onApprove={handleApproveBond} onReject={handleRejectBond} />}
                {tab === "history" && <HistoryAndPmsTab contract={selectedContract} canManage={canManage} onResync={handleResync} />}
              </>
            )}
          </Tabs>
        )}
      </Drawer>

      <Modal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="보증서 반려"
        footer={
          <>
            <button style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#fff", cursor: "pointer", fontFamily: "inherit" }} onClick={() => setRejectModalOpen(false)}>취소</button>
            <button style={{ padding: "8px 14px", borderRadius: 6, border: "none", background: rejectReason.trim() ? "#DC2626" : "#9CA3AF", color: "#fff", cursor: rejectReason.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }} disabled={!rejectReason.trim()} onClick={submitRejectReason}>반려 확정</button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 15, color: "#334155", lineHeight: 1.7 }}>
            고객사 요구사항 강조포인트: 보증서 반려 시 반려 사유 입력을 필수로 두고, 협력업체 재제출 흐름으로 연결합니다.
          </div>
          <textarea rows={4} value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} placeholder="반려 사유를 입력하세요." style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" }} />
        </div>
      </Modal>

      <Modal
        open={changeModalOpen}
        onClose={() => setChangeModalOpen(false)}
        title="계약변경 요청"
        footer={
          <>
            <button style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#fff", cursor: "pointer", fontFamily: "inherit" }} onClick={() => setChangeModalOpen(false)}>취소</button>
            <button style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #DFE8F0", background: changeReason.trim() ? "#654024" : "#9CA3AF", color: "#fff", cursor: changeReason.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }} disabled={!changeReason.trim()} onClick={handleSubmitChange}>변경 요청 등록</button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 15, color: "#334155", lineHeight: 1.7 }}>
            확정 후에는 계약 본문을 직접 수정하지 않고, 변경 전/후 값과 사유를 남기는 계약변경 절차로만 처리합니다.
          </div>
          <textarea rows={4} value={changeReason} onChange={(event) => setChangeReason(event.target.value)} placeholder="변경 사유와 변경 전/후 항목을 입력하세요." style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" }} />
        </div>
      </Modal>
    </div>
  );
}
