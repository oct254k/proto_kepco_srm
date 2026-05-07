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
import { MOCK_BONDS, MOCK_CONTRACTS, MOCK_DOC_REQUESTS, MOCK_PMS_LOGS, type Bond, type DocRequest } from "@/lib/mock/contracts";
import type { Contract } from "@/lib/types";

const CONTRACT_VENDOR_GUIDE: StatusGuideSection[] = [
  {
    title: "협력업체 계약·보증 흐름",
    items: [
      {
        code: "PENDING_SUPPLIER_APPROVAL",
        meaning: "협력업체가 계약서를 확인하고 보증서류를 제출해야 하는 상태입니다.",
        owner: "협력업체",
        actions: "계약 확인, 보증 제출",
        next: "사업담당 승인대기",
        limit: "계약 본문 직접 수정 불가",
      },
      {
        code: "REJECTED",
        label: "보증반려",
        meaning: "보증서류에 문제가 있어 반려된 상태입니다.",
        owner: "계약담당자, 협력업체",
        actions: "반려 사유 확인, 보증 재제출",
        next: "보증제출완료",
        limit: "재제출 전까지 승인 진행 불가",
      },
      {
        code: "PMS_SYNCED",
        label: "PMS 전송완료",
        meaning: "계약 확정 정보가 PMS로 연동된 상태입니다.",
        owner: "계약담당자",
        actions: "조회",
        next: "이행 관리",
        limit: "협력업체는 조회만 가능",
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

function ContractDetailTab({ contract }: { contract: Contract }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <StatusSummaryBar contract={contract} />
      <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "8px 12px", fontSize: 15 }}>
        <span style={{ color: "#64748B" }}>계약번호</span>
        <strong>{contract.id}</strong>
        <span style={{ color: "#64748B" }}>계약명</span>
        <strong>{contract.title}</strong>
        <span style={{ color: "#64748B" }}>계약금액</span>
        <strong>{fmt(contract.amount)}</strong>
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
    </div>
  );
}

function BondSubmitModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="보증서 제출 / 재제출"
      footer={
        <>
          <button onClick={onClose} style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#fff", cursor: "pointer", fontFamily: "inherit" }}>취소</button>
          <button disabled={!reason.trim()} onClick={onSubmit} style={{ padding: "8px 14px", borderRadius: 6, border: "none", background: reason.trim() ? "#01ACC8" : "#9CA3AF", color: "#fff", cursor: reason.trim() ? "pointer" : "not-allowed", fontFamily: "inherit" }}>제출</button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 15, color: "#334155", lineHeight: 1.7 }}>
          반려된 보증서류는 사유를 확인한 뒤 재제출합니다. 프로토타입에서는 재제출 흐름이 요구사항상 핵심임을 우선 표현합니다.
        </div>
        <textarea rows={4} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="제출 메모 또는 재제출 사유" style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 15, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
      </div>
    </Modal>
  );
}

