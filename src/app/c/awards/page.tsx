"use client";

import React, { useMemo, useState } from "react";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";
import Tabs from "@/components/Tabs";
import StatusGuide, { type StatusGuideSection } from "@/components/StatusGuide";
import { useToast } from "@/components/Toast";
import { CONTRACT_AUTHORITY_LABELS } from "@/lib/types";
import { useContractAuthority } from "@/lib/role";
import { METHOD_LABELS, MOCK_AWARDS, MOCK_BIDS, OPEN_BID_RESULTS, RESERVE_PRICES } from "@/lib/mock/bids";

const AWARD_GUIDE: StatusGuideSection[] = [
  {
    title: "낙찰관리 핵심 규칙",
    description: "계약담당자와 가격등록자/임원의 역할을 분리하고, 개찰 전 결과 노출을 막습니다.",
    items: [
      {
        code: "PENDING_APPROVAL",
        label: "예정가 입력대기",
        meaning: "예정가와 예비가격표가 아직 확정되지 않은 상태입니다.",
        owner: "가격등록자/임원",
        actions: "예정가 입력, 예비가 확정",
        next: "개찰대기",
        limit: "계약담당자는 읽기 전용",
      },
      {
        code: "OPENED",
        label: "개찰완료",
        meaning: "투찰 마감 이후 개찰이 실행되어 결과가 공개된 상태입니다.",
        owner: "계약담당자",
        actions: "개찰결과 검토, 낙찰후보 확인",
        next: "낙찰확정",
        limit: "개찰 전에는 결과표 비노출",
      },
      {
        code: "AWARDED",
        label: "낙찰확정",
        meaning: "낙찰업체가 최종 확정되어 계약관리 단계로 연계되는 상태입니다.",
        owner: "계약담당자",
        actions: "결과 통보, 계약 생성",
        next: "계약 관리",
        limit: "확정 후 되돌리기 없음",
      },
    ],
  },
];

const btn = (variant: "primary" | "secondary" | "danger" | "ghost" = "primary"): React.CSSProperties => ({
  padding: "8px 18px",
  borderRadius: 6,
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
  border: variant === "primary" ? "1px solid #DFE8F0" : "1px solid #CBD5E1",
  background: variant === "primary" ? "#654024" : variant === "danger" ? "#FEF2F2" : "#fff",
  color: variant === "primary" ? "#fff" : variant === "danger" ? "#B91C1C" : "#334155",
});

function DrawModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);

  function toggle(no: number) {
    setSelected((prev) => {
      if (prev.includes(no)) return prev.filter((item) => item !== no);
      if (prev.length >= 2) return prev;
      return [...prev, no];
    });
  }

  const avg = selected.length === 2
    ? Math.round((RESERVE_PRICES[selected[0] - 1].amount + RESERVE_PRICES[selected[1] - 1].amount) / 2)
    : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="예비가 추첨"
      width={560}
      footer={
        <>
          <button style={btn("secondary")} onClick={onClose}>취소</button>
          <button style={btn("primary")} disabled={selected.length < 2} onClick={onConfirm}>예정가 확정</button>
        </>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
        {RESERVE_PRICES.map((item) => (
          <button
            key={item.no}
            onClick={() => toggle(item.no)}
            style={{
              padding: "10px 0",
              borderRadius: 8,
              border: selected.includes(item.no) ? "2px solid #01ACC8" : "1px solid #CBD5E1",
              background: selected.includes(item.no) ? "#E0F2FE" : "#fff",
              color: selected.includes(item.no) ? "#0369A1" : "#334155",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 700,
            }}
          >
            {item.no}
          </button>
        ))}
      </div>
      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px", fontSize: 15 }}>
        <div>선택 번호: {selected.length > 0 ? selected.join(", ") : "-"}</div>
        <div style={{ marginTop: 4 }}>예정가(산술평균): {avg ? `${avg.toLocaleString()}원` : "-"}</div>
      </div>
    </Modal>
  );
}

