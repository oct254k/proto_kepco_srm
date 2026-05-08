"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";
import Drawer from "@/components/Drawer";
import { useToast } from "@/components/Toast";
import { MOCK_NOTICES } from "@/lib/mock/common";
import {
  C_SUMMARY,
  C_PENDING_QUOTES,
  C_ACTIVE_BIDS,
  C_PENDING_AWARDS,
  C_CONTRACTS,
  C_MY_BIDS,
  C_CALENDAR_EVENTS,
} from "@/lib/mock/contract_dashboard";
import type { CalendarEvent } from "@/lib/mock/contract_dashboard";

// ── 요약 카드 ───────────────────────────────────────────────
interface SummaryCardProps {
  label: string;
  count: number;
  unit?: string;
  accent?: "red" | "orange" | "yellow" | "blue" | "green";
  onClick?: () => void;
  linkLabel?: string;
}

function SummaryCard({ label, count, unit = "건", accent, onClick, linkLabel = "바로가기 →" }: SummaryCardProps) {
  const accentStyle: Record<string, { bg: string; color: string; border: string }> = {
    red: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
    orange: { bg: "#FFF7ED", color: "#EA580C", border: "#FED7AA" },
    yellow: { bg: "#FEFCE8", color: "#D97706", border: "#FDE68A" },
    blue: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
    green: { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
  };
  const style = accent ? accentStyle[accent] : { bg: "#F9FAFB", color: "#374151", border: "#E5E7EB" };

  return (
    <div
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 8,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.15s",
        minWidth: 0,
      }}
      onClick={onClick}
      onMouseEnter={(e) => { if (onClick) (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.10)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
    >
      <div style={{ fontSize: 16, color: "#6B7280", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 31, fontWeight: 700, color: style.color }}>
        {count.toLocaleString()}
        <span style={{ fontSize: 17, fontWeight: 500, marginLeft: 4 }}>{unit}</span>
      </div>
      {onClick && (
        <div style={{ fontSize: 15, color: style.color, textDecoration: "underline", marginTop: 4 }}>
          {linkLabel}
        </div>
      )}
    </div>
  );
}

// ── 미니 캘린더 ─────────────────────────────────────────────
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const YEAR = 2026;
const MONTH = 3; // 0-indexed April

function MiniCalendar({ events = [] }: { events?: CalendarEvent[] }) {
  const today = 22; // 2026-04-22
  const firstDay = new Date(YEAR, MONTH, 1).getDay();
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();

  const eventMap: Record<number, CalendarEvent[]> = {};
  (events ?? []).forEach((ev) => {
    if (!eventMap[ev.date]) eventMap[ev.date] = [];
    eventMap[ev.date].push(ev);
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const typeIcon: Record<string, string> = {
    notice: "●",
    deadline: "▲",
    open: "★",
  };
  const typeColor: Record<string, string> = {
    notice: "#2563EB",
    deadline: "#DC2626",
    open: "#D97706",
  };

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div>
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: 17, marginBottom: 10, color: "#222" }}>
        2026년 04월
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
        <thead>
          <tr>
            {DAYS.map((d, i) => (
              <th
                key={d}
                style={{
                  padding: "4px 2px",
                  textAlign: "center",
                  color: i === 0 ? "#DC2626" : i === 6 ? "#2563EB" : "#6B7280",
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
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                const evList = day ? (eventMap[day] ?? []) : [];
                const isToday = day === today;
                return (
                  <td
                    key={di}
                    style={{
                      padding: "4px 2px",
                      textAlign: "center",
                      verticalAlign: "top",
                      minWidth: 28,
                    }}
                  >
                    {day && (
                      <>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: isToday ? "#00a7ea" : "transparent",
                            color: isToday ? "#fff" : di === 0 ? "#DC2626" : di === 6 ? "#2563EB" : "#333",
                            fontWeight: isToday ? 700 : 400,
                            fontSize: 15,
                          }}
                        >
                          {day}
                        </div>
                        {evList.map((ev, ei) => (
                          <div
                            key={ei}
                            title={ev.label}
                            style={{ fontSize: 12, color: typeColor[ev.type], lineHeight: 1.2 }}
                          >
                            {typeIcon[ev.type]}
                          </div>
                        ))}
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {/* 범례 */}
      <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 14, color: "#555", justifyContent: "center" }}>
        {[
          { icon: "●", label: "공고등록", color: "#2563EB" },
          { icon: "▲", label: "투찰마감", color: "#DC2626" },
          { icon: "★", label: "개찰예정", color: "#D97706" },
        ].map((item) => (
          <span key={item.label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ color: item.color }}>{item.icon}</span>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── 위젯 컨테이너 ───────────────────────────────────────────
function Widget({ title, children, style }: { title: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "#FAF7F2",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        padding: "20px",
        ...style,
      }}
    >
      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: "#222",
          marginBottom: 16,
          paddingBottom: 10,
          borderBottom: "1px solid #F3F4F6",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ width: 3, height: 14, background: "#654024", borderRadius: 2, display: "inline-block" }} />
        {title}
      </div>
      {children}
    </div>
  );
}

// ── 메인 페이지 ─────────────────────────────────────────────
export default function ContractDashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const [noticeDrawerOpen, setNoticeDrawerOpen] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);

  // 4초 후 toast (문서 섹션 7 요구사항)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (C_SUMMARY.pendingQuotes > 0) {
        toast.show(`발주요청 접수 대기 ${C_SUMMARY.pendingQuotes}건이 있습니다.`, "info");
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const selectedNotice = MOCK_NOTICES.find((n) => n.id === selectedNoticeId);

  // ── 견적요청 대기 목록 컬럼
  const quoteColumns: Column[] = [
    { key: "id", label: "견적ID", width: "130px", align: "center" },
    { key: "title", label: "견적 제목", align: "left" },
    { key: "requestedAt", label: "요청일", width: "100px", align: "center" },
    { key: "deadline", label: "마감일", width: "100px", align: "center" },
    {
      key: "status",
      label: "상태",
      width: "100px",
      align: "center",
      render: (val) => <StatusBadge status={String(val)} />,
    },
  ];

  // ── 입찰 현황 컬럼
  const bidColumns: Column[] = [
    { key: "id", label: "공고ID", width: "130px", align: "center" },
    { key: "title", label: "공고명", align: "left" },
    { key: "method", label: "입찰방법", width: "100px", align: "center" },
    {
      key: "estAmount",
      label: "예정금액",
      width: "130px",
      align: "right",
      render: (val) => `${Number(val).toLocaleString()}원`,
    },
    { key: "publishedAt", label: "공고일", width: "100px", align: "center" },
    { key: "deadline", label: "마감일", width: "100px", align: "center" },
    {
      key: "status",
      label: "상태",
      width: "100px",
      align: "center",
      render: (val) => <StatusBadge status={String(val)} />,
    },
  ];

  // ── 낙찰 확정 대기 컬럼
  const awardColumns: Column[] = [
    { key: "id", label: "낙찰ID", width: "130px", align: "center" },
    { key: "title", label: "공고명", align: "left" },
    { key: "vendorName", label: "낙찰업체", width: "160px", align: "center" },
    {
      key: "awardedAmount",
      label: "낙찰금액",
      width: "130px",
      align: "right",
      render: (val) => `${Number(val).toLocaleString()}원`,
    },
    {
      key: "status",
      label: "상태",
      width: "100px",
      align: "center",
      render: (val) => <StatusBadge status={String(val)} />,
    },
  ];

  // ── 계약 목록 컬럼
  const contractColumns: Column[] = [
    { key: "id", label: "계약ID", width: "130px", align: "center" },
    { key: "title", label: "계약명", align: "left" },
    { key: "vendorName", label: "업체명", width: "160px", align: "center" },
    {
      key: "amount",
      label: "계약금액",
      width: "130px",
      align: "right",
      render: (val) => `${Number(val).toLocaleString()}원`,
    },
    { key: "startDate", label: "계약시작일", width: "100px", align: "center" },
    { key: "endDate", label: "계약종료일", width: "100px", align: "center" },
    {
      key: "status",
      label: "계약상태",
      width: "100px",
      align: "center",
      render: (val) => <StatusBadge status={String(val)} />,
    },
    {
      key: "pmsStatus",
      label: "PMS연동",
      width: "100px",
      align: "center",
      render: (val) => <StatusBadge status={String(val ?? "-")} />,
    },
  ];

  // ── 담당 입찰 목록 컬럼
  const myBidColumns: Column[] = [
    { key: "id", label: "공고ID", width: "130px", align: "center" },
    { key: "title", label: "공고명", align: "left" },
    {
      key: "statusLabel",
      label: "상태",
      width: "100px",
      align: "center",
      render: (val, row) => {
        const isUrgent = Boolean(row.urgent);
        return (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <StatusBadge status={String(row.status)} />
            {isUrgent && (
              <span
                style={{
                  background: "#FEE2E2",
                  color: "#DC2626",
                  borderRadius: 4,
                  padding: "1px 5px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                마감임박
              </span>
            )}
          </span>
        );
      },
    },
    {
      key: "deadline",
      label: "마감일",
      width: "100px",
      align: "center",
      render: (val, row) => {
        const isUrgent = Boolean(row.urgent);
        return (
          <span style={{ color: isUrgent ? "#DC2626" : "inherit", fontWeight: isUrgent ? 600 : 400 }}>
            {String(val)}
          </span>
        );
      },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── 페이지 헤더 */}
      <PageHeader
        title="계약담당자 대시보드"
        actions={
          <div style={{ fontSize: 16, color: "#6B7280" }}>
            안녕하세요, 이계약 님 (계약담당자) &nbsp;|&nbsp; 2026-04-22(수)
          </div>
        }
      />

      {/* ── Row 1: 요약 카드 5개 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 12,
        }}
      >
        <SummaryCard
          label="견적요청 대기"
          count={C_SUMMARY.pendingQuotes}
          accent="blue"
          onClick={() => router.push("/c/bids/")}
          linkLabel="견적관리 →"
        />
        <SummaryCard
          label="진행 중 입찰"
          count={C_SUMMARY.activeBids}
          accent="green"
          onClick={() => router.push("/c/bids/")}
          linkLabel="입찰관리 →"
        />
        <SummaryCard
          label="낙찰 확정 대기"
          count={C_SUMMARY.pendingAwards}
          accent="orange"
          onClick={() => router.push("/c/awards/")}
          linkLabel="낙찰관리 →"
        />
        <SummaryCard
          label="진행 중 계약"
          count={C_SUMMARY.activeContracts}
          accent="blue"
          onClick={() => router.push("/c/contracts/")}
          linkLabel="계약관리 →"
        />
        <SummaryCard
          label="PMS 연동 대기"
          count={C_SUMMARY.pendingPmsSync}
          accent="yellow"
          onClick={() => router.push("/c/contracts/")}
          linkLabel="계약관리 →"
        />
      </div>

      {/* ── Row 2: 캘린더(2/3) + 공지사항(1/3) */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* 캘린더 위젯 */}
        <Widget title="담당 입찰 일정 (2026년 04월)">
          <MiniCalendar events={C_CALENDAR_EVENTS} />
        </Widget>

        {/* 공지사항 미리보기 */}
        <Widget title="최근 공지사항">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MOCK_NOTICES.slice(0, 3).map((notice) => (
              <div
                key={notice.id}
                style={{
                  padding: "10px 12px",
                  background: "#F9FAFB",
                  borderRadius: 6,
                  border: "1px solid #F3F4F6",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedNoticeId(notice.id);
                  setNoticeDrawerOpen(true);
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#F0F9FF"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#F9FAFB"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  {notice.isPinned && (
                    <span
                      style={{
                        background: "#FEE2E2",
                        color: "#DC2626",
                        borderRadius: 4,
                        padding: "1px 6px",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      긴급
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 16,
                      color: "#222",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {notice.title}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: "#9CA3AF" }}>{notice.createdAt}</div>
              </div>
            ))}
          </div>
          <button
            style={{
              width: "100%",
              marginTop: 12,
              padding: "8px",
              background: "#ffffff",
              border: "1px solid #CFCFCF",
              borderRadius: 6,
              fontSize: 16,
              color: "#654024",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 500,
            }}
            onClick={() => setNoticeDrawerOpen(true)}
          >
            공지 전체보기 →
          </button>
        </Widget>
      </div>

      {/* ── Row 3: 나의 담당 입찰 목록 */}
      <Widget title="나의 담당 입찰 목록 (최근 10건)">
        <DataTable
          columns={myBidColumns}
          data={C_MY_BIDS as unknown as Record<string, unknown>[]}
          sectionLabel="담당 입찰"
          showExcel={false}
          showCheckbox={false}
          actionButton={
            <button
              style={{
                padding: "5px 14px",
                background: "#654024",
                color: "#fff",
                border: "1px solid #DFE8F0",
                borderRadius: 4,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
              }}
              onClick={() => router.push("/c/bids/")}
            >
              전체보기 →
            </button>
          }
        />
      </Widget>

      {/* ── Row 4: 견적요청 대기 + 입찰 현황 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Widget title="견적요청 대기 목록">
          <DataTable
            columns={quoteColumns}
            data={C_PENDING_QUOTES as unknown as Record<string, unknown>[]}
            sectionLabel="견적요청"
            showExcel={false}
            showCheckbox={false}
          />
        </Widget>

        <Widget title="입찰 현황">
          <DataTable
            columns={bidColumns}
            data={C_ACTIVE_BIDS as unknown as Record<string, unknown>[]}
            sectionLabel="입찰"
            showExcel={false}
            showCheckbox={false}
          />
        </Widget>
      </div>

      {/* ── Row 5: 낙찰 확정 대기 + 계약 목록 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Widget title="낙찰 확정 대기">
          <DataTable
            columns={awardColumns}
            data={C_PENDING_AWARDS as unknown as Record<string, unknown>[]}
            sectionLabel="낙찰"
            showExcel={false}
            showCheckbox={false}
            notice="계약 미체결 건을 확인하세요."
          />
        </Widget>

        <Widget title="계약 목록">
          <DataTable
            columns={contractColumns}
            data={C_CONTRACTS as unknown as Record<string, unknown>[]}
            sectionLabel="계약"
            showExcel={false}
            showCheckbox={false}
          />
        </Widget>
      </div>

      {/* ── 공지사항 Drawer */}
      <Drawer
        open={noticeDrawerOpen}
        onClose={() => {
          setNoticeDrawerOpen(false);
          setSelectedNoticeId(null);
        }}
        title="공지사항"
        width={560}
      >
        {selectedNotice ? (
          /* 상세 뷰 */
          <div>
            <button
              style={{
                background: "#ffffff",
                border: "1px solid #CFCFCF",
                cursor: "pointer",
                color: "#654024",
                fontSize: 16,
                padding: "0 0 12px",
                fontFamily: "inherit",
              }}
              onClick={() => setSelectedNoticeId(null)}
            >
              ← 목록으로
            </button>
            <div
              style={{
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                {selectedNotice.isPinned && (
                  <span
                    style={{
                      background: "#FEE2E2",
                      color: "#DC2626",
                      borderRadius: 4,
                      padding: "2px 8px",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    긴급
                  </span>
                )}
                <span style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>{selectedNotice.title}</span>
              </div>
              <div style={{ fontSize: 15, color: "#9CA3AF", marginBottom: 16 }}>
                작성자: {selectedNotice.author} &nbsp;|&nbsp; {selectedNotice.createdAt}
              </div>
              <div
                style={{
                  fontSize: 17,
                  color: "#374151",
                  lineHeight: 1.7,
                  padding: "16px 0",
                  borderTop: "1px solid #E5E7EB",
                }}
              >
                {selectedNotice.content}
              </div>
            </div>
          </div>
        ) : (
          /* 목록 뷰 */
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MOCK_NOTICES.map((notice) => (
              <div
                key={notice.id}
                style={{
                  padding: "14px 16px",
                  background: "#F9FAFB",
                  borderRadius: 8,
                  border: "1px solid #F3F4F6",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onClick={() => setSelectedNoticeId(notice.id)}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#F0F9FF"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#F9FAFB"; }}
                role="button"
                aria-label={notice.title}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  {notice.isPinned && (
                    <span
                      style={{
                        background: "#FEE2E2",
                        color: "#DC2626",
                        borderRadius: 4,
                        padding: "1px 6px",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      긴급
                    </span>
                  )}
                  <span style={{ fontSize: 17, fontWeight: 600, color: "#111" }}>{notice.title}</span>
                </div>
                <div style={{ fontSize: 15, color: "#9CA3AF" }}>
                  {notice.author} · {notice.createdAt}
                </div>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </div>
  );
}
