"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import Tabs from "@/components/Tabs";
import Drawer from "@/components/Drawer";
import StatusGuide, { type StatusGuideSection } from "@/components/StatusGuide";
import { V_BID_HISTORY } from "@/lib/mock/contracts";

const BID_HISTORY_GUIDE: StatusGuideSection[] = [
  {
    title: "입찰·투찰 현황 결과 해석",
    items: [
      {
        code: "SUBMITTED",
        label: "투찰제출완료",
        meaning: "본인 업체가 투찰을 완료했지만 개찰 전이라 상세 결과는 보이지 않는 상태입니다.",
        owner: "협력업체",
        actions: "제출 확인",
        next: "낙찰 / 미낙찰 / 유찰",
        limit: "개찰 전 타 업체 금액·순위 비노출",
      },
      {
        code: "AWARDED",
        label: "낙찰",
        meaning: "본인 업체가 낙찰되어 계약 진행 화면으로 넘어갈 수 있는 상태입니다.",
        owner: "협력업체",
        actions: "계약 진행 이동",
        next: "계약·보증",
        limit: "계약 상세 수정 권한 없음",
      },
      {
        code: "NOT_AWARDED",
        label: "미낙찰",
        meaning: "개찰 결과 본인 업체가 낙찰되지 않은 상태입니다.",
        owner: "협력업체",
        actions: "평가 결과 확인",
        next: "없음",
        limit: "타 업체 상세 금액 비노출",
      },
      {
        code: "FAILED_BID",
        label: "유찰",
        meaning: "입찰 자체가 유찰로 종료된 상태입니다.",
        owner: "계약담당자",
        actions: "유찰 안내 확인",
        next: "재공고 가능",
        limit: "개별 업체 순위 없음",
      },
    ],
  },
];

type BidRow = typeof V_BID_HISTORY[number];

function fmt(amount: number) {
  return `${amount.toLocaleString()}원`;
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ flex: 1, minWidth: 0, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
    </div>
  );
}

function BidDetailDrawer({ bid, open, onClose }: { bid: BidRow | null; open: boolean; onClose: () => void }) {
  if (!bid) return null;

  const resultStatus =
    bid.status === "AWARDED"
      ? "AWARDED"
      : bid.status === "FAILED_BID"
      ? "FAILED_BID"
      : bid.status === "SUBMITTED"
      ? "NOT_AWARDED"
      : bid.status;

  return (
    <Drawer open={open} onClose={onClose} title={`${bid.id} · ${bid.title}`} width={640}>
      <Tabs tabs={[
        { id: "part", label: "참여정보" },
        { id: "result", label: "결과요약" },
      ]}>
        {(tab) => (
          <>
            {tab === "part" && (
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 12px", fontSize: 15 }}>
                <span style={{ color: "#64748B" }}>공고번호</span>
                <strong>{bid.id}</strong>
                <span style={{ color: "#64748B" }}>공고명</span>
                <strong>{bid.title}</strong>
                <span style={{ color: "#64748B" }}>참여일</span>
                <strong>{bid.participatedAt}</strong>
                <span style={{ color: "#64748B" }}>현재상태</span>
                <div><StatusBadge status={bid.status} /></div>
              </div>
            )}
            {tab === "result" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {bid.status === "SUBMITTED" ? (
                  <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "18px 20px", fontSize: 15, color: "#9A3412", lineHeight: 1.7 }}>
                    개찰 전이라 본인 업체 제출금액만 확인할 수 있습니다. 타 업체 금액, 순위, 낙찰 결과는 아직 공개되지 않습니다.
                    <div style={{ marginTop: 8, fontWeight: 700 }}>본인 제출금액: {fmt(bid.myAmount)}</div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 12px", fontSize: 15 }}>
                    <span style={{ color: "#64748B" }}>본인 투찰금액</span>
                    <strong>{fmt(bid.myAmount)}</strong>
                    <span style={{ color: "#64748B" }}>결과상태</span>
                    <div><StatusBadge status={resultStatus} /></div>
                  </div>
                )}
                <div style={{ fontSize: 15, color: "#334155", lineHeight: 1.7 }}>
                  {bid.status === "AWARDED"
                    ? "심사와 개찰 결과 낙찰이 확정되었습니다."
                    : bid.status === "FAILED_BID"
                    ? "유찰로 종료되어 평가 결과 대신 종료 사유만 확인합니다."
                    : "평가 결과는 개찰 및 낙찰 확정 이후 범위 내에서만 공개합니다."}
                </div>
              </div>
            )}
          </>
        )}
      </Tabs>
    </Drawer>
  );
}

