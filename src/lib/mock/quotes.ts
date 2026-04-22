import type { Quote } from "../types";

export const MOCK_QUOTES: Quote[] = [
  { id: "QR-2026-015", title: "태양광 인버터 구매 견적", vendorName: "-", amount: 0, status: "SUBMITTED", requestedAt: "2026-04-22", deadline: "2026-04-30" },
  { id: "QR-2026-014", title: "서버실 UPS 교체 견적", vendorName: "(주)IT솔루션", amount: 45000000, status: "IN_PROGRESS", requestedAt: "2026-04-20", deadline: "2026-04-28" },
  { id: "QR-2026-013", title: "네트워크 장비 구매 견적", vendorName: "(주)한국전기솔루션", amount: 82000000, status: "ACTIVE", requestedAt: "2026-04-18", deadline: "2026-04-25" },
  { id: "QR-2026-012", title: "사무용 노트북 견적", vendorName: "(주)IT파트너스", amount: 33000000, status: "CLOSED", requestedAt: "2026-04-10", deadline: "2026-04-17" },
  { id: "QR-2026-011", title: "복합기 리스 견적", vendorName: "(주)오피스솔루션", amount: 8000000, status: "CANCELLED", requestedAt: "2026-04-08", deadline: "2026-04-15" },
];

// V역할: 받은 견적요청
export const V_QUOTE_REQUESTS = MOCK_QUOTES.slice(0, 3);

// V역할: 작성한 견적서
export interface QuoteResponse {
  id: string;
  quoteId: string;
  title: string;
  amount: number;
  submittedAt: string;
  status: string;
}

export const V_QUOTE_RESPONSES: QuoteResponse[] = [
  { id: "QRS-2026-005", quoteId: "QR-2026-013", title: "네트워크 장비 구매 견적", amount: 82000000, submittedAt: "2026-04-19", status: "SUBMITTED" },
  { id: "QRS-2026-004", quoteId: "QR-2026-012", title: "사무용 노트북 견적", amount: 33000000, submittedAt: "2026-04-11", status: "CLOSED" },
];

// 상태 한글 라벨
export const QUOTE_STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "접수",
  IN_PROGRESS: "진행중",
  ACTIVE: "활성",
  CLOSED: "마감",
  CANCELLED: "취소",
  DRAFT: "임시저장",
};
