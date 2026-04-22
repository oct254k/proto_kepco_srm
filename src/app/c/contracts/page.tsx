"use client";

import React, { useState, useEffect } from "react";
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
  MOCK_CONTRACT_HISTORIES,
  MOCK_PMS_LOGS,
} from "@/lib/mock/contracts";
import type { Bond, DocRequest } from "@/lib/mock/contracts";
import type { Contract } from "@/lib/types";

// ── 인라인 유틸 ──────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString() + "원";
}

// ── 계약정보 탭 ──────────────────────────────────────────────
function ContractInfoTab({ contract }: { contract: Contract }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
          ["업체명", contract.vendorName],
          ["계약금액", fmt(contract.amount)],
          ["계약시작일", contract.startDate],
          ["계약종료일", contract.endDate],
          ["담당자", "이계약 (계약1팀)"],
          ["계약유형", "물품"],
          ["이행보증금률", "10%"],
          ["이행보증금액", fmt(Math.floor(contract.amount * 0.1))],
          ["특약사항", "품질보증기간 2년 적용"],
          ["계약서 파일", "계약서_" + contract.id + ".pdf"],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 16, color: "#6B7280", minWidth: 100, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 16, color: "#111", fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          style={{
            background: "#fff",
            border: "1px solid #01ACC8",
            color: "#01ACC8",
            borderRadius: 4,
            padding: "6px 16px",
            fontSize: 16,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          임시저장
        </button>
        <button
          style={{
            background: "#01ACC8",
            border: "none",
            color: "#fff",
            borderRadius: 4,
            padding: "6px 16px",
            fontSize: 16,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          계약 최종 확정
        </button>
      </div>
    </div>
  );
}

// ── 보증서확인 탭 ────────────────────────────────────────────
function BondTab({
  bonds,
  onApprove,
  onReject,
}: {
  bonds: Bond[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const cols: Column[] = [
    { key: "type", label: "보증유형", width: "100px", align: "center" },
    { key: "amount", label: "보증금액", align: "right", render: (v) => fmt(Number(v)) },
    { key: "issuer", label: "발행기관", width: "120px", align: "center" },
    { key: "startDate", label: "시작일", width: "100px", align: "center" },
    { key: "endDate", label: "만료일", width: "100px", align: "center" },
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
      width: "140px",
      align: "center",
      render: (v) => (
        <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
          <button
            onClick={(e) => { e.stopPropagation(); onApprove(String(v)); }}
            style={{
              background: "#D1FAE5",
              color: "#065F46",
              border: "none",
              borderRadius: 4,
              padding: "3px 10px",
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            승인
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onReject(String(v)); }}
            style={{
              background: "#FEE2E2",
              color: "#991B1B",
              border: "none",
              borderRadius: 4,
              padding: "3px 10px",
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            반려
          </button>
        </div>
      ),
    },
  ];

  if (bonds.length === 0) {
    return <EmptyState message="제출된 보증서가 없습니다." />;
  }

  return (
    <DataTable
      columns={cols}
      data={bonds as unknown as Record<string, unknown>[]}
      sectionLabel="보증서"
      showExcel={false}
      showCheckbox={false}
    />
  );
}

// ── 서류요청 탭 ──────────────────────────────────────────────
function DocRequestTab({
  docs,
  onOpenRequestModal,
}: {
  docs: DocRequest[];
  onOpenRequestModal: () => void;
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
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onOpenRequestModal}
          style={{
            background: "#01ACC8",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "6px 16px",
            fontSize: 16,
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
          }}
        >
          + 서류 요청
        </button>
      </div>
      {docs.length === 0 ? (
        <EmptyState message="요청된 서류가 없습니다." />
      ) : (
        <DataTable
          columns={cols}
          data={docs as unknown as Record<string, unknown>[]}
          sectionLabel="서류요청"
          showExcel={false}
          showCheckbox={false}
        />
      )}
    </div>
  );
}

// ── PMS 연동 탭 ──────────────────────────────────────────────
function PmsTab({
  contract,
  onResync,
}: {
  contract: Contract;
  onResync: () => void;
}) {
  const logs = MOCK_PMS_LOGS[contract.id] ?? [];
  const pmsStatus = contract.pmsStatus ?? "PENDING";

  const cardColor =
    pmsStatus === "SYNCED"
      ? { bg: "#F0FDF4", border: "#BBF7D0", color: "#16A34A" }
      : pmsStatus === "FAILED"
      ? { bg: "#FEF2F2", border: "#FECACA", color: "#DC2626" }
      : { bg: "#FEFCE8", border: "#FDE68A", color: "#D97706" };

  const logCols: Column[] = [
    { key: "requestedAt", label: "요청일시", width: "160px", align: "center" },
    {
      key: "status",
      label: "상태",
      width: "100px",
      align: "center",
      render: (v) => <StatusBadge status={String(v)} />,
    },
    { key: "responseCode", label: "응답코드", width: "80px", align: "center" },
    { key: "note", label: "비고", align: "left" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* PMS 상태 카드 */}
      <div
        style={{
          background: cardColor.bg,
          border: `1px solid ${cardColor.border}`,
          borderRadius: 8,
          padding: "20px",
        }}
      >
        <div style={{ fontSize: 19, fontWeight: 700, color: cardColor.color, marginBottom: 12 }}>
          PMS 연동 상태: {pmsStatus}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
          {[
            ["PMS 수신일시", pmsStatus === "SYNCED" ? "2026-05-01 14:32:05" : "-"],
            ["PMS 계약 ID", pmsStatus === "SYNCED" ? "PMS-" + contract.id : "-"],
            ["연동 테이블", "SRM_ORDER_CONTRACT"],
            ["오류코드", pmsStatus === "FAILED" ? "500" : "-"],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 16, color: "#6B7280", minWidth: 100 }}>{label}</span>
              <span style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 재연동 버튼 */}
      {(pmsStatus === "FAILED" || pmsStatus === "PENDING") && (
        <div>
          <button
            onClick={onResync}
            style={{
              background: "#DC2626",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "8px 20px",
              fontSize: 16,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            재연동
          </button>
        </div>
      )}

      {/* 전송 이력 */}
      <div>
        <div style={{ fontSize: 17, fontWeight: 600, color: "#222", marginBottom: 8 }}>전송 이력</div>
        {logs.length === 0 ? (
          <EmptyState message="전송 이력이 없습니다." />
        ) : (
          <DataTable
            columns={logCols}
            data={logs as unknown as Record<string, unknown>[]}
            sectionLabel="전송이력"
            showExcel={false}
            showCheckbox={false}
          />
        )}
      </div>
    </div>
  );
}

// ── 변경이력 탭 ──────────────────────────────────────────────
function HistoryTab({ contractId }: { contractId: string }) {
  const items = MOCK_CONTRACT_HISTORIES.filter((h) => h.contractId === contractId);

  if (items.length === 0) {
    return <EmptyState message="변경 이력이 없습니다." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            gap: 16,
            padding: "14px 16px",
            background: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              background: "#01ACC8",
              borderRadius: "50%",
              marginTop: 5,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: "#9CA3AF", marginBottom: 4 }}>
              {item.changedAt} · {item.changedBy}
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#111", marginBottom: 4 }}>
              {item.item} 변경
            </div>
            <div style={{ fontSize: 16, color: "#374151" }}>
              <span style={{ color: "#DC2626" }}>{item.before}</span>
              {" → "}
              <span style={{ color: "#16A34A" }}>{item.after}</span>
            </div>
            <div style={{ fontSize: 15, color: "#6B7280", marginTop: 4 }}>사유: {item.reason}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 메인 페이지 ─────────────────────────────────────────────
export default function CContractsPage() {
  const toast = useToast();
  const [contracts, setContracts] = useState(MOCK_CONTRACTS);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 서류요청 모달
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docDue, setDocDue] = useState("");

  // 반려 모달
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectBondId, setRejectBondId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // PMS 재연동 토스트 (4초)
  const [resyncing, setResyncing] = useState(false);

  const handleRowClick = (row: Record<string, unknown>) => {
    const contract = contracts.find((c) => c.id === row.id);
    if (contract) {
      setSelectedContract(contract);
      setDrawerOpen(true);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedContract(null);
  };

  const handleApprove = (bondId: string) => {
    toast.show(`보증서 ${bondId} 승인 처리되었습니다.`, "success");
  };

  const handleReject = (bondId: string) => {
    setRejectBondId(bondId);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) return;
    toast.show(`보증서 ${rejectBondId} 반려 처리되었습니다.`, "error");
    setRejectModalOpen(false);
    setRejectBondId(null);
  };

  const handleResync = () => {
    if (resyncing) return;
    setResyncing(true);
    setTimeout(() => {
      if (selectedContract) {
        toast.show(
          `PMS 연동 완료. PMS 계약ID: ${selectedContract.id}`,
          "success"
        );
        setContracts((prev) =>
          prev.map((c) =>
            c.id === selectedContract.id ? { ...c, pmsStatus: "SYNCED" } : c
          )
        );
        setSelectedContract((prev) => (prev ? { ...prev, pmsStatus: "SYNCED" } : prev));
      }
      setResyncing(false);
    }, 4000);
  };

  const handleDocRequest = () => {
    if (!docName.trim()) return;
    toast.show(`서류 요청이 등록되었습니다: ${docName}`, "success");
    setDocModalOpen(false);
    setDocName("");
    setDocDue("");
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
    { key: "vendorName", label: "업체명", width: "160px", align: "center" },
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
      key: "pmsStatus",
      label: "PMS연동",
      width: "90px",
      align: "center",
      render: (v) => <StatusBadge status={String(v ?? "PENDING")} />,
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
            const contract = contracts.find((c) => c.id === v);
            if (contract) { setSelectedContract(contract); setDrawerOpen(true); }
          }}
          style={{
            background: "#01ACC8",
            color: "#fff",
            border: "none",
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
    { id: "info", label: "계약정보" },
    { id: "bond", label: "보증서확인" },
    { id: "doc", label: "서류요청" },
    { id: "pms", label: "PMS연동" },
    { id: "history", label: "변경이력" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* PMS 연동 안내 배너 */}
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
        <span style={{ fontSize: 16, color: "#1E40AF", fontWeight: 500 }}>
          <strong>PMS 공유접점:</strong> SRM_ORDER_CONTRACT 테이블이 PMS와 공유접점으로 연결됩니다.
          PMS 계약 조회 시 이 데이터가 직접 참조됩니다.
        </span>
      </div>

      <PageHeader title="계약 관리 (계약담당자)" />

      <SearchForm
        fields={[
          { label: "키워드", name: "keyword", type: "text", placeholder: "계약번호·계약명 검색" },
          {
            label: "상태",
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

      <DataTable
        columns={columns}
        data={contracts as unknown as Record<string, unknown>[]}
        sectionLabel="계약 목록"
        showCheckbox={false}
        onRowClick={handleRowClick}
      />

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
                {active === "info" && <ContractInfoTab contract={selectedContract} />}
                {active === "bond" && (
                  <BondTab
                    bonds={bonds}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                )}
                {active === "doc" && (
                  <DocRequestTab
                    docs={docs}
                    onOpenRequestModal={() => setDocModalOpen(true)}
                  />
                )}
                {active === "pms" && (
                  <PmsTab
                    contract={selectedContract}
                    onResync={handleResync}
                  />
                )}
                {active === "history" && <HistoryTab contractId={selectedContract.id} />}
              </div>
            )}
          </Tabs>
        )}
      </Drawer>

      {/* 서류 요청 Modal */}
      <Modal
        open={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        title="서류 요청 등록"
        width={480}
        footer={
          <>
            <button
              onClick={() => setDocModalOpen(false)}
              style={{
                background: "#fff",
                border: "1px solid #ccc",
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
              onClick={handleDocRequest}
              disabled={!docName.trim()}
              style={{
                background: docName.trim() ? "#01ACC8" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "6px 16px",
                fontSize: 16,
                cursor: docName.trim() ? "pointer" : "not-allowed",
                fontFamily: "inherit",
              }}
            >
              요청 등록
            </button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 16, color: "#555", display: "block", marginBottom: 4 }}>
              서류명 <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="요청할 서류명을 입력하세요"
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
            <label style={{ fontSize: 16, color: "#555", display: "block", marginBottom: 4 }}>
              제출기한
            </label>
            <input
              type="date"
              value={docDue}
              onChange={(e) => setDocDue(e.target.value)}
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
        </div>
      </Modal>

      {/* 반려 사유 Modal */}
      <Modal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="보증서 반려 사유 입력"
        width={480}
        footer={
          <>
            <button
              onClick={() => setRejectModalOpen(false)}
              style={{
                background: "#fff",
                border: "1px solid #ccc",
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
              onClick={handleRejectSubmit}
              disabled={!rejectReason.trim()}
              style={{
                background: rejectReason.trim() ? "#DC2626" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "6px 16px",
                fontSize: 16,
                cursor: rejectReason.trim() ? "pointer" : "not-allowed",
                fontFamily: "inherit",
              }}
            >
              반려 처리
            </button>
          </>
        }
      >
        <div>
          <label style={{ fontSize: 16, color: "#555", display: "block", marginBottom: 6 }}>
            반려 사유 <span style={{ color: "#DC2626" }}>*</span>{" "}
            <span style={{ color: "#9CA3AF", fontSize: 15 }}>(최대 1000자)</span>
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            maxLength={1000}
            rows={5}
            placeholder="반려 사유를 상세히 입력하세요."
            style={{
              width: "100%",
              padding: "8px 10px",
              border: `1px solid ${rejectReason.trim() ? "#ccc" : "#FCA5A5"}`,
              borderRadius: 4,
              fontSize: 16,
              fontFamily: "inherit",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          {!rejectReason.trim() && (
            <p style={{ fontSize: 15, color: "#DC2626", marginTop: 4 }}>
              반려 사유를 입력해야 합니다.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
