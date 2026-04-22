import type { Order } from "../types";

export const MOCK_ORDERS: Order[] = [
  { id: "ORD-2026-010", title: "전력 계측 장비 발주", method: "NEGOTIATION", amount: 120000000, status: "SUBMITTED", requestedAt: "2026-04-22", assignee: "계약1팀" },
  { id: "ORD-2026-009", title: "변압기 교체 발주", method: "LOWEST_PRICE", amount: 280000000, status: "IN_PROGRESS", requestedAt: "2026-04-19", assignee: "계약2팀" },
  { id: "ORD-2026-008", title: "배전반 유지보수 발주", method: "LIMITED", amount: 95000000, status: "ACTIVE", requestedAt: "2026-04-15", assignee: "계약1팀" },
  { id: "ORD-2026-007", title: "UPS 시스템 구축 발주", method: "TWO_STAGE", amount: 450000000, status: "CLOSED", requestedAt: "2026-04-01", assignee: "계약3팀" },
  { id: "ORD-2026-006", title: "사무용 PC 구매 발주", method: "QUALIFIED", amount: 78000000, status: "CANCELLED", requestedAt: "2026-03-25", assignee: "계약2팀" },
];

export const METHOD_LABELS: Record<string, string> = {
  NEGOTIATION: "수의계약",
  LOWEST_PRICE: "최저가",
  LIMITED: "제한경쟁",
  TWO_STAGE: "2단계경쟁",
  QUALIFIED: "적격심사",
};

// PMS 동기화 상태
export const PMS_SYNC_INFO = {
  status: "정상",
  lastSync: "2026-04-22 09:00",
  pendingCount: 3,
};
