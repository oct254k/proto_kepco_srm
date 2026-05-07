import type { Contract } from "../types";

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: "CTR-2026-005",
    title: "변압기 점검 계약",
    vendorName: "(주)한국전기솔루션",
    amount: 128000000,
    startDate: "2026-04-01",
    endDate: "2026-08-31",
    status: "ACTIVE",
    contractStatus: "ACTIVE",
    bondStatus: "REJECTED",
    pmsStatus: "PMS_FAILED",
    pmsSyncStatus: "PMS_FAILED",
    businessApprovalStatus: "APPROVED",
    canAmend: true,
    canCancel: false,
  },
  {
    id: "CTR-2026-004",
    title: "태양광 인버터 납품 계약",
    vendorName: "(주)한국전기솔루션",
    amount: 440000000,
    startDate: "2026-05-01",
    endDate: "2026-10-31",
    status: "PENDING_SUPPLIER_APPROVAL",
    contractStatus: "PENDING_SUPPLIER_APPROVAL",
    bondStatus: "NOT_SUBMITTED",
    pmsStatus: "PMS_PENDING",
    pmsSyncStatus: "PMS_PENDING",
    businessApprovalStatus: "PENDING",
    canAmend: false,
    canCancel: false,
  },
  {
    id: "CTR-2026-003",
    title: "변압기 교체 공사 계약",
    vendorName: "(주)전기공사",
    amount: 310000000,
    startDate: "2026-04-15",
    endDate: "2026-07-14",
    status: "PENDING_BUSINESS_APPROVAL",
    contractStatus: "PENDING_BUSINESS_APPROVAL",
    bondStatus: "SUBMITTED",
    pmsStatus: "PMS_PENDING",
    pmsSyncStatus: "PMS_PENDING",
    businessApprovalStatus: "PENDING",
    canAmend: false,
    canCancel: false,
  },
  {
    id: "CTR-2026-002",
    title: "전력 계측 장비 납품",
    vendorName: "(주)IT솔루션",
    amount: 95000000,
    startDate: "2026-03-01",
    endDate: "2026-08-31",
    status: "ACTIVE",
    contractStatus: "ACTIVE",
    bondStatus: "APPROVED",
    pmsStatus: "PMS_FAILED",
    pmsSyncStatus: "PMS_FAILED",
    businessApprovalStatus: "APPROVED",
    canAmend: true,
    canCancel: false,
  },
  {
    id: "CTR-2026-001",
    title: "배전반 유지보수 계약",
    vendorName: "(주)전기시스템",
    amount: 42000000,
    startDate: "2025-10-01",
    endDate: "2026-03-31",
    status: "PMS_SYNCED",
    contractStatus: "ACTIVE",
    bondStatus: "APPROVED",
    pmsStatus: "PMS_SYNCED",
    pmsSyncStatus: "PMS_SYNCED",
    businessApprovalStatus: "APPROVED",
    canAmend: true,
    canCancel: false,
  },
  {
    id: "CTR-2025-038",
    title: "사무용 PC 납품 계약",
    vendorName: "(주)IT파트너스",
    amount: 76000000,
    startDate: "2025-09-01",
    endDate: "2025-11-30",
    status: "TERMINATED",
    contractStatus: "TERMINATED",
    bondStatus: "APPROVED",
    pmsStatus: "PMS_SYNCED",
    pmsSyncStatus: "PMS_SYNCED",
    businessApprovalStatus: "APPROVED",
    canAmend: false,
    canTerminate: false,
    canCancel: false,
  },
];

export interface Bond {
  id: string;
  contractId: string;
  type: string;
  amount: number;
  issuer: string;
  startDate: string;
  endDate: string;
  status: string;
}

export const MOCK_BONDS: Bond[] = [
  { id: "BND-2026-005", contractId: "CTR-2026-005", type: "이행보증", amount: 12800000, issuer: "서울보증보험", startDate: "2026-04-01", endDate: "2026-06-30", status: "REJECTED" },
  { id: "BND-2026-004", contractId: "CTR-2026-004", type: "이행보증", amount: 44000000, issuer: "서울보증보험", startDate: "2026-05-01", endDate: "2026-10-31", status: "NOT_SUBMITTED" },
  { id: "BND-2026-003", contractId: "CTR-2026-003", type: "이행보증", amount: 31000000, issuer: "서울보증보험", startDate: "2026-04-15", endDate: "2026-07-14", status: "SUBMITTED" },
  { id: "BND-2026-002", contractId: "CTR-2026-002", type: "하자보증", amount: 9500000, issuer: "SGI서울보증", startDate: "2026-03-01", endDate: "2026-08-31", status: "REJECTED" },
  { id: "BND-2026-001", contractId: "CTR-2026-001", type: "하자보증", amount: 4200000, issuer: "SGI서울보증", startDate: "2025-10-01", endDate: "2026-03-31", status: "APPROVED" },
];

export interface DocRequest {
  id: string;
  contractId: string;
  docName: string;
  dueDate: string;
  status: string;
}