export default function VBidHistoryPage() {
  const router = useRouter();
  const [selectedBid, setSelectedBid] = useState<BidRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const participated = V_BID_HISTORY.length;
  const bidded = V_BID_HISTORY.filter((item) => item.myAmount > 0).length;
  const awarded = V_BID_HISTORY.filter((item) => item.status === "AWARDED").length;
  const failed = V_BID_HISTORY.filter((item) => item.status === "FAILED_BID").length;

  const baseColumns: Column[] = useMemo(
    () => [
      { key: "id", label: "공고번호", width: "130px", align: "center" },
      { key: "title", label: "공고명", align: "left" },
      { key: "participatedAt", label: "참여일", width: "110px", align: "center" },
      { key: "status", label: "상태", width: "110px", align: "center", render: (value) => <StatusBadge status={String(value)} /> },
    ],
    [],
  );

  const amountColumns: Column[] = useMemo(
    () => [
      ...baseColumns.slice(0, 2),
      { key: "myAmount", label: "본인 투찰금액", width: "150px", align: "right", render: (value) => fmt(Number(value)) },
      {
        key: "status",
        label: "결과 공개",
        width: "120px",
        align: "center",
        render: (value) => {
          const status = String(value);
          return status === "SUBMITTED" ? "개찰 전 비공개" : <StatusBadge status={status === "FAILED_BID" ? "FAILED_BID" : status === "AWARDED" ? "AWARDED" : "NOT_AWARDED"} />;
        },
      },
    ],
    [baseColumns],
  );

  const awardColumns: Column[] = useMemo(
    () => [
      { key: "id", label: "공고번호", width: "130px", align: "center" },
      { key: "title", label: "공고명", align: "left" },
      { key: "myAmount", label: "낙찰금액", width: "150px", align: "right", render: (value) => fmt(Number(value)) },
      {
        key: "id",
        label: "계약 진행",
        width: "140px",
        align: "center",
        render: () => (
          <button
            onClick={(event) => {
              event.stopPropagation();
              router.push("/v/contracts/");
            }}
            style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#01ACC8", color: "#fff", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}
          >
            계약 진행
          </button>
        ),
      },
    ],
    [router],
  );

  function openBid(row: Record<string, unknown>) {
    const found = V_BID_HISTORY.find((item) => item.id === row.id);
    if (!found) return;
    setSelectedBid(found);
    setDrawerOpen(true);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader
        title="입찰·투찰 현황"
        actions={<StatusGuide screenName="SCR-S-13 입찰·투찰 현황" sections={BID_HISTORY_GUIDE} />}
      />

      <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: "14px 18px", fontSize: 15, color: "#1D4ED8", lineHeight: 1.7 }}>
        고객사 요구사항 강조포인트: 개찰 전에는 타 업체 금액과 순위를 숨기고, 결과 공개 이후에만 낙찰/미낙찰/유찰 상태를 드러냅니다.
        <div style={{ marginTop: 6, fontSize: 13, color: "#475569" }}>관련 요구사항 코드: SFR-005 / A-2 투찰 상태 제어 / A-2 협력업체 데이터 격리 / Z-6 / Y-7</div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <StatCard label="참여" value={`${participated}건`} color="#2563EB" />
        <StatCard label="투찰" value={`${bidded}건`} color="#D97706" />
        <StatCard label="낙찰" value={`${awarded}건`} color="#16A34A" />
        <StatCard label="유찰" value={`${failed}건`} color="#B91C1C" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
        <Tabs tabs={[
          { id: "participation", label: "입찰참여현황" },
          { id: "amount", label: "투찰현황" },
          { id: "award", label: "낙찰확인" },
          { id: "eval", label: "평가결과" },
        ]}>
          {(tab) => (
            <>
              {tab === "participation" && (
                <DataTable columns={baseColumns} data={V_BID_HISTORY as unknown as Record<string, unknown>[]} sectionLabel="입찰참여 목록" showCheckbox={false} showExcel={false} onRowClick={openBid} />
              )}
              {tab === "amount" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "12px 16px", fontSize: 15, color: "#9A3412" }}>
                    개찰 전에는 본인 업체 제출금액만 유지하고, 타 업체 금액/순위는 노출하지 않습니다.
                  </div>
                  <DataTable columns={amountColumns} data={V_BID_HISTORY.filter((item) => item.myAmount > 0) as unknown as Record<string, unknown>[]} sectionLabel="투찰 목록" showCheckbox={false} showExcel={false} onRowClick={openBid} />
                </div>
              )}
              {tab === "award" && (
                V_BID_HISTORY.some((item) => item.status === "AWARDED") ? (
                  <DataTable columns={awardColumns} data={V_BID_HISTORY.filter((item) => item.status === "AWARDED") as unknown as Record<string, unknown>[]} sectionLabel="낙찰 목록" showCheckbox={false} showExcel={false} onRowClick={openBid} />
                ) : (
                  <EmptyState message="낙찰 확정된 공고가 없습니다." />
                )
              )}
              {tab === "eval" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "14px 16px", fontSize: 15, color: "#334155" }}>
                    평가결과는 개찰 및 낙찰 확정 이후 범위 내에서만 공개합니다. 유찰 건은 평가 결과 대신 종료 상태만 보여줍니다.
                  </div>
                  <DataTable
                    columns={[
                      { key: "id", label: "공고번호", width: "130px", align: "center" },
                      { key: "title", label: "공고명", align: "left" },
                      { key: "status", label: "최종 결과", width: "120px", align: "center", render: (value) => <StatusBadge status={String(value) === "AWARDED" ? "AWARDED" : String(value) === "FAILED_BID" ? "FAILED_BID" : "NOT_AWARDED"} /> },
                    ]}
                    data={V_BID_HISTORY as unknown as Record<string, unknown>[]}
                    sectionLabel="평가결과"
                    showCheckbox={false}
                    showExcel={false}
                    onRowClick={openBid}
                  />
                </div>
              )}
            </>
          )}
        </Tabs>
      </div>

      <BidDetailDrawer bid={selectedBid} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
