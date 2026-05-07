"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Tabs from "@/components/Tabs";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Drawer from "@/components/Drawer";
import { useToast } from "@/components/Toast";
import { MOCK_NOTICES } from "@/lib/mock/common";
import {
  B_SUMMARY,
  B_DASHBOARD_QUOTES,
  B_DASHBOARD_ORDERS,
  B_DASHBOARD_BIDS,
  CALENDAR_EVENTS,
  B_BID_PROGRESS,
  type BidProgress,
} from "@/lib/mock/dashboard";
import type { Notice } from "@/lib/types";

// ────────────────────────────────────────────
// 요약 카드 컴포넌트
// ────────────────────────────────────────────
interface SummaryCardProps {
  label: string;
  value: number;
  unit?: string;
  accent?: string;
  href?: string;
}

function SummaryCard({ label, value, unit = "건", accent = "#01ACC8", href }: SummaryCardProps) {
  const inner = (
    <div
      role="region"
      aria-label={label}
      style={{
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "stretch",
        overflow: "hidden",
        cursor: href ? "pointer" : "default",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        if (href) (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.14)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
      }}
    >
      {/* 왼쪽 색상 바 */}
      <div style={{ width: 5, background: accent, flexShrink: 0 }} />
      <div style={{ flex: 1, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: 16, color: "#555", fontWeight: 500 }}>{label}</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
          <span style={{ fontSize: 30, fontWeight: 700, color: accent, lineHeight: 1 }}>
            {value.toLocaleString()}
          </span>
          <span style={{ fontSize: 16, color: "#888" }}>{unit}</span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none", display: "block" }}>
        {inner}
      </Link>
    );
  }
  return inner;
}

// ────────────────────────────────────────────
// 현황 위젯 (견적요청 / 발주요청 / 배정심사)
// ────────────────────────────────────────────
interface StatWidgetProps {
  title: string;
  rows: { label: string; value: string | number; highlight?: boolean }[];
  linkLabel: string;
  linkHref: string;
}

