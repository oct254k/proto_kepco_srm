"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Drawer from "@/components/Drawer";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/components/Toast";
import { MOCK_NOTICES } from "@/lib/mock/common";
import {
  V_SUMMARY,
  V_PENDING_QUOTES,
  V_ACTIVE_BIDS,
  V_CONTRACTS,
  V_ACTIVE_BID_ITEMS,
} from "@/lib/mock/vendor_dashboard";
import type { Notice } from "@/lib/types";

// ─── 요약 카드 ───────────────────────────────────────────────────────────────
interface SummaryCardProps {
  label: string;
  value: number;
  unit?: string;
  accent: string;
  href?: string;
}

function SummaryCard({ label, value, unit = "건", accent, href }: SummaryCardProps) {
  const inner = (
    <div
      style={{
        background: "#FAF7F2",
        borderRadius: 8,
        boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
        overflow: "hidden",
        cursor: href ? "pointer" : "default",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        if (href) (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.10)";
      }}
      role="region"
      aria-label={label}
    >
      <div style={{ height: 4, background: accent }} />
      <div style={{ padding: "20px 24px 18px" }}>
        <p style={{ margin: 0, fontSize: 16, color: "#6B7280", fontWeight: 500 }}>{label}</p>
        <p style={{ margin: "8px 0 0", fontSize: 35, fontWeight: 700, color: "#111827", lineHeight: 1 }}>
          {value}
          <span style={{ fontSize: 17, fontWeight: 500, color: "#9CA3AF", marginLeft: 4 }}>{unit}</span>
        </p>
      </div>
    </div>
  );
  if (href) return <Link href={href} style={{ textDecoration: "none" }}>{inner}</Link>;
  return inner;
}

// ─── 위젯 카드 래퍼 ──────────────────────────────────────────────────────────
function WidgetCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#FAF7F2",
        borderRadius: 8,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
      role="region"
      aria-label={title}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <span style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{title}</span>
        {action}
      </div>
      <div style={{ padding: "16px 20px" }}>{children}</div>
    </div>
  );
}

