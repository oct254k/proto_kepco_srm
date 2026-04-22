import type { Quote, Order, Bid } from "../types";

export const B_DASHBOARD_QUOTES: Quote[] = [
  { id: "QR-2026-015", title: "태양광 인버터 견적 요청", vendorName: "-", amount: 0, status: "SUBMITTED", requestedAt: "2026-04-22", deadline: "2026-04-30" },
  { id: "QR-2026-014", title: "서버실 UPS 교체 견적", vendorName: "-", amount: 0, status: "IN_PROGRESS", requestedAt: "2026-04-20", deadline: "2026-04-28" },
  { id: "QR-2026-013", title: "네트워크 장비 구매 견적", vendorName: "(주)IT솔루션", amount: 45000000, status: "ACTIVE", requestedAt: "2026-04-18", deadline: "2026-04-25" },
];

export const B_DASHBOARD_ORDERS: Order[] = [
  { id: "ORD-2026-010", title: "전력 계측 장비 발주", method: "NEGOTIATION", amount: 120000000, status: "SUBMITTED", requestedAt: "2026-04-22", assignee: "계약1팀" },
  { id: "ORD-2026-009", title: "변압기 교체 발주", method: "LOWEST_PRICE", amount: 280000000, status: "IN_PROGRESS", requestedAt: "2026-04-19", assignee: "계약2팀" },
];

export const B_DASHBOARD_BIDS: Bid[] = [
  { id: "BID-2026-005", title: "송전선로 유지보수 외주", method: "LIMITED", estAmount: 450000000, status: "ACTIVE", publishedAt: "2026-04-20", deadline: "2026-04-30" },
  { id: "BID-2026-004", title: "변전소 설비 점검", method: "NEGOTIATION", estAmount: 85000000, status: "CLOSED", publishedAt: "2026-04-10", deadline: "2026-04-20" },
];

export const B_SUMMARY = {
  pendingQuotes: 3,
  pendingOrders: 2,
  activeBids: 1,
  completedContracts: 8,
};

// 캘린더 이벤트 (입찰 일정 마커)
export interface CalendarEvent {
  date: number; // 일(day)
  type: "notice" | "deadline" | "open"; // 공고일 / 투찰마감 / 개찰예정
  label: string;
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { date: 15, type: "notice", label: "BID-2026-005 공고일" },
  { date: 23, type: "deadline", label: "BID-2026-004 투찰마감" },
  { date: 28, type: "open", label: "BID-2026-003 개찰예정" },
];

// 나의 입찰 진행현황
export interface BidProgress {
  id: string;
  title: string;
  status: string;
  orderId: string;
  deadline: string;
}

export const B_BID_PROGRESS: BidProgress[] = [
  { id: "BID-2026-005", title: "태양광 설비 물품 구매", status: "공고중", orderId: "ORD-2026-005", deadline: "05-01" },
  { id: "BID-2026-003", title: "전기설비 유지보수 용역", status: "투찰중", orderId: "ORD-2026-003", deadline: "04-25" },
  { id: "BID-2026-001", title: "옥외 조명 교체 공사", status: "낙찰확정", orderId: "ORD-2026-001", deadline: "완료" },
];
