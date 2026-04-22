// src/lib/mock/contract_dashboard.ts
import type { Quote, Bid, Award, Contract } from "../types";

export const C_PENDING_QUOTES: Quote[] = [
  { id: "QR-2026-015", title: "태양광 인버터 견적 요청", vendorName: "-", amount: 0, status: "SUBMITTED", requestedAt: "2026-04-22", deadline: "2026-04-30" },
  { id: "QR-2026-014", title: "서버실 UPS 교체 견적", vendorName: "-", amount: 0, status: "IN_PROGRESS", requestedAt: "2026-04-20", deadline: "2026-04-28" },
  { id: "QR-2026-013", title: "네트워크 장비 구매 견적", vendorName: "(주)IT솔루션", amount: 45000000, status: "ACTIVE", requestedAt: "2026-04-18", deadline: "2026-04-25" },
];

export const C_ACTIVE_BIDS: Bid[] = [
  { id: "BID-2026-005", title: "송전선로 유지보수 외주", method: "LIMITED", estAmount: 450000000, status: "ACTIVE", publishedAt: "2026-04-20", deadline: "2026-04-30" },
  { id: "BID-2026-004", title: "변압기 교체 공사", method: "TWO_STAGE", estAmount: 320000000, status: "IN_PROGRESS", publishedAt: "2026-04-12", deadline: "2026-04-22" },
];

export const C_PENDING_AWARDS: Award[] = [
  { id: "AWD-2026-003", bidId: "BID-2026-004", title: "변압기 교체 공사", vendorName: "(주)전기공사", awardedAmount: 290000000, status: "PENDING", awardedAt: "-" },
];

export const C_CONTRACTS: Contract[] = [
  { id: "CTR-2026-001", title: "전력 계측 장비 납품", vendorName: "(주)한국전기솔루션", amount: 95000000, startDate: "2026-03-01", endDate: "2026-08-31", status: "ACTIVE", pmsStatus: "SYNCED" },
  { id: "CTR-2026-002", title: "태양광 패널 설치 계약", vendorName: "(주)그린에너지", amount: 540000000, startDate: "2026-04-01", endDate: "2026-12-31", status: "ACTIVE", pmsStatus: "PENDING" },
];

export const C_SUMMARY = {
  pendingQuotes: 3,
  activeBids: 2,
  pendingAwards: 1,
  activeContracts: 2,
  pendingPmsSync: 1,
};

// 나의 담당 입찰 목록 (최근 10건)
export interface BidRecord {
  id: string;
  title: string;
  status: string;
  statusLabel: string;
  deadline: string;
  urgent?: boolean;
}

export const C_MY_BIDS: BidRecord[] = [
  { id: "BID-2026-005", title: "태양광 설비 물품 구매", status: "ACTIVE", statusLabel: "공고중", deadline: "05-01" },
  { id: "BID-2026-004", title: "전기설비 유지보수", status: "IN_PROGRESS", statusLabel: "투찰중", deadline: "04-23", urgent: true },
  { id: "BID-2026-003", title: "옥외 조명 교체 공사", status: "OPENED", statusLabel: "개찰중", deadline: "—" },
  { id: "BID-2026-002", title: "배전반 제작 납품", status: "AWARDED", statusLabel: "낙찰확정", deadline: "완료" },
];

// 캘린더 이벤트
export interface CalendarEvent {
  date: number;
  type: "notice" | "deadline" | "open";
  label: string;
}

export const C_CALENDAR_EVENTS: CalendarEvent[] = [
  { date: 20, type: "notice", label: "BID-2026-005 공고등록" },
  { date: 23, type: "deadline", label: "BID-2026-004 투찰마감" },
  { date: 28, type: "open", label: "BID-2026-003 개찰예정" },
  { date: 30, type: "deadline", label: "BID-2026-005 투찰마감" },
];