export const MOCK_DOC_REQUESTS: DocRequest[] = [
  { id: "DR-2026-007", contractId: "CTR-2026-005", docName: "반려 보증서 재제출본", dueDate: "2026-04-12", status: "PENDING" },
  { id: "DR-2026-006", contractId: "CTR-2026-004", docName: "이행보증서 원본", dueDate: "2026-05-08", status: "PENDING" },
  { id: "DR-2026-005", contractId: "CTR-2026-003", docName: "사업담당 승인 의견서", dueDate: "2026-04-22", status: "SUBMITTED" },
  { id: "DR-2026-004", contractId: "CTR-2026-002", docName: "보증서 재제출본", dueDate: "2026-03-10", status: "PENDING" },
  { id: "DR-2026-003", contractId: "CTR-2026-001", docName: "계약 변경합의서", dueDate: "2026-03-20", status: "SUBMITTED" },
];

// V역할 입찰·투찰 이력
export const V_BID_HISTORY = [
  { id: "BID-2026-005", title: "태양광 인버터 구매 입찰", method: "LIMITED", participatedAt: "2026-04-21", status: "DISQUALIFIED", myAmount: 0 },
  { id: "BID-2026-003", title: "배전반 유지보수 입찰", method: "LOWEST_PRICE", participatedAt: "2026-04-16", status: "SUBMITTED", myAmount: 93000000 },
  { id: "BID-2026-001", title: "사무용 PC 납품", method: "QUALIFIED", participatedAt: "2026-03-15", status: "AWARDED", myAmount: 76000000 },
  { id: "BID-2025-048", title: "변압기 유지보수", method: "NEGOTIATION", participatedAt: "2025-11-20", status: "FAILED_BID", myAmount: 42000000 },
];

// 변경 이력 (SCR-S-11 탭 5)
export const MOCK_CONTRACT_HISTORIES = [
  {
    id: "HIS-005",
    contractId: "CTR-2026-005",
    changedAt: "2026-04-05 15:20:00",
    item: "보증서 상태",
    before: "제출완료",
    after: "보증반려",
    reason: "만료일이 계약 종료일보다 짧아 재제출 요청",
    changedBy: "이계약 (계약1팀)",
  },
  {
    id: "HIS-004",
    contractId: "CTR-2026-002",
    changedAt: "2026-03-04 10:10:00",
    item: "보증서 상태",
    before: "보증검토중",
    after: "보증반려",
    reason: "보증기간 부족으로 재제출 요청",
    changedBy: "이계약 (계약1팀)",
  },
  {
    id: "HIS-003",
    contractId: "CTR-2026-001",
    changedAt: "2026-05-02 09:15:00",
    item: "계약금액",
    before: "420,000,000원",
    after: "440,000,000원",
    reason: "원자재 단가 인상 반영",
    changedBy: "이계약 (계약1팀)",
  },
  {
    id: "HIS-002",
    contractId: "CTR-2026-001",
    changedAt: "2026-05-01 14:30:00",
    item: "납기일",
    before: "2026-09-30",
    after: "2026-10-31",
    reason: "공급업체 요청에 의한 납기 연장",
    changedBy: "이계약 (계약1팀)",
  },
  {
    id: "HIS-001",
    contractId: "CTR-2026-003",
    changedAt: "2026-04-16 11:20:00",
    item: "특약사항",
    before: "없음",
    after: "품질보증기간 2년",
    reason: "발주처 요구사항 추가",
    changedBy: "이계약 (계약1팀)",
  },
];

// PMS 전송 이력 (SCR-S-11 탭 4)
export const MOCK_PMS_LOGS: Record<string, Array<{ requestedAt: string; status: string; responseCode: string; note: string }>> = {
  "CTR-2026-005": [{ requestedAt: "2026-04-06 10:00:00", status: "PMS_FAILED", responseCode: "422", note: "보증 반려 상태로 전송 보류" }],
  "CTR-2026-004": [{ requestedAt: "2026-05-01 14:30:12", status: "PMS_PENDING", responseCode: "-", note: "협력업체 확인 완료 대기" }],
  "CTR-2026-003": [{ requestedAt: "2026-04-15 10:05:33", status: "PMS_PENDING", responseCode: "-", note: "사업담당 승인 완료 후 전송 예정" }],
  "CTR-2026-002": [{ requestedAt: "2026-03-01 09:00:00", status: "PMS_FAILED", responseCode: "500", note: "PMS 내부 오류" }],
  "CTR-2026-001": [
    { requestedAt: "2026-05-01 14:32:05", status: "PMS_SYNCED", responseCode: "200", note: "정상 처리" },
    { requestedAt: "2026-05-01 14:30:12", status: "PMS_FAILED", responseCode: "503", note: "PMS 서비스 일시 중단" },
  ],
};

// 입찰 선정방법 레이블
export const BID_METHOD_LABELS: Record<string, string> = {
  LIMITED: "제한경쟁",
  LOWEST_PRICE: "최저가",
  QUALIFIED: "적격심사",
  NEGOTIATION: "수의계약",
};

// 입찰 상태 레이블
export const BID_STATUS_LABELS: Record<string, string> = {
  IN_PROGRESS: "진행중",
  SUBMITTED: "투찰완료",
  AWARDED: "낙찰",
  CLOSED: "마감",
};
