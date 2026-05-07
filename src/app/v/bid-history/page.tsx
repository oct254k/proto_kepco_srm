"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import Tabs from "@/components/Tabs";
import Drawer from "@/components/Drawer";
import { useToast } from "@/components/Toast";
import { V_BID_HISTORY, BID_METHOD_LABELS } from "@/lib/mock/contracts";

// ── 인라인 유틸 ──────────────────────────────────────────────
function fmt(n: number) {
  return n.toLocaleString() + "원";
}

function methodLabel(method: string) {
  return BID_METHOD_LABELS[method] ?? method;
}

// ── 집계 카드 ────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
}
function StatCard({ label, value, color = "#00a7ea" }: StatCardProps) {
  return (
    <div
      style={{
        background: "#FAF7F2",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 15, color: "#6B7280" }}>{label}</div>
      <div style={{ fontSize: 27, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

// ── 상세 Drawer (4탭) ────────────────────────────────────────
type BidRow = typeof V_BID_HISTORY[number];
function BidDetailDrawer({ bid, open, onClose }: { bid: BidRow | null; open: boolean; onClose: () => void }) {
  if (!bid) return null;
  return (
    <Drawer open={open} onClose={onClose} title={`${bid.id} · ${bid.title}`} width={600}>
      <Tabs
        tabs={[
          { id: "part", label: "참여정보" },
          { id: "selfcheck", label: "자가심사결과" },
          { id: "amount", label: "투찰결과" },
          { id: "eval", label: "평가결과" },
        ]}
      >
        {(tab) => (
          <div>
            {tab === "part" && (
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 12px" }}>
                {[
                  ["공고번호", bid.id],
                  ["공고명", bid.title],
                  ["선정방법", BID_METHOD_LABELS[bid.method] ?? bid.method],
                  ["참여일", bid.participatedAt],
                  ["상태", bid.status],
                ].map(([k, v]) => (
                  <React.Fragment key={k as string}>
                    <span style={{ fontSize: 16, color: "#888" }}>{k}</span>
                    <span style={{ fontSize: 16, color: "#333", fontWeight: 500 }}>
                      {k === "상태" ? <StatusBadge status={v as string} /> : v}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            )}
            {tab === "selfcheck" && (
              bid.status === "IN_PROGRESS" ? (
                <div style={{ color: "#888", fontSize: 16 }}>자가심사 진행 중입니다.</div>
              ) : (
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#333" }}>적격심사 결과</div>
                  {["시공능력평가 보유여부", "재무건전성 기준 충족", "관련 면허 보유"].map((item) => (
                    <div key={item} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <span style={{ fontSize: 16, flex: 1, color: "#444" }}>{item}</span>
                      <StatusBadge status="통과" />
                    </div>
                  ))}
                </div>
              )
            )}
            {tab === "amount" && (
              bid.myAmount === 0 ? (
                <div style={{ color: "#888", fontSize: 16 }}>투찰 전 또는 미참여 상태입니다.</div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px 12px" }}>
                  {[
                    ["투찰금액", `${bid.myAmount.toLocaleString()}원`],
                    ["예정가 대비", "99.7%"],
                    ["순위", "2위 / 3업체"],
                    ["결과", bid.status === "AWARDED" ? "낙찰" : "미낙찰"],
                  ].map(([k, v]) => (
                    <React.Fragment key={k as string}>
                      <span style={{ fontSize: 16, color: "#888" }}>{k}</span>
                      <span style={{ fontSize: 16, color: "#333", fontWeight: 500 }}>{v}</span>
                    </React.Fragment>
                  ))}
                </div>
              )
            )}
            {tab === "eval" && (
              bid.status === "AWARDED" || bid.status === "CLOSED" ? (
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#333" }}>심사 평가결과</div>
                  {[
                    { item: "가격 점수", score: 95 },
                    { item: "기술 점수", score: 88 },
                    { item: "신용평가", score: 90 },
                  ].map((e) => (
                    <div key={e.item} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <span style={{ fontSize: 16, flex: 1, color: "#444" }}>{e.item}</span>
                      <span style={{ fontSize: 16, fontWeight: 600, color: "#00a7ea" }}>{e.score}점</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="평가결과가 아직 확정되지 않았습니다." />
              )
            )}
          </div>
        )}
      </Tabs>
    </Drawer>
  );
}

// ── 탭 1: 입찰참여현황 ───────────────────────────────────────
function BidParticipationTab({ onRowClick }: { onRowClick: (row: Record<string, unknown>) => void }) {
  const cols: Column[] = [
    { key: "id", label: "공고번호", width: "130px", align: "center" },
    { key: "title", label: "공고명", align: "left" },
    {
      key: "method",
      label: "선정방법",
      width: "100px",
      align: "center",
      render: (v) => methodLabel(String(v)),
    },
    { key: "participatedAt", label: "참여일", width: "110px", align: "center" },
    {
      key: "status",
      label: "상태",
      width: "100px",
      align: "center",
      render: (v) => <StatusBadge status={String(v)} />,
    },
    {
      key: "id",
      label: "진행단계",
      width: "240px",
      align: "center",
      render: (_v, row) => {
        const status = String(row.status);
        const stages = [
          { id: "참여신청", done: true },
          { id: "투찰", done: status !== "IN_PROGRESS" },
          { id: "결과확인", done: status === "AWARDED" || status === "CLOSED" },
        ];
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
            {stages.map((s, i) => (
              <React.Fragment key={s.id}>
                {i > 0 && (
                  <div
                    style={{
                      width: 16,
                      height: 2,
                      background: s.done ? "#00a7ea" : "#E5E7EB",
                    }}
                  />
                )}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: s.done ? "#00a7ea" : "#E5E7EB",
                      border: `2px solid ${s.done ? "#00a7ea" : "#D1D5DB"}`,
                    }}
                  />
                  <span style={{ fontSize: 12, color: s.done ? "#00a7ea" : "#9CA3AF", marginTop: 2 }}>
                    {s.id}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        );
      },
    },
  ];

  const participated = V_BID_HISTORY.length;
  const bidded = V_BID_HISTORY.filter((b) => b.myAmount > 0).length;
  const awarded = V_BID_HISTORY.filter((b) => b.status === "AWARDED").length;
  const rate = participated > 0 ? Math.round((awarded / participated) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <DataTable
        columns={cols}
        data={V_BID_HISTORY as unknown as Record<string, unknown>[]}
        sectionLabel="입찰참여 목록"
        showExcel={false}
        showCheckbox={false}
        onRowClick={onRowClick}
      />

      {/* 집계 카드 */}
      <div style={{ display: "flex", gap: 12 }}>
        <StatCard label="참여" value={`${participated}건`} color="#2563EB" />
        <StatCard label="투찰" value={`${bidded}건`} color="#D97706" />
        <StatCard label="낙찰" value={`${awarded}건`} color="#16A34A" />
        <StatCard label="낙찰률" value={`${rate}%`} color="#7C3AED" />
      </div>
    </div>
  );
}

// ── 탭 2: 투찰현황 ───────────────────────────────────────────
function BidAmountTab({ onRowClick }: { onRowClick: (row: Record<string, unknown>) => void }) {
  const biddedItems = V_BID_HISTORY.filter((b) => b.myAmount > 0);

  const cols: Column[] = [
    { key: "id", label: "공고번호", width: "130px", align: "center" },
    { key: "title", label: "공고명", align: "left" },
    {
      key: "myAmount",
      label: "투찰금액",
      width: "150px",
      align: "right",
      render: (v) => fmt(Number(v)),
    },
    { key: "participatedAt", label: "투찰일", width: "110px", align: "center" },
    {
      key: "status",
      label: "낙찰여부",
      width: "100px",
      align: "center",
      render: (v) => {
        const s = String(v);
        if (s === "AWARDED") return <StatusBadge status="AWARDED" />;
        if (s === "CLOSED") return <StatusBadge status="CLOSED" />;
        return <StatusBadge status={s} />;
      },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          background: "#F0F9FF",
          border: "1px solid #BAE6FD",
          borderRadius: 6,
          padding: "8px 14px",
          fontSize: 15,
          color: "#0369A1",
        }}
      >
        ※ 투찰금액·낙찰여부는 개찰 완료 후 공개됩니다.
      </div>
      {biddedItems.length === 0 ? (
        <EmptyState message="투찰 완료된 공고가 없습니다." />
      ) : (
        <DataTable
          columns={cols}
          data={biddedItems as unknown as Record<string, unknown>[]}
          sectionLabel="투찰 목록"
          showExcel={false}
          showCheckbox={false}
          onRowClick={onRowClick}
        />
      )}
    </div>
  );
}

// ── 탭 3: 낙찰확인 ───────────────────────────────────────────
function AwardTab({ onRowClick }: { onRowClick: (row: Record<string, unknown>) => void }) {
  const router = useRouter();
  const awardedItems = V_BID_HISTORY.filter((b) => b.status === "AWARDED");

  const cols: Column[] = [
    { key: "id", label: "공고번호", width: "130px", align: "center" },
    { key: "title", label: "공고명", align: "left" },
    {
      key: "myAmount",
      label: "낙찰금액",
      width: "150px",
      align: "right",
      render: (v) => fmt(Number(v)),
    },
    { key: "participatedAt", label: "낙찰일", width: "110px", align: "center" },
    {
      key: "id",
      label: "계약 진행",
      width: "140px",
      align: "center",
      render: () => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push("/v/contracts/");
          }}
          style={{
            background: "#654024",
            color: "#fff",
            border: "1px solid #DFE8F0",
            borderRadius: 4,
            padding: "4px 12px",
            fontSize: 15,
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
          }}
        >
          계약 진행하기 →
        </button>
      ),
    },
  ];

  return (
    <>
      {awardedItems.length === 0 ? (
        <EmptyState message="낙찰 확정된 공고가 없습니다." />
      ) : (
        <DataTable
          columns={cols}
          data={awardedItems as unknown as Record<string, unknown>[]}
          sectionLabel="낙찰 목록"
          showExcel={false}
          showCheckbox={false}
          onRowClick={onRowClick}
        />
      )}
    </>
  );
}

// ── 탭 4: 평가결과 ───────────────────────────────────────────
const MOCK_EVALUATIONS = [
  {
    id: "BID-2026-001",
    title: "사무용 PC 납품",
    selfScore: 88.5,
    finalScore: 91.2,
    result: "PASS",
  },
  {
    id: "BID-2025-048",
    title: "변압기 유지보수",
    selfScore: 75.0,
    finalScore: 78.3,
    result: "FAIL",
  },
];

function EvalTab({ onRowClick }: { onRowClick: (row: Record<string, unknown>) => void }) {
  const evalItems = MOCK_EVALUATIONS;

  const cols: Column[] = [
    { key: "id", label: "공고번호", width: "130px", align: "center" },
    { key: "title", label: "공고명", align: "left" },
    {
      key: "selfScore",
      label: "자가심사 점수",
      width: "130px",
      align: "center",
      render: (v) => (
        <span>
          {Number(v).toFixed(1)}{" "}
          <span style={{ fontSize: 14, color: "#9CA3AF" }}>/ 100</span>
        </span>
      ),
    },
    {
      key: "finalScore",
      label: "최종 평가 점수",
      width: "130px",
      align: "center",
      render: (v) => (
        <span>
          {Number(v).toFixed(1)}{" "}
          <span style={{ fontSize: 14, color: "#9CA3AF" }}>/ 100</span>
        </span>
      ),
    },
    {
      key: "result",
      label: "결과",
      width: "90px",
      align: "center",
      render: (v) => {
        const pass = v === "PASS";
        return (
          <span
            style={{
              background: pass ? "#D1FAE5" : "#FEE2E2",
              color: pass ? "#065F46" : "#991B1B",
              borderRadius: 999,
              padding: "2px 10px",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            {pass ? "통과" : "탈락"}
          </span>
        );
      },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          background: "#F9FAFB",
          border: "1px solid #E5E7EB",
          borderRadius: 6,
          padding: "8px 14px",
          fontSize: 15,
          color: "#6B7280",
        }}
      >
        ※ 평가결과는 심사가 완료된 공고만 조회됩니다.
      </div>
      {evalItems.length === 0 ? (
        <EmptyState message="평가결과가 조회되지 않습니다. 심사가 완료된 공고만 조회됩니다." />
      ) : (
        <DataTable
          columns={cols}
          data={evalItems as unknown as Record<string, unknown>[]}
          sectionLabel="평가결과"
          showExcel={false}
          showCheckbox={false}
          onRowClick={onRowClick}
        />
      )}
    </div>
  );
}

// ── 메인 페이지 ─────────────────────────────────────────────
export default function VBidHistoryPage() {
  const toast = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<BidRow | null>(null);

  function handleRowClick(row: Record<string, unknown>) {
    const bid = V_BID_HISTORY.find((b) => b.id === (row.id as string));
    if (bid) {
      setSelectedBid(bid);
      setDrawerOpen(true);
    }
  }

  // 낙찰 확정 미확인 건 존재 시 4초 후 Toast
  useEffect(() => {
    const hasAwarded = V_BID_HISTORY.some((b) => b.status === "AWARDED");
    if (!hasAwarded) return;
    const timer = setTimeout(() => {
      toast.show("낙찰 확정 건이 있습니다. [계약 진행하기]로 이동하세요.", "info");
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const pageTabs = [
    { id: "participation", label: "입찰참여현황" },
    { id: "amount", label: "투찰현황" },
    { id: "award", label: "낙찰확인" },
    { id: "eval", label: "평가결과" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader title="입찰·투찰 현황" />

      <div
        style={{
          background: "#FAF7F2",
          border: "1px solid #E5E7EB",
          borderRadius: 8,
          padding: "20px",
        }}
      >
        <Tabs tabs={pageTabs}>
          {(active) => (
            <div>
              {active === "participation" && <BidParticipationTab onRowClick={handleRowClick} />}
              {active === "amount" && <BidAmountTab onRowClick={handleRowClick} />}
              {active === "award" && <AwardTab onRowClick={handleRowClick} />}
              {active === "eval" && <EvalTab onRowClick={handleRowClick} />}
            </div>
          )}
        </Tabs>
      </div>

      <BidDetailDrawer
        bid={selectedBid}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