function ContractOpsTab({
  bonds,
  docs,
  onOpenSubmit,
}: {
  bonds: Bond[];
  docs: DocRequest[];
  onOpenSubmit: () => void;
}) {
  const columns: Column[] = [
    { key: "type", label: "보증유형", width: "100px", align: "center" },
    { key: "amount", label: "보증금액", width: "120px", align: "right", render: (value) => fmt(Number(value)) },
    { key: "issuer", label: "발행기관", width: "120px", align: "center" },
    { key: "endDate", label: "만료일", width: "110px", align: "center" },
    { key: "status", label: "상태", width: "110px", align: "center", render: (value) => <StatusBadge status={String(value)} /> },
  ];

  const rejected = bonds.some((bond) => bond.status === "REJECTED");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {rejected && (
        <div style={{ background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: 10, padding: "14px 16px", fontSize: 15, color: "#9F1239", lineHeight: 1.7 }}>
          보증서가 반려되었습니다. 반려 사유: `만료일이 계약 종료일보다 짧음`.
          반려 사유를 확인한 뒤 재제출해야 다음 승인 단계로 진행할 수 있습니다.
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onOpenSubmit} style={{ padding: "8px 14px", borderRadius: 6, border: "none", background: "#01ACC8", color: "#fff", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>
          {rejected ? "보증서 재제출" : "보증서 제출"}
        </button>
      </div>
      <DataTable columns={columns} data={bonds as unknown as Record<string, unknown>[]} sectionLabel="보증서 현황" showCheckbox={false} showExcel={false} />
      {docs.length > 0 && (
        <DataTable
          columns={[
            { key: "id", label: "요청번호", width: "130px", align: "center" },
            { key: "docName", label: "서류명", align: "left" },
            { key: "dueDate", label: "제출기한", width: "110px", align: "center" },
            { key: "status", label: "상태", width: "110px", align: "center", render: (value) => <StatusBadge status={String(value)} /> },
          ]}
          data={docs as unknown as Record<string, unknown>[]}
          sectionLabel="추가 서류요청"
          showCheckbox={false}
          showExcel={false}
        />
      )}
    </div>
  );
}

function StatusHistoryTab({ contract }: { contract: Contract }) {
  const logs = MOCK_PMS_LOGS[contract.id] ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px", fontSize: 15, color: "#334155", lineHeight: 1.7 }}>
        {contract.pmsSyncStatus === "PMS_SYNCED"
          ? "계약 확정 정보가 PMS에 연동되었습니다. 협력업체는 조회만 가능하며, 후속 변경은 계약담당자가 처리합니다."
          : contract.pmsSyncStatus === "PMS_FAILED"
          ? "PMS 전송에 실패했습니다. 협력업체는 계약담당자에게 문의해야 합니다."
          : "계약 확정 또는 재전송 처리 전 단계입니다."}
      </div>
      {logs.length > 0 && (
        <div style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>최근 PMS 이력</div>
          <div style={{ fontSize: 14, color: "#64748B" }}>{logs[0].requestedAt} · {logs[0].note}</div>
        </div>
      )}
      <div style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>계약 변경이력</div>
        <div style={{ fontSize: 14, color: "#64748B" }}>
          {contract.bondStatus === "REJECTED"
            ? "2026-04-05 15:20 · 보증서 반려 및 재제출 요청"
            : "변경 이력이 없습니다."}
        </div>
      </div>
    </div>
  );
}

export default function VContractsPage() {
  const toast = useToast();
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bondModalOpen, setBondModalOpen] = useState(false);

  const myContracts = useMemo(() => MOCK_CONTRACTS.filter((contract) => contract.vendorName === "(주)한국전기솔루션"), []);
  const bonds = selectedContract ? MOCK_BONDS.filter((bond) => bond.contractId === selectedContract.id) : [];
  const docs = selectedContract ? MOCK_DOC_REQUESTS.filter((doc) => doc.contractId === selectedContract.id) : [];

  const columns: Column[] = useMemo(
    () => [
      { key: "id", label: "계약번호", width: "120px", align: "center" },
      { key: "title", label: "계약명", align: "left" },
      { key: "amount", label: "계약금액", width: "130px", align: "right", render: (value) => fmt(Number(value)) },
      { key: "contractStatus", label: "계약상태", width: "110px", align: "center", render: (_value, row) => <StatusBadge status={String(row.contractStatus ?? row.status)} /> },
      { key: "bondStatus", label: "보증상태", width: "110px", align: "center", render: (value) => <StatusBadge status={String(value ?? "NOT_SUBMITTED")} /> },
      { key: "pmsSyncStatus", label: "PMS 전송", width: "110px", align: "center", render: (_value, row) => <StatusBadge status={String(row.pmsSyncStatus ?? row.pmsStatus ?? "PMS_PENDING")} /> },
    ],
    [],
  );

  function openContract(row: Record<string, unknown>) {
    const found = myContracts.find((item) => item.id === row.id);
    if (!found) return;
    setSelectedContract(found);
    setDrawerOpen(true);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader
        title="계약·보증 관리"
        actions={<StatusGuide screenName="SCR-S-12 협력업체 계약·보증" sections={CONTRACT_VENDOR_GUIDE} />}
      />

      <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: "14px 18px", fontSize: 15, color: "#1D4ED8", lineHeight: 1.7 }}>
        고객사 요구사항 강조포인트: 협력업체는 계약 본문 수정이 아니라 상태 추적, 보증 제출/재제출, PMS 연동 결과 확인 중심으로 사용합니다.
      </div>

      <SearchForm
        fields={[
          { label: "계약상태", name: "contractStatus", type: "select", options: [
            { label: "협력업체 확인대기", value: "PENDING_SUPPLIER_APPROVAL" },
            { label: "사업담당 승인대기", value: "PENDING_BUSINESS_APPROVAL" },
            { label: "계약확정", value: "ACTIVE" },
          ] },
          { label: "보증상태", name: "bondStatus", type: "select", options: [
            { label: "미제출", value: "NOT_SUBMITTED" },
            { label: "제출완료", value: "SUBMITTED" },
            { label: "반려", value: "REJECTED" },
            { label: "승인완료", value: "APPROVED" },
          ] },
        ]}
      />

      {myContracts.length === 0 ? (
        <EmptyState message="현재 진행 중인 계약이 없습니다." />
      ) : (
        <DataTable columns={columns} data={myContracts as unknown as Record<string, unknown>[]} sectionLabel="나의 계약 목록" showCheckbox={false} showExcel={false} onRowClick={openContract} />
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={selectedContract ? `${selectedContract.id} · ${selectedContract.title}` : "계약 상세"} width={720}>
        {selectedContract && (
          <Tabs tabs={[
            { id: "detail", label: "계약개요" },
            { id: "ops", label: "보증/서류" },
            { id: "status", label: "상태·이력" },
          ]}>
            {(tab) => (
              <>
                {tab === "detail" && <ContractDetailTab contract={selectedContract} />}
                {tab === "ops" && <ContractOpsTab bonds={bonds} docs={docs} onOpenSubmit={() => setBondModalOpen(true)} />}
                {tab === "status" && <StatusHistoryTab contract={selectedContract} />}
              </>
            )}
          </Tabs>
        )}
      </Drawer>

      <BondSubmitModal
        open={bondModalOpen}
        onClose={() => setBondModalOpen(false)}
        onSubmit={() => {
          setBondModalOpen(false);
          toast.show("보증서 제출 요청이 접수되었습니다.", "success");
        }}
      />
    </div>
  );
}
