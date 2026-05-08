import type { Order } from "../types";

export const MOCK_ORDERS: Order[] = [
  { id: "ORD-2026-019", title: "전력 계측 장비 발주", method: "NEGOTIATION", amount: 120000000, status: "DRAFT", requestedAt: "2026-02-01", assignee: "계약1팀", category: "물품구매", checklistStatus: "작성중", progressStatus: "계획", contractNo: "ORD-2026-019", contractName: "전력 계측 장비 발주" },
  { id: "ORD-2026-018", title: "변압기 교체 발주", method: "LOWEST_PRICE", amount: 280000000, status: "RECEIVED", requestedAt: "2026-02-01", assignee: "계약2팀", category: "용역", checklistStatus: "작성중", progressStatus: "입찰공고", contractNo: "ORD-2026-018", contractName: "변압기 교체 발주" },
  { id: "ORD-2026-017", title: "전력 계측 장비 발주", method: "NEGOTIATION", amount: 120000000, status: "DRAFT", requestedAt: "2026-02-01", assignee: "계약1팀", category: "물품구매", checklistStatus: "작성중", progressStatus: "계획", contractNo: "ORD-2026-017", contractName: "전력 계측 장비 발주" },
  { id: "ORD-2026-016", title: "변압기 교체 발주", method: "LOWEST_PRICE", amount: 280000000, status: "RECEIVED", requestedAt: "2026-02-01", assignee: "계약2팀", category: "용역", checklistStatus: "작성중", progressStatus: "입찰공고", contractNo: "ORD-2026-016", contractName: "변압기 교체 발주" },
  { id: "ORD-2026-015", title: "배전반 유지보수 발주", method: "LIMITED", amount: 95000000, status: "BID_OPEN", requestedAt: "2026-02-01", assignee: "계약1팀", category: "공사", checklistStatus: "완료", progressStatus: "업체평가", contractNo: "ORD-2026-015", contractName: "배전반 유지보수 발주" },
  { id: "ORD-2026-014", title: "UPS 시스템 구축 발주", method: "TWO_STAGE", amount: 450000000, status: "OPENED", requestedAt: "2026-02-01", assignee: "계약3팀", category: "공사", checklistStatus: "완료", progressStatus: "업체평가", contractNo: "ORD-2026-014", contractName: "UPS 시스템 구축 발주" },
  { id: "ORD-2026-013", title: "전력 계측 장비 발주", method: "NEGOTIATION", amount: 120000000, status: "DRAFT", requestedAt: "2026-02-01", assignee: "계약1팀", category: "물품구매", checklistStatus: "작성중", progressStatus: "계획", contractNo: "ORD-2026-013", contractName: "전력 계측 장비 발주" },
  { id: "ORD-2026-012", title: "사무용 PC 구매 발주", method: "QUALIFIED", amount: 78000000, status: "OPENED", requestedAt: "2026-02-01", assignee: "계약2팀", category: "물품구매", checklistStatus: "완료", progressStatus: "개찰", contractNo: "ORD-2026-012", contractName: "사무용 PC 구매 발주" },
  { id: "ORD-2026-011", title: "변압기 교체 발주", method: "LOWEST_PRICE", amount: 280000000, status: "RECEIVED", requestedAt: "2026-02-01", assignee: "계약2팀", category: "용역", checklistStatus: "작성중", progressStatus: "입찰공고", contractNo: "ORD-2026-011", contractName: "변압기 교체 발주" },
  { id: "ORD-2026-010", title: "배전반 유지보수 발주", method: "LIMITED", amount: 95000000, status: "BID_OPEN", requestedAt: "2026-02-01", assignee: "계약1팀", category: "공사", checklistStatus: "완료", progressStatus: "업체평가", contractNo: "ORD-2026-010", contractName: "배전반 유지보수 발주" },
  { id: "ORD-2026-009", title: "배전반 유지보수 발주", method: "LIMITED", amount: 95000000, status: "BID_OPEN", requestedAt: "2026-02-01", assignee: "계약1팀", category: "공사", checklistStatus: "완료", progressStatus: "업체평가", contractNo: "ORD-2026-009", contractName: "전력 계측 장비 발주" },
  { id: "ORD-2026-008", title: "통신장비 교체", method: "QUALIFIED", amount: 65000000, status: "OPENED", requestedAt: "2026-01-15", assignee: "계약2팀", category: "물품구매", checklistStatus: "완료", progressStatus: "개찰", contractNo: "ORD-2026-008", contractName: "통신장비 교체" },
  { id: "ORD-2026-007", title: "냉각시스템 유지보수", method: "LOWEST_PRICE", amount: 48000000, status: "OPENED", requestedAt: "2026-01-15", assignee: "계약1팀", category: "용역", checklistStatus: "완료", progressStatus: "업체평가", contractNo: "ORD-2026-007", contractName: "냉각시스템 유지보수" },
  { id: "ORD-2026-006", title: "발전기 정비", method: "NEGOTIATION", amount: 32000000, status: "OPENED", requestedAt: "2026-01-15", assignee: "계약3팀", category: "용역", checklistStatus: "완료", progressStatus: "개찰", contractNo: "ORD-2026-006", contractName: "발전기 정비" },
  { id: "ORD-2026-005", title: "수변전 설비 교체", method: "TWO_STAGE", amount: 620000000, status: "BID_OPEN", requestedAt: "2026-01-10", assignee: "계약3팀", category: "공사", checklistStatus: "완료", progressStatus: "입찰공고", contractNo: "ORD-2026-005", contractName: "수변전 설비 교체" },
  { id: "ORD-2026-004", title: "조명설비 교체", method: "NEGOTIATION", amount: 28000000, status: "DRAFT", requestedAt: "2026-01-10", assignee: "계약1팀", category: "물품구매", checklistStatus: "완료", progressStatus: "계획", contractNo: "ORD-2026-004", contractName: "조명설비 교체" },
  { id: "ORD-2026-003", title: "UPS 시스템 구축 발주", method: "TWO_STAGE", amount: 450000000, status: "OPENED", requestedAt: "2026-01-05", assignee: "계약3팀", category: "공사", checklistStatus: "완료", progressStatus: "개찰", contractNo: "ORD-2026-003", contractName: "UPS 시스템 구축 발주" },
  { id: "ORD-2026-002", title: "전력 계측 장비 발주", method: "NEGOTIATION", amount: 120000000, status: "OPENED", requestedAt: "2026-01-05", assignee: "계약1팀", category: "물품구매", checklistStatus: "완료", progressStatus: "업체평가", contractNo: "ORD-2026-002", contractName: "전력 계측 장비 발주" },
  { id: "ORD-2026-001", title: "변압기 교체 발주", method: "LOWEST_PRICE", amount: 280000000, status: "OPENED", requestedAt: "2026-01-05", assignee: "계약2팀", category: "용역", checklistStatus: "완료", progressStatus: "업체평가", contractNo: "ORD-2026-001", contractName: "변압기 교체 발주" },
];

export const METHOD_LABELS: Record<string, string> = {
  NEGOTIATION: "수의계약",
  LOWEST_PRICE: "최저가",
  LIMITED: "제한경쟁",
  TWO_STAGE: "2단계경쟁",
  QUALIFIED: "적격심사",
};

export const PMS_SYNC_INFO = {
  status: "정상",
  lastSync: "2026-04-29 09:00",
  pendingCount: 2,
};
