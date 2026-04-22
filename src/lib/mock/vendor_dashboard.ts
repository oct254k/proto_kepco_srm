import type { Quote, Bid, Contract } from "../types";

export const V_PENDING_QUOTES: Quote[] = [
  { id: "QR-2026-015", title: "태양광 인버터 견적 요청", vendorName: "(주)한국전기솔루션", amount: 0, status: "SUBMITTED", requestedAt: "2026-04-22", deadline: "2026-04-30" },
  { id: "QR-2026-014", title: "서버실 UPS 교체 견적", vendorName: "(주)한국전기솔루션", amount: 0, status: "IN_PROGRESS", requestedAt: "2026-04-20", deadline: "2026-04-28" },
];

export const V_ACTIVE_BIDS: Bid[] = [
  { id: "BID-2026-005", title: "송전선로 유지보수 외주", method: "LIMITED", estAmount: 450000000, status: "ACTIVE", publishedAt: "2026-04-20", deadline: "2026-04-30" },
  { id: "BID-2026-003", title: "변전소 설비 점검", method: "TWO_STAGE", estAmount: 180000000, status: "ACTIVE", publishedAt: "2026-04-15", deadline: "2026-04-25" },
];

export const V_CONTRACTS: Contract[] = [
  { id: "CTR-2026-001", title: "전력 계측 장비 납품", vendorName: "(주)한국전기솔루션", amount: 95000000, startDate: "2026-03-01", endDate: "2026-08-31", status: "ACTIVE" },
  { id: "CTR-2025-042", title: "변압기 유지보수 계약", vendorName: "(주)한국전기솔루션", amount: 42000000, startDate: "2025-10-01", endDate: "2026-03-31", status: "CLOSED" },
];

export const V_SUMMARY = {
  pendingQuotes: 2,
  activeBids: 2,
  activeContracts: 1,
  pendingBonds: 1,
};

// 진행 중인 입찰 건 (캘린더 + 테이블용)
export interface ActiveBidItem {
  id: string;
  title: string;
  stage: string;
  stageColor: string;
  deadline: string;
  dday: string;
  ddayColor: string;
  calendarDate?: number; // 4월 기준 일자
  calendarType?: "심사" | "투찰";
}

export const V_ACTIVE_BID_ITEMS: ActiveBidItem[] = [
  {
    id: "BID-2026-005",
    title: "태양광 설비 물품 구매",
    stage: "투찰중",
    stageColor: "#EF4444",
    deadline: "2026-04-23",
    dday: "D-1",
    ddayColor: "#EF4444",
    calendarDate: 23,
    calendarType: "투찰",
  },
  {
    id: "BID-2026-004",
    title: "전기설비 유지보수 용역",
    stage: "신청완료",
    stageColor: "#3B82F6",
    deadline: "2026-05-10",
    dday: "D-18",
    ddayColor: "#6B7280",
    calendarDate: 19,
    calendarType: "심사",
  },
  {
    id: "BID-2026-003",
    title: "옥외 조명 교체 공사",
    stage: "낙찰확정",
    stageColor: "#10B981",
    deadline: "완료",
    dday: "—",
    ddayColor: "#9CA3AF",
  },
];
