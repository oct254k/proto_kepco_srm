export type Role = "B" | "V" | "C" | "A";
export type ContractAuthority = "CONTRACT_MANAGER" | "PRICE_REVIEWER";

export const ROLE_LABELS: Record<Role, string> = {
  B: "사업담당자",
  V: "협력업체",
  C: "계약담당자",
  A: "관리자",
};

export const CONTRACT_AUTHORITY_LABELS: Record<ContractAuthority, string> = {
  CONTRACT_MANAGER: "계약담당자",
  PRICE_REVIEWER: "가격등록자/임원",
};

// 공통 도메인 타입
export interface Quote {
  id: string; title: string; vendorName: string; amount: number;
  status: string; requestedAt: string; deadline: string;
}

export interface Order {
  id: string; title: string; method: string; amount: number;
  status: string; requestedAt: string; assignee: string;
  pmsProjectId?: string;
  pmsProjectName?: string;
  editableByRequester?: boolean;
  canCancel?: boolean;
}

export interface Bid {
  id: string; title: string; method: string; estAmount: number;
  status: string; publishedAt: string; deadline: string;
  // 설계서 05_ERD — PMS 연계 식별자
  orderRequestId?: string;  // PMS ORDER_REQUEST_ID (PMS → SRM 발주요청)
  pmsCardId?: string;       // PMS PipelineCard.id (연계 추적용)
}

export interface Award {
  id: string; bidId: string; title: string; vendorName: string;
  awardedAmount: number; status: string; awardedAt: string;
}

// 설계서 05_ERD/02 VENDOR_PROPOSALS_JSON shape
// srm-bid-proposals Webhook으로 PMS에 전달되는 업체별 제안 데이터
export interface BidParticipant {
  id: string;
  bidId: string;
  vendorName: string;
  srmPartnerId: string;
  amount: number;
  score: number;
  status: string;
  delivery: number;      // 납기(일)
  creditGrade: string;   // 신용등급 (CREDIT_RATING 테이블 기준)
  debtRatio: string;     // 부채비율
  historyCount: number;  // 유사 프로젝트 수행 실적 건수
}

export interface Contract {
  id: string; title: string; vendorName: string; amount: number;
  startDate: string; endDate: string;
  status: string;
  contractStatus?: string;
  bondStatus?: string;
  pmsStatus?: string;
  pmsSyncStatus?: string;
  businessApprovalStatus?: "PENDING" | "APPROVED";
  canAmend?: boolean;
  canTerminate?: boolean;
  canCancel?: boolean;
  selectedReason?: string;
}

export interface Vendor {
  id: string; name: string; bizNo: string; category: string;
  contactName: string; contactEmail: string; status: string; joinedAt: string;
}

export interface User {
  id: string; name: string; role: Role; dept: string; email: string;
  status: string; createdAt: string;
}

export interface Item {
  id: string; categoryL: string; categoryM: string; name: string;
  unit: string; stdPrice: number; active: boolean;
}

export interface Notice {
  id: string; title: string; content: string; author: string;
  createdAt: string; isPinned: boolean;
}

export interface Notification {
  id: string; type: string; message: string; createdAt: string; read: boolean;
}