export default function CAwardsPage() {
  const toast = useToast();
  const [authority] = useContractAuthority();
  const [selectedBidId, setSelectedBidId] = useState("BID-2026-005");
  const [showDetail, setShowDetail] = useState(false);
  const [estAmount, setEstAmount] = useState(98000000);
  const [floorRate, setFloorRate] = useState(87.0);
  const [drawModalOpen, setDrawModalOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [awarded, setAwarded] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);

  const selectedBid = MOCK_BIDS.find((bid) => bid.id === selectedBidId) ?? MOCK_BIDS[0];
  const canManagePrice = authority === "PRICE_REVIEWER";
  const canOpenBid = opened === false && selectedBid.status === "CLOSED";
  const lowerBound = Math.round(estAmount * floorRate / 100);

  const awardListColumns: Column[] = useMemo(
    () => [
      { key: "id", label: "공고ID", width: "130px", align: "center" },
      { key: "title", label: "공고명", align: "left" },
      { key: "method", label: "낙찰방법", width: "100px", align: "center", render: (value) => METHOD_LABELS[String(value)] ?? String(value) },
      { key: "status", label: "상태", width: "100px", align: "center", render: (value) => <StatusBadge status={String(value)} /> },
      {
        key: "id",
        label: "진행단계",
        width: "130px",
        align: "center",
        render: (value) => {
          const stageMap: Record<string, string> = {
            "BID-2026-005": "예정가대기",
            "BID-2026-004": "낙찰확정대기",
            "BID-2026-003": "낙찰완료",
            "BID-2026-002": "유찰",
            "BID-2026-001": "낙찰완료",
          };
          return <span style={{ fontSize: 14, color: "#475569" }}>{stageMap[String(value)] ?? "-"}</span>;
        },
      },
    ],
    [],
  );

  const openedColumns: Column[] = useMemo(
    () => [
      { key: "rank", label: "순위", width: "60px", align: "center" },
      { key: "vendorName", label: "업체명", align: "left" },
      { key: "amount", label: "투찰금액", width: "140px", align: "right", render: (value, row) => row.abandoned ? "투찰포기" : `${Number(value).toLocaleString()}원` },
      { key: "estRate", label: "예정가대비율", width: "120px", align: "center" },
      { key: "qualified", label: "하한충족", width: "90px", align: "center", render: (value, row) => row.abandoned ? "—" : value ? "충족" : "미달" },
      { key: "candidate", label: "낙찰후보", width: "90px", align: "center", render: (value, row) => row.abandoned ? "—" : value ? "후보" : "제외" },
    ],
    [],
  );

  const awardHistoryColumns: Column[] = useMemo(
    () => [
      { key: "id", label: "낙찰ID", width: "130px", align: "center" },
      { key: "title", label: "공고명", align: "left" },
      { key: "vendorName", label: "낙찰업체", width: "160px", align: "center" },
      { key: "awardedAmount", label: "낙찰금액", width: "130px", align: "right", render: (value) => `${Number(value).toLocaleString()}원` },
      { key: "status", label: "상태", width: "100px", align: "center", render: (value) => <StatusBadge status={String(value)} /> },
      { key: "awardedAt", label: "확정일", width: "110px", align: "center" },
    ],
    [],
  );

  function handleOpenBid() {
    setOpened(true);
    toast.show("개찰이 완료되었습니다.", "success");
  }

  function handleAwardConfirm() {
    setAwarded(true);
    toast.show("낙찰이 확정되었습니다.", "success");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PageHeader
        title="낙찰관리"
        actions={<StatusGuide screenName="SCR-S-10 낙찰관리" sections={AWARD_GUIDE} />}
      />

      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 18px", fontSize: 15, color: "#334155", lineHeight: 1.7 }}>
        현재 시연 권한: <strong>{CONTRACT_AUTHORITY_LABELS[authority]}</strong>
        {" · "}
        고객사 요구사항 강조포인트: 예정가/예비가 입력은 가격등록자/임원만 가능하고, 계약담당자는 읽기 전용으로만 확인합니다.
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#334155", whiteSpace: "nowrap" }}>입찰 선택</span>
          <select
            value={selectedBidId}
            onChange={(event) => { setSelectedBidId(event.target.value); setShowDetail(true); setOpened(false); setAwarded(false); }}
            style={{ flex: 1, padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 16, fontFamily: "inherit" }}
          >
            {MOCK_BIDS.map((bid) => (
              <option key={bid.id} value={bid.id}>
                {bid.id} · {bid.title} ({METHOD_LABELS[bid.method]})
              </option>
            ))}
          </select>
          <StatusBadge status={selectedBid.status} />
          <button style={btn("primary")} onClick={() => setShowDetail(true)}>조회</button>
        </div>
      </div>

      {!showDetail && (
        <DataTable
          columns={awardListColumns}
          data={MOCK_BIDS as unknown as Record<string, unknown>[]}
          sectionLabel="낙찰관리 대상 공고"
          onRowClick={(row) => { setSelectedBidId(String(row.id)); setShowDetail(true); setOpened(false); setAwarded(false); }}
          showCheckbox={false}
        />
      )}

      {showDetail && (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <button style={btn("secondary")} onClick={() => setShowDetail(false)}>목록</button>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
              {selectedBid.id} / {selectedBid.title}
            </span>
          </div>
          <Tabs tabs={[{ id: "price", label: "예정가 관리" }, { id: "open", label: "개찰결과" }, { id: "award", label: "낙찰확정" }]}>
            {(tab) => (
              <>
                {tab === "price" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ background: canManagePrice ? "#ECFDF5" : "#FEF3C7", border: `1px solid ${canManagePrice ? "#A7F3D0" : "#FDE68A"}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, color: canManagePrice ? "#166534" : "#92400E" }}>
                      {canManagePrice
                        ? "가격등록자/임원 권한이라 예정가와 예비가격표를 입력할 수 있습니다."
                        : "계약담당자 권한이라 예정가·예비가격표는 읽기 전용입니다."}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 14, color: "#64748B", marginBottom: 6 }}>예정금액</div>
                        <input type="number" disabled={!canManagePrice} value={estAmount} onChange={(event) => setEstAmount(Number(event.target.value))} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 15, fontFamily: "inherit" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, color: "#64748B", marginBottom: 6 }}>낙찰하한율</div>
                        <input type="number" disabled={!canManagePrice} value={floorRate} onChange={(event) => setFloorRate(Number(event.target.value))} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 15, fontFamily: "inherit" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, color: "#64748B", marginBottom: 6 }}>낙찰하한금액</div>
                        <div style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#F8FAFC", fontSize: 15, fontWeight: 700 }}>{lowerBound.toLocaleString()}원</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                      <button style={btn("secondary")} disabled={!canManagePrice}>저장</button>
                      <button style={btn("primary")} disabled={!canManagePrice} onClick={() => setDrawModalOpen(true)}>예비가 추첨</button>
                    </div>
                  </div>
                )}
                {tab === "open" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                      <span style={{ fontSize: 15, color: "#334155" }}>개찰 조건</span>
                      <StatusBadge status={canOpenBid ? "PENDING_APPROVAL" : opened ? "OPENED" : "CLOSED"} label={opened ? "개찰완료" : canOpenBid ? "개찰가능" : "개찰불가"} />
                      <span style={{ fontSize: 14, color: "#64748B" }}>투찰 마감 완료 + 예정가 확정 후 개찰 버튼이 활성화됩니다.</span>
                      <button style={{ ...btn("primary"), marginLeft: "auto", opacity: canOpenBid ? 1 : 0.45 }} disabled={!canOpenBid} onClick={handleOpenBid}>개찰 실행</button>
                    </div>
                    {opened ? (
                      <DataTable
                        columns={openedColumns}
                        data={OPEN_BID_RESULTS as unknown as Record<string, unknown>[]}
                        sectionLabel="개찰결과"
                        showCheckbox={false}
                        showExcel={false}
                      />
                    ) : (
                      <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "18px 20px", fontSize: 16, color: "#9A3412", lineHeight: 1.7 }}>
                        개찰 전에는 낙찰 후보 순위와 업체별 금액을 노출하지 않습니다.
                        프로토타입에서도 결과 테이블을 숨겨 요구사항을 우선 표현합니다.
                      </div>
                    )}
                  </div>
                )}
                {tab === "award" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {!opened ? (
                      <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "18px 20px", fontSize: 16, color: "#9A3412" }}>
                        개찰이 완료되기 전에는 낙찰 확정으로 진행할 수 없습니다.
                      </div>
                    ) : (
                      <>
                        <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px 18px" }}>
                          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>낙찰 후보</div>
                          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 12px", fontSize: 15 }}>
                            <span style={{ color: "#64748B" }}>후보 업체</span>
                            <strong>(주)한국전기솔루션</strong>
                            <span style={{ color: "#64748B" }}>투찰금액</span>
                            <strong>86,500,000원</strong>
                            <span style={{ color: "#64748B" }}>확정 조건</span>
                            <strong>예정가 이하 최저가 + 하한율 충족</strong>
                          </div>
                        </div>
                        {awarded ? (
                          <div style={{ background: "#EDE9FE", border: "1px solid #DDD6FE", borderRadius: 10, padding: "18px 20px", fontSize: 16, color: "#5B21B6", lineHeight: 1.7 }}>
                            낙찰이 확정되었습니다. 결과 통보 후 계약관리 화면에서 계약 생성으로 연결합니다.
                            <div style={{ marginTop: 12 }}>
                              <button style={btn("primary")} onClick={() => setNotifyModalOpen(true)}>결과 통보 발송</button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button style={btn("primary")} onClick={handleAwardConfirm}>낙찰 확정</button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </Tabs>
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 12 }}>낙찰 이력</div>
        <DataTable columns={awardHistoryColumns} data={MOCK_AWARDS as unknown as Record<string, unknown>[]} sectionLabel="낙찰 이력" showCheckbox={false} />
      </div>

      <DrawModal open={drawModalOpen} onClose={() => setDrawModalOpen(false)} onConfirm={() => { setDrawModalOpen(false); toast.show("예정가가 확정되었습니다.", "success"); }} />
      <Modal
        open={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        title="낙찰 결과 통보"
        footer={
          <>
            <button style={btn("secondary")} onClick={() => setNotifyModalOpen(false)}>취소</button>
            <button style={btn("primary")} onClick={() => { setNotifyModalOpen(false); toast.show("낙찰 결과가 참여업체에 통보되었습니다.", "success"); }}>메일 발송</button>
          </>
        }
      >
        <div style={{ fontSize: 16, color: "#334155", lineHeight: 1.7 }}>
          개찰 완료 후 확정된 결과만 참여업체에 통보합니다. 개찰 전 결과 비노출 원칙을 유지하기 위해,
          이 모달은 낙찰 확정 이후에만 열리도록 구성했습니다.
        </div>
      </Modal>
    </div>
  );
}