function StatWidget({ title, rows, linkLabel, linkHref }: StatWidgetProps) {
  return (
    <div
      role="region"
      aria-label={title}
      style={{
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ height: 5, background: "#01ACC8" }} />
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
        <span style={{ fontSize: 17, fontWeight: 700, color: "#222" }}>{title}</span>
      </div>
      <div style={{ padding: "12px 20px", flex: 1 }}>
        {rows.map((row, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px 0",
              borderBottom: idx < rows.length - 1 ? "1px solid #f5f5f5" : "none",
            }}
          >
            <span style={{ fontSize: 16, color: "#555" }}>{row.label}</span>
            <span
              style={{
                fontSize: 19,
                fontWeight: 700,
                color: row.highlight ? "#DC2626" : "#01ACC8",
              }}
            >
              {row.value}
              {row.highlight && " 🔴"}
            </span>
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 20px", borderTop: "1px solid #f0f0f0" }}>
        <Link
          href={linkHref}
          style={{
            fontSize: 16,
            color: "#01ACC8",
            fontWeight: 600,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {linkLabel} →
        </Link>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// 미니 캘린더 컴포넌트
// ────────────────────────────────────────────
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function MiniCalendar() {
  const year = 2026;
  const month = 4; // 4월 (0-indexed: 3)
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=일
  const daysInMonth = new Date(year, month, 0).getDate(); // 30
  const today = 22; // 오늘 (목)

  const eventMap: Record<number, (typeof CALENDAR_EVENTS)[0][]> = {};
  CALENDAR_EVENTS.forEach((ev) => {
    if (!eventMap[ev.date]) eventMap[ev.date] = [];
    eventMap[ev.date].push(ev);
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const markerSymbol = (type: string) => {
    if (type === "notice") return { symbol: "●", color: "#1D4ED8" };
    if (type === "deadline") return { symbol: "▲", color: "#EA580C" };
    return { symbol: "★", color: "#16A34A" };
  };

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 1,
          marginBottom: 4,
        }}
      >
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 14,
              fontWeight: 600,
              color: "#888",
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <React.Fragment key={wi}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
            }}
          >
            {week.map((day, di) => {
              const events = day ? eventMap[day] : undefined;
              const isToday = day === today;
              return (
                <div
                  key={di}
                  aria-label={
                    day
                      ? `${year}년 ${month}월 ${day}일${events ? `, 일정 ${events.length}건` : ""}`
                      : undefined
                  }
                  style={{
                    textAlign: "center",
                    padding: "4px 2px",
                    borderRadius: 4,
                    cursor: events ? "pointer" : "default",
                    background: isToday ? "#01ACC8" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (events && !isToday)
                      (e.currentTarget as HTMLDivElement).style.background = "#e0f5f9";
                  }}
                  onMouseLeave={(e) => {
                    if (!isToday)
                      (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }}
                  title={events ? events.map((ev) => ev.label).join(", ") : undefined}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: 16,
                      fontWeight: isToday ? 700 : 400,
                      color: isToday ? "#fff" : di === 0 ? "#DC2626" : di === 6 ? "#1D4ED8" : "#333",
                    }}
                  >
                    {day ?? ""}
                  </span>
                  {events && (
                    <div style={{ display: "flex", justifyContent: "center", gap: 1, marginTop: 1 }}>
                      {events.slice(0, 2).map((ev, ei) => {
                        const m = markerSymbol(ev.type);
                        return (
                          <span
                            key={ei}
                            style={{ fontSize: 11, color: m.color, lineHeight: 1 }}
                          >
                            {m.symbol}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* 이벤트 라벨 행 */}
          {week.some((d) => d && eventMap[d]) && (
            <div
              style={{
                paddingLeft: 4,
                paddingBottom: 2,
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              {week.map((d) =>
                d && eventMap[d]
                  ? eventMap[d].map((ev, i) => {
                      const m = markerSymbol(ev.type);
                      return (
                        <span
                          key={`${d}-${i}`}
                          style={{
                            fontSize: 13,
                            color: m.color,
                            background: "#f8f8f8",
                            borderRadius: 3,
                            padding: "1px 4px",
                          }}
                        >
                          {m.symbol}
                          {ev.label}
                        </span>
                      );
                    })
                  : null
              )}
            </div>
          )}
        </React.Fragment>
      ))}
      {/* 범례 */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 10,
          paddingTop: 8,
          borderTop: "1px solid #eee",
          flexWrap: "wrap",
        }}
      >
        {[
          { symbol: "●", color: "#1D4ED8", label: "공고일" },
          { symbol: "▲", color: "#EA580C", label: "투찰마감" },
          { symbol: "★", color: "#16A34A", label: "개찰예정" },
        ].map((leg) => (
          <span
            key={leg.label}
            style={{ fontSize: 14, color: "#555", display: "flex", alignItems: "center", gap: 3 }}
          >
            <span style={{ color: leg.color, fontWeight: 700 }}>{leg.symbol}</span>
            {leg.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// 공지사항 Drawer 내용
// ────────────────────────────────────────────
interface NoticeDrawerContentProps {
  notices: Notice[];
}

function NoticeDrawerContent({ notices }: NoticeDrawerContentProps) {
  const [selected, setSelected] = useState<Notice | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("전체");

  const filtered = notices.filter((n) => {
    const matchSearch = n.title.includes(search) || n.content.includes(search);
    if (typeFilter === "전체") return matchSearch;
    if (typeFilter === "긴급") return matchSearch && n.isPinned;
    return matchSearch && !n.isPinned;
  });

  if (selected) {
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          style={{
            marginBottom: 16,
            background: "transparent",
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            padding: "4px 12px",
            fontSize: 16,
            cursor: "pointer",
            color: "#555",
            fontFamily: "inherit",
          }}
        >
          ← 목록으로
        </button>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#222" }}>
          {selected.title}
        </h3>
        <div style={{ fontSize: 15, color: "#888", marginBottom: 16, display: "flex", gap: 16 }}>
          <span>등록일: {selected.createdAt}</span>
          <span>조회수: 42</span>
        </div>
        <div
          style={{
            background: "#f9f9f9",
            borderRadius: 6,
            padding: "16px",
            fontSize: 16,
            color: "#444",
            lineHeight: 1.7,
            minHeight: 120,
          }}
        >
          {selected.content}
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a
            href="#"
            style={{
              fontSize: 16,
              color: "#01ACC8",
              textDecoration: "none",
              background: "#e0f5f9",
              padding: "4px 10px",
              borderRadius: 4,
            }}
          >
            📎 점검계획서.pdf ↓
          </a>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            paddingTop: 12,
            borderTop: "1px solid #eee",
          }}
        >
          <button
            onClick={() => {
              const idx = notices.indexOf(selected);
              if (idx > 0) setSelected(notices[idx - 1]);
            }}
            disabled={notices.indexOf(selected) === 0}
            style={{
              background: "transparent",
              border: "1px solid #e0e0e0",
              borderRadius: 4,
              padding: "5px 14px",
              fontSize: 16,
              cursor: "pointer",
              fontFamily: "inherit",
              color: "#555",
            }}
          >
            &#8249; 이전
          </button>
          <button
            onClick={() => {
              const idx = notices.indexOf(selected);
              if (idx < notices.length - 1) setSelected(notices[idx + 1]);
            }}
            disabled={notices.indexOf(selected) === notices.length - 1}
            style={{
              background: "transparent",
              border: "1px solid #e0e0e0",
              borderRadius: 4,
              padding: "5px 14px",
              fontSize: 16,
              cursor: "pointer",
              fontFamily: "inherit",
              color: "#555",
            }}
          >
            다음 &#8250;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 검색 영역 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "7px 10px",
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            fontSize: 16,
            fontFamily: "inherit",
            outline: "none",
          }}
        />
        <button
          style={{
            padding: "7px 14px",
            background: "#01ACC8",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          검색
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: "6px 10px",
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            fontSize: 16,
            fontFamily: "inherit",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          <option>전체</option>
          <option>긴급</option>
          <option>일반</option>
        </select>
        <input
          type="text"
          placeholder="기간 (시작)"
          style={{
            width: 100,
            padding: "6px 8px",
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            fontSize: 15,
            fontFamily: "inherit",
          }}
        />
        <span style={{ lineHeight: "32px", color: "#888", fontSize: 15 }}>~</span>
        <input
          type="text"
          placeholder="기간 (종료)"
          style={{
            width: 100,
            padding: "6px 8px",
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            fontSize: 15,
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* 목록 */}
      <div style={{ border: "1px solid #e0e0e0", borderRadius: 6, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ padding: "10px 12px", fontWeight: 600, color: "#444", textAlign: "center", width: 48 }}>번호</th>
              <th style={{ padding: "10px 12px", fontWeight: 600, color: "#444", textAlign: "center", width: 64 }}>유형</th>
              <th style={{ padding: "10px 12px", fontWeight: 600, color: "#444", textAlign: "left" }}>제목</th>
              <th style={{ padding: "10px 12px", fontWeight: 600, color: "#444", textAlign: "center", width: 80 }}>등록일</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 24, textAlign: "center", color: "#888" }}>
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((n, idx) => (
                <tr
                  key={n.id}
                  onClick={() => setSelected(n)}
                  style={{ cursor: "pointer", borderTop: "1px solid #eee" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#f0f8fb")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#fff")}
                >
                  <td style={{ padding: "10px 12px", textAlign: "center", color: "#888" }}>
                    {notices.length - idx}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 14,
                        fontWeight: 700,
                        background: n.isPinned ? "#FEE2E2" : "#EEF2FF",
                        color: n.isPinned ? "#991B1B" : "#3730A3",
                      }}
                    >
                      {n.isPinned ? "긴급" : "일반"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#333" }}>{n.title}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center", color: "#888", whiteSpace: "nowrap" }}>
                    {n.createdAt.slice(5).replace("-", "-")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// 메인 대시보드 페이지
// ────────────────────────────────────────────
export default function BDashboardPage() {
  const { show } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 4초 후 Toast 알림 (명세 §7)
  useEffect(() => {
    const timer = setTimeout(() => {
      show("미처리 심사 건이 있습니다.", "info");
    }, 4000);
    return () => clearTimeout(timer);
  }, [show]);

  // 테이블 컬럼 정의
  const quoteColumns = [
    { key: "id", label: "견적요청번호", width: "140px", align: "center" as const },
    { key: "title", label: "제목", align: "left" as const },
    {
      key: "status",
      label: "상태",
      width: "100px",
      align: "center" as const,
      render: (v: unknown) => <StatusBadge status={String(v)} />,
    },
    { key: "deadline", label: "마감일", width: "100px", align: "center" as const },
  ];

  const orderColumns = [
    { key: "id", label: "발주요청번호", width: "140px", align: "center" as const },
    { key: "title", label: "제목", align: "left" as const },
    {
      key: "status",
      label: "상태",
      width: "100px",
      align: "center" as const,
      render: (v: unknown) => <StatusBadge status={String(v)} />,
    },
    { key: "assignee", label: "담당팀", width: "90px", align: "center" as const },
  ];

  const bidProgressColumns = [
    { key: "title", label: "공고명", align: "left" as const },
    {
      key: "status",
      label: "상태",
      width: "90px",
      align: "center" as const,
      render: (v: unknown) => {
        const s = String(v);
        const colorMap: Record<string, { bg: string; color: string }> = {
          공고중: { bg: "#DBEAFE", color: "#1E40AF" },
          투찰중: { bg: "#FEF3C7", color: "#92400E" },
          낙찰확정: { bg: "#D1FAE5", color: "#065F46" },
        };
        const c = colorMap[s] || { bg: "#f0f0f0", color: "#666" };
        return (
          <span
            style={{
              display: "inline-block",
              background: c.bg,
              color: c.color,
              borderRadius: 999,
              padding: "2px 10px",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            {s}
          </span>
        );
      },
    },
    { key: "orderId", label: "발주요청번호", width: "140px", align: "center" as const },
    { key: "deadline", label: "마감일", width: "80px", align: "center" as const },
  ];

  const today = "2026-04-22(수)";
  const CARD_ACCENTS = ["#01ACC8", "#41C1D6", "#80D6E4", "#C0EAF1"];

  return (
    <div style={{ width: "100%" }}>
      {/* 인사말 + 날짜 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 23, fontWeight: 700, color: "#222" }}>
            안녕하세요, 김담당 님{" "}
            <span style={{ fontSize: 17, fontWeight: 400, color: "#888" }}>(사업담당자)</span>
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 16, color: "#888" }}>
            오늘도 좋은 하루 되세요.
          </p>
        </div>
        <span style={{ fontSize: 17, color: "#555", fontWeight: 500 }}>{today}</span>
      </div>

      {/* ── Row 0: 요약 카드 4개 ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <SummaryCard label="견적요청 대기" value={B_SUMMARY.pendingQuotes} accent={CARD_ACCENTS[0]} href="/b/quote-requests/" />
        <SummaryCard label="발주 대기" value={B_SUMMARY.pendingOrders} accent={CARD_ACCENTS[1]} href="/b/orders/" />
        <SummaryCard label="진행 중 입찰" value={B_SUMMARY.activeBids} accent={CARD_ACCENTS[2]} href="/b/bids/" />
        <SummaryCard label="완료된 계약" value={B_SUMMARY.completedContracts} accent={CARD_ACCENTS[3]} />
      </div>

      {/* ── Row 1: 현황 위젯 3열 ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* 나의 견적요청 현황 */}
        <StatWidget
          title="나의 견적요청 현황"
          rows={[
            { label: "진행중", value: "8건" },
            { label: "마감임박(D3)", value: "3건", highlight: true },
            { label: "완료", value: "12건" },
          ]}
          linkLabel="견적요청 바로가기"
          linkHref="/b/quote-requests/"
        />

        {/* 나의 발주요청 현황 */}
        <StatWidget
          title="나의 발주요청 현황"
          rows={[
            { label: "작성중", value: "2건" },
            { label: "접수대기", value: "5건" },
            { label: "처리중", value: "3건" },
            { label: "완료", value: "8건" },
          ]}
          linkLabel="발주요청 바로가기"
          linkHref="/b/orders/"
        />

        {/* 배정 심사 */}
        <StatWidget
          title="배정 심사"
          rows={[
            { label: "미완료", value: "3건", highlight: true },
            { label: "완료", value: "4건" },
          ]}
          linkLabel="심사참여"
          linkHref="/b/bid-review/"
        />
      </div>

      {/* ── Row 2: 캘린더(2/3) + 공지사항(1/3) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* 입찰 일정 캘린더 */}
        <div
          role="region"
          aria-label="입찰 일정 캘린더"
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ height: 5, background: "#01ACC8" }} />
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 17, fontWeight: 700, color: "#222" }}>
              입찰 일정 캘린더
            </span>
            <span style={{ fontSize: 16, color: "#888" }}>2026년 04월</span>
          </div>
          <div style={{ padding: "16px 20px 20px" }}>
            <MiniCalendar />
          </div>
        </div>

        {/* 최근 공지사항 */}
        <div
          role="region"
          aria-label="최근 공지사항"
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ height: 5, background: "#01ACC8" }} />
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span style={{ fontSize: 17, fontWeight: 700, color: "#222" }}>최근 공지사항</span>
          </div>
          <div style={{ flex: 1, padding: "8px 0" }}>
            {MOCK_NOTICES.slice(0, 3).map((n, idx) => (
              <div
                key={n.id}
                style={{
                  padding: "10px 20px",
                  borderBottom: idx < 2 ? "1px solid #f5f5f5" : "none",
                  cursor: "pointer",
                }}
                onClick={() => setDrawerOpen(true)}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background = "#f0f8fb")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.background = "transparent")
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "1px 6px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 700,
                      background: n.isPinned ? "#FEE2E2" : "#EEF2FF",
                      color: n.isPinned ? "#991B1B" : "#3730A3",
                    }}
                  >
                    {n.isPinned ? "긴급" : "일반"}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      color: "#333",
                      fontWeight: n.isPinned ? 600 : 400,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {n.title}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "#aaa" }}>{n.createdAt}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 20px", borderTop: "1px solid #f0f0f0" }}>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                background: "transparent",
                border: "none",
                color: "#01ACC8",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
                fontFamily: "inherit",
              }}
            >
              공지 전체보기 →
            </button>
          </div>
        </div>
      </div>

      {/* ── 입찰 목록 탭 (진행현황 / 견적요청 / 발주요청 / 입찰현황) ── */}
      <div
        role="region"
        aria-label="입찰 목록"
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <div style={{ height: 5, background: "#01ACC8" }} />
        <div style={{ padding: "14px 20px 0" }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#222" }}>입찰 목록</span>
        </div>
        <div style={{ padding: "0 20px 20px" }}>
          <Tabs
            tabs={[
              { id: "bid", label: "입찰 진행현황", count: B_BID_PROGRESS.length },
              { id: "quote", label: "견적요청", count: B_DASHBOARD_QUOTES.length },
              { id: "order", label: "발주요청", count: B_DASHBOARD_ORDERS.length },
              { id: "bidsummary", label: "입찰 현황", count: B_DASHBOARD_BIDS.length },
            ]}
          >
            {(activeTab) => (
              <div>
                {activeTab === "bid" && (
                  <DataTable columns={bidProgressColumns} data={B_BID_PROGRESS as unknown as Record<string, unknown>[]} showCheckbox={false} showExcel={false} sectionLabel="입찰 진행현황" onRowClick={(row) => { const r = row as unknown as BidProgress; console.log("입찰:", r.id); }} />
                )}
                {activeTab === "quote" && (
                  <DataTable columns={quoteColumns} data={B_DASHBOARD_QUOTES as unknown as Record<string, unknown>[]} showCheckbox={false} showExcel={false} sectionLabel="견적요청" onRowClick={(row) => console.log("견적:", row.id)} />
                )}
                {activeTab === "order" && (
                  <DataTable columns={orderColumns} data={B_DASHBOARD_ORDERS as unknown as Record<string, unknown>[]} showCheckbox={false} showExcel={false} sectionLabel="발주요청" onRowClick={(row) => console.log("발주:", row.id)} />
                )}
                {activeTab === "bidsummary" && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, paddingTop: 4 }}>
                    {B_DASHBOARD_BIDS.map((bid) => (
                      <div key={bid.id} style={{ background: "#f9f9f9", borderRadius: 6, padding: "14px 16px", borderLeft: "3px solid #01ACC8" }}>
                        <p style={{ margin: "0 0 6px", fontSize: 15, color: "#888", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{bid.id}</p>
                        <p style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "#333", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{bid.title}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <StatusBadge status={bid.status} />
                          <span style={{ fontSize: 14, color: "#aaa" }}>~{bid.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Tabs>
        </div>
      </div>

      {/* ── 공지사항 Drawer ── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="공지사항"
        width={600}
      >
        <NoticeDrawerContent notices={MOCK_NOTICES} />
      </Drawer>
    </div>
  );
}