// ─── 미니 캘린더 ─────────────────────────────────────────────────────────────
function MiniCalendar() {
  const year = 2026;
  const month = 4; // 4월
  // 2026-04-01은 수요일 (0=일, 1=월, ... 3=수)
  const startDay = new Date(year, month - 1, 1).getDay(); // 3 (수)
  const daysInMonth = new Date(year, month, 0).getDate(); // 30

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(startDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week); }

  const markers: Record<number, { type: "심사" | "투찰"; label: string }> = {
    19: { type: "심사", label: "자가심사(BID-004)" },
    23: { type: "투찰", label: "투찰마감(BID-005)" },
  };

  const today = 22;

  return (
    <div>
      <p style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600, color: "#374151", textAlign: "center" }}>
        {year}년 {String(month).padStart(2, "0")}월
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
        <thead>
          <tr>
            {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
              <th
                key={d}
                style={{
                  padding: "4px 0",
                  textAlign: "center",
                  color: i === 0 ? "#EF4444" : i === 6 ? "#3B82F6" : "#6B7280",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((w, wi) => (
            <tr key={wi}>
              {w.map((day, di) => {
                const marker = day ? markers[day] : undefined;
                const isToday = day === today;
                return (
                  <td
                    key={di}
                    style={{ padding: "3px 1px", textAlign: "center", verticalAlign: "top" }}
                  >
                    {day !== null && (
                      <div>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: isToday ? "#00a7ea" : "transparent",
                            color: isToday ? "#fff" : di === 0 ? "#EF4444" : di === 6 ? "#3B82F6" : "#374151",
                            fontWeight: isToday ? 700 : 400,
                            fontSize: 15,
                          }}
                        >
                          {day}
                        </span>
                        {marker && (
                          <div
                            style={{
                              marginTop: 1,
                              fontSize: 12,
                              lineHeight: 1.2,
                              color: marker.type === "투찰" ? "#EF4444" : "#8B5CF6",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 36,
                            }}
                            title={marker.label}
                          >
                            {marker.type === "투찰" ? "▲투찰" : "●심사"}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* 범례 */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 10, fontSize: 14, color: "#6B7280" }}>
        <span><span style={{ color: "#8B5CF6" }}>●</span> 자가심사마감</span>
        <span><span style={{ color: "#EF4444" }}>▲</span> 투찰마감</span>
      </div>
    </div>
  );
}

// ─── 공지사항 Drawer 내부 ────────────────────────────────────────────────────
function NoticeDrawerContent({
  notices,
  selectedNotice,
  onSelect,
}: {
  notices: Notice[];
  selectedNotice: Notice | null;
  onSelect: (n: Notice | null) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = notices.filter(
    (n) => n.title.includes(search) || n.content.includes(search)
  );

  if (selectedNotice) {
    const idx = notices.findIndex((n) => n.id === selectedNotice.id);
    const prev = idx > 0 ? notices[idx - 1] : null;
    const next = idx < notices.length - 1 ? notices[idx + 1] : null;
    return (
      <div>
        <button
          onClick={() => onSelect(null)}
          style={{
            background: "transparent",
            border: "none",
            color: "#00a7ea",
            cursor: "pointer",
            fontSize: 16,
            padding: "0 0 12px",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ← 목록으로
        </button>
        <div
          style={{
            background: "#F9FAFB",
            borderRadius: 6,
            padding: "16px 20px",
            border: "1px solid #E5E7EB",
          }}
        >
          <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#111827" }}>
            {selectedNotice.title}
          </h3>
          <div style={{ fontSize: 15, color: "#6B7280", marginBottom: 14 }}>
            등록일: {selectedNotice.createdAt} &nbsp;|&nbsp; 작성자: {selectedNotice.author}
          </div>
          <p style={{ margin: 0, fontSize: 17, color: "#374151", lineHeight: 1.7 }}>
            {selectedNotice.content}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <button
            disabled={!prev}
            onClick={() => prev && onSelect(prev)}
            style={{
              background: prev ? "#fff" : "#F3F4F6",
              border: "1px solid #E5E7EB",
              borderRadius: 4,
              padding: "6px 14px",
              fontSize: 15,
              cursor: prev ? "pointer" : "not-allowed",
              color: prev ? "#374151" : "#9CA3AF",
            }}
          >
            ← 이전
          </button>
          <button
            disabled={!next}
            onClick={() => next && onSelect(next)}
            style={{
              background: next ? "#fff" : "#F3F4F6",
              border: "1px solid #E5E7EB",
              borderRadius: 4,
              padding: "6px 14px",
              fontSize: 15,
              cursor: next ? "pointer" : "not-allowed",
              color: next ? "#374151" : "#9CA3AF",
            }}
          >
            다음 →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 검색 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="공지사항 검색..."
          style={{
            flex: 1,
            border: "1px solid #D1D5DB",
            borderRadius: 4,
            padding: "7px 12px",
            fontSize: 16,
            outline: "none",
          }}
        />
        <button
          style={{
            background: "#654024",
            color: "#fff",
            border: "1px solid #DFE8F0",
            borderRadius: 4,
            padding: "7px 16px",
            fontSize: 16,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          검색
        </button>
      </div>

      {/* 목록 */}
      <div style={{ border: "1px solid #E5E7EB", borderRadius: 6, overflow: "hidden" }}>
        {/* 헤더 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "48px 64px 1fr 80px",
            background: "#F9FAFB",
            borderBottom: "1px solid #E5E7EB",
            padding: "8px 12px",
            fontSize: 15,
            fontWeight: 600,
            color: "#6B7280",
          }}
        >
          <span>번호</span>
          <span>유형</span>
          <span>제목</span>
          <span style={{ textAlign: "right" }}>등록일</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", fontSize: 16, color: "#9CA3AF" }}>
            검색 결과가 없습니다.
          </div>
        ) : (
          filtered.map((n, i) => (
            <div
              key={n.id}
              onClick={() => onSelect(n)}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 64px 1fr 80px",
                padding: "10px 12px",
                borderBottom: i < filtered.length - 1 ? "1px solid #F3F4F6" : "none",
                cursor: "pointer",
                alignItems: "center",
                fontSize: 16,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#F0F9FF";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "#fff";
              }}
            >
              <span style={{ color: "#9CA3AF" }}>{MOCK_NOTICES.length - i}</span>
              <span>
                <span
                  style={{
                    display: "inline-block",
                    padding: "1px 6px",
                    borderRadius: 4,
                    fontSize: 14,
                    fontWeight: 600,
                    background: n.isPinned ? "#FEE2E2" : "#F3F4F6",
                    color: n.isPinned ? "#DC2626" : "#6B7280",
                  }}
                >
                  {n.isPinned ? "긴급" : "일반"}
                </span>
              </span>
              <span
                style={{
                  color: "#111827",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {n.title}
              </span>
              <span style={{ color: "#9CA3AF", textAlign: "right", fontSize: 15 }}>
                {n.createdAt.slice(5)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────────
export default function VendorDashboardPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const { show } = useToast();

  // D-1 Toast (4초 후)
  useEffect(() => {
    const timer = setTimeout(() => {
      show("견적 마감 D-1 건이 있습니다.", "info");
    }, 4000);
    return () => clearTimeout(timer);
  }, [show]);

  // 견적 테이블 컬럼
  const quoteColumns = [
    { key: "id", label: "견적번호", width: "130px" },
    { key: "title", label: "견적명", align: "left" as const },
    { key: "requestedAt", label: "요청일", width: "100px" },
    { key: "deadline", label: "마감일", width: "100px" },
    {
      key: "status",
      label: "상태",
      width: "100px",
      render: (v: unknown) => <StatusBadge status={String(v)} />,
    },
  ];

  // 입찰 테이블 컬럼
  const bidColumns = [
    { key: "id", label: "입찰번호", width: "130px" },
    { key: "title", label: "공고명", align: "left" as const },
    {
      key: "method",
      label: "방법",
      width: "90px",
      render: (v: unknown) => (
        <span style={{ fontSize: 15, color: "#6B7280" }}>
          {v === "LIMITED" ? "제한경쟁" : v === "TWO_STAGE" ? "2단계" : String(v)}
        </span>
      ),
    },
    {
      key: "estAmount",
      label: "추정금액",
      width: "120px",
      align: "right" as const,
      render: (v: unknown) =>
        typeof v === "number" ? `${(v / 100000000).toFixed(1)}억` : String(v),
    },
    { key: "deadline", label: "마감일", width: "100px" },
    {
      key: "status",
      label: "상태",
      width: "80px",
      render: (v: unknown) => <StatusBadge status={String(v)} />,
    },
  ];

  // 계약 테이블 컬럼
  const contractColumns = [
    { key: "id", label: "계약번호", width: "130px" },
    { key: "title", label: "계약명", align: "left" as const },
    {
      key: "amount",
      label: "금액",
      width: "110px",
      align: "right" as const,
      render: (v: unknown) =>
        typeof v === "number" ? `${v.toLocaleString()}원` : String(v),
    },
    { key: "startDate", label: "시작일", width: "100px" },
    { key: "endDate", label: "종료일", width: "100px" },
    {
      key: "status",
      label: "상태",
      width: "80px",
      render: (v: unknown) => <StatusBadge status={String(v)} />,
    },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      {/* 페이지 헤더 */}
      <PageHeader
        title="협력업체 대시보드"
        actions={
          <span style={{ fontSize: 16, color: "#6B7280" }}>2026-04-22</span>
        }
      />

      {/* D-1 마감 알림 배너 */}
      <div
        role="alert"
        aria-live="assertive"
        style={{
          background: "#FFFBEB",
          border: "1px solid #FCD34D",
          borderRadius: 6,
          padding: "10px 16px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 16, color: "#92400E", fontWeight: 500 }}>
          ⚠ 마감 D-1 알림: &quot;태양광 설비 물품 구매&quot; 견적 마감이 내일입니다!
        </span>
        <Link
          href="/v/quotes/"
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#B45309",
            textDecoration: "none",
            whiteSpace: "nowrap",
            border: "1px solid #FCD34D",
            borderRadius: 4,
            padding: "4px 12px",
            background: "#FEF3C7",
          }}
        >
          바로가기 →
        </Link>
      </div>

      {/* 요약 카드 4열 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <SummaryCard label="견적 대기" value={V_SUMMARY.pendingQuotes} accent="#F59E0B" href="/v/quotes/" />
        <SummaryCard label="참여 중 입찰" value={V_SUMMARY.activeBids} accent="#3B82F6" href="/v/bid-pipeline/" />
        <SummaryCard label="진행 중 계약" value={V_SUMMARY.activeContracts} accent="#10B981" href="/v/contracts/" />
        <SummaryCard label="제출 대기 보증서" value={V_SUMMARY.pendingBonds} accent="#8B5CF6" href="/v/contracts/" />
      </div>

      {/* Row 1: 견적요청 현황 + 입찰참여 현황 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* 견적요청 수신 현황 */}
        <WidgetCard
          title="견적요청 수신 현황"
          action={
            <Link href="/v/quotes/" style={{ fontSize: 15, color: "#00a7ea", textDecoration: "none", fontWeight: 600 }}>
              견적작성 바로가기 →
            </Link>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ fontSize: 16, color: "#6B7280" }}>미제출 요청</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>5건</span>
            </div>
            <div style={{ paddingLeft: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 15 }}>
                <span style={{ color: "#9CA3AF" }}>마감 D-1</span>
                <span style={{ fontWeight: 600, color: "#EF4444" }}>1건 🔴</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 15 }}>
                <span style={{ color: "#9CA3AF" }}>마감 D-3</span>
                <span style={{ fontWeight: 600, color: "#F97316" }}>2건 🟠</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ fontSize: 16, color: "#6B7280" }}>제출 완료</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#10B981" }}>3건</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <span style={{ fontSize: 16, color: "#6B7280" }}>포기 / 만료</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#9CA3AF" }}>1건</span>
            </div>
          </div>
        </WidgetCard>

        {/* 나의 입찰 참여 현황 */}
        <WidgetCard
          title="나의 입찰 참여 현황"
          action={
            <Link href="/v/bid-pipeline/" style={{ fontSize: 15, color: "#00a7ea", textDecoration: "none", fontWeight: 600 }}>
              입찰참여 바로가기 →
            </Link>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ fontSize: 16, color: "#6B7280" }}>참여신청</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>2건</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ fontSize: 16, color: "#6B7280" }}>자가심사 진행중</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#3B82F6" }}>1건</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6" }}>
              <span style={{ fontSize: 16, color: "#6B7280" }}>투찰중</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#F97316" }}>2건</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <span style={{ fontSize: 16, color: "#6B7280" }}>낙찰확정</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#10B981" }}>1건 ✅</span>
            </div>
          </div>
        </WidgetCard>
      </div>

      {/* Row 2: 캘린더(2/3) + 공지사항(1/3) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* 미니 캘린더 */}
        <WidgetCard title="나의 입찰 일정 (2026년 04월)">
          <MiniCalendar />
        </WidgetCard>

        {/* 공지사항 미리보기 */}
        <WidgetCard
          title="최근 공지사항"
          action={
            <button
              onClick={() => { setSelectedNotice(null); setDrawerOpen(true); }}
              style={{
                background: "transparent",
                border: "none",
                fontSize: 15,
                color: "#00a7ea",
                cursor: "pointer",
                fontWeight: 600,
                padding: 0,
              }}
            >
              공지 전체보기 →
            </button>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {MOCK_NOTICES.map((n) => (
              <div
                key={n.id}
                onClick={() => { setSelectedNotice(n); setDrawerOpen(true); }}
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid #F3F4F6",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "#F0F9FF";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      padding: "1px 5px",
                      borderRadius: 3,
                      background: n.isPinned ? "#FEE2E2" : "#F3F4F6",
                      color: n.isPinned ? "#DC2626" : "#6B7280",
                    }}
                  >
                    {n.isPinned ? "긴급" : "일반"}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      color: "#111827",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {n.title}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "#9CA3AF" }}>{n.createdAt}</p>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>

      {/* Row 3: 나의 견적요청 현황 테이블 */}
      <div style={{ marginBottom: 16 }}>
        <WidgetCard
          title="나의 견적요청 현황"
          action={
            <Link href="/v/quotes/" style={{ fontSize: 15, color: "#00a7ea", textDecoration: "none", fontWeight: 600 }}>
              전체보기 →
            </Link>
          }
        >
          <DataTable
            columns={quoteColumns}
            data={V_PENDING_QUOTES as unknown as Record<string, unknown>[]}
            sectionLabel="견적 목록"
            showExcel={false}
            showCheckbox={false}
            totalCount={V_PENDING_QUOTES.length}
          />
        </WidgetCard>
      </div>

      {/* Row 4: 참여 가능 입찰공고 */}
      <div style={{ marginBottom: 16 }}>
        <WidgetCard
          title="참여 가능 입찰공고"
          action={
            <Link href="/v/bid-pipeline/" style={{ fontSize: 15, color: "#00a7ea", textDecoration: "none", fontWeight: 600 }}>
              전체보기 →
            </Link>
          }
        >
          <DataTable
            columns={bidColumns}
            data={V_ACTIVE_BIDS as unknown as Record<string, unknown>[]}
            sectionLabel="입찰공고 목록"
            showExcel={false}
            showCheckbox={false}
            totalCount={V_ACTIVE_BIDS.length}
          />
        </WidgetCard>
      </div>

      {/* Row 5: 나의 진행 중인 입찰 건 */}
      <div style={{ marginBottom: 16 }}>
        <WidgetCard title="나의 진행 중인 입찰 건">
          <div style={{ overflowX: "auto", border: "1px solid #E5E7EB", borderRadius: 4 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  {["입찰공고명", "단계", "투찰마감일", "D-day"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 14px",
                        borderBottom: "1px solid #E5E7EB",
                        textAlign: h === "입찰공고명" ? "left" : "center",
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#6B7280",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {V_ACTIVE_BID_ITEMS.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{ background: "#ffffff", cursor: "pointer" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = "#F0F9FF";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = "#fff";
                    }}
                    onClick={() => (window.location.href = "/v/bid-pipeline/")}
                  >
                    <td
                      style={{
                        padding: "10px 14px",
                        borderBottom: idx < V_ACTIVE_BID_ITEMS.length - 1 ? "1px solid #F3F4F6" : "none",
                        color: "#111827",
                        fontWeight: 500,
                      }}
                    >
                      {item.title}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        borderBottom: idx < V_ACTIVE_BID_ITEMS.length - 1 ? "1px solid #F3F4F6" : "none",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 10px",
                          borderRadius: 999,
                          fontSize: 15,
                          fontWeight: 600,
                          background:
                            item.stage === "투찰중"
                              ? "#FEE2E2"
                              : item.stage === "낙찰확정"
                              ? "#D1FAE5"
                              : "#DBEAFE",
                          color: item.stageColor,
                        }}
                      >
                        {item.stage}
                        {item.stage === "투찰중" && " ▶"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        borderBottom: idx < V_ACTIVE_BID_ITEMS.length - 1 ? "1px solid #F3F4F6" : "none",
                        textAlign: "center",
                        color: "#374151",
                      }}
                    >
                      {item.deadline}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        borderBottom: idx < V_ACTIVE_BID_ITEMS.length - 1 ? "1px solid #F3F4F6" : "none",
                        textAlign: "center",
                        fontWeight: 700,
                        color: item.ddayColor,
                      }}
                    >
                      {item.dday}
                      {item.dday === "D-1" && " 🔴"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WidgetCard>
      </div>

      {/* 진행 중 계약 */}
      <div style={{ marginBottom: 16 }}>
        <WidgetCard
          title="진행 중 계약"
          action={
            <Link href="/v/contracts/" style={{ fontSize: 15, color: "#00a7ea", textDecoration: "none", fontWeight: 600 }}>
              전체보기 →
            </Link>
          }
        >
          <DataTable
            columns={contractColumns}
            data={V_CONTRACTS as unknown as Record<string, unknown>[]}
            sectionLabel="계약 목록"
            showExcel={false}
            showCheckbox={false}
            totalCount={V_CONTRACTS.length}
          />
        </WidgetCard>
      </div>

      {/* 공지사항 Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="공지사항"
        width={560}
      >
        <NoticeDrawerContent
          notices={MOCK_NOTICES}
          selectedNotice={selectedNotice}
          onSelect={setSelectedNotice}
        />
      </Drawer>
    </div>
  );
}
