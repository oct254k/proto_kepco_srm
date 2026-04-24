import type { Bid, Award, BidParticipant } from "../types";

// pmsCardId 매핑: 설계서 05_ERD ORDER_REQUEST_ID ↔ SRM_BID_ID 연계
// PL-001(공고중) → BID-2026-005, PL-002(제안서) → BID-2026-004
// PL-003(기술평가) → BID-2026-003, PL-011(가격평가) → BID-2026-002
// PL-004(낙찰) → BID-2026-001
export const MOCK_BIDS: Bid[] = [
  { id: "BID-2026-005", title: "태양광 인버터 구매 입찰", method: "LIMITED",      estAmount: 450000000, status: "ACTIVE",      publishedAt: "2026-04-20", deadline: "2026-04-30", orderRequestId: "ORD-REQ-2025-001", pmsCardId: "PL-001" },
  { id: "BID-2026-004", title: "변압기 교체 공사 입찰",   method: "TWO_STAGE",   estAmount: 320000000, status: "IN_PROGRESS", publishedAt: "2026-04-12", deadline: "2026-04-22", orderRequestId: "ORD-REQ-2025-002", pmsCardId: "PL-002" },
  { id: "BID-2026-003", title: "배전반 유지보수 입찰",    method: "LOWEST_PRICE", estAmount: 95000000,  status: "OPENED",      publishedAt: "2026-04-08", deadline: "2026-04-18", orderRequestId: "ORD-REQ-2025-003", pmsCardId: "PL-003" },
  { id: "BID-2026-002", title: "UPS 시스템 구축",         method: "NEGOTIATION",  estAmount: 200000000, status: "CLOSED",      publishedAt: "2026-03-20", deadline: "2026-04-05", orderRequestId: "ORD-REQ-2025-011", pmsCardId: "PL-011" },
  { id: "BID-2026-001", title: "사무용 PC 납품",           method: "QUALIFIED",    estAmount: 78000000,  status: "AWARDED",     publishedAt: "2026-03-01", deadline: "2026-03-20", orderRequestId: "ORD-REQ-2025-004", pmsCardId: "PL-004" },
];

export const METHOD_LABELS: Record<string, string> = {
  NEGOTIATION: "수의계약",
  LOWEST_PRICE: "최저가",
  LIMITED: "제한경쟁",
  TWO_STAGE: "2단계경쟁",
  QUALIFIED: "적격심사",
};

export const BID_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "공고중",
  IN_PROGRESS: "진행중",
  OPENED: "개찰완료",
  CLOSED: "마감",
  AWARDED: "낙찰완료",
  DRAFT: "임시저장",
  PLANNED: "계획완료",
};

// V역할: 참여 중인 입찰
export const V_MY_BIDS = [
  { bidId: "BID-2026-005", title: "태양광 인버터 구매 입찰", step: 2, stepLabel: "심사중", status: "IN_PROGRESS", method: "LIMITED", estAmount: 450000000, deadline: "2026-04-30" },
  { bidId: "BID-2026-003", title: "배전반 유지보수 입찰", step: 3, stepLabel: "투찰완료", status: "SUBMITTED", method: "LOWEST_PRICE", estAmount: 95000000, deadline: "2026-04-18" },
];

// 참여 업체 목록 — BidParticipant 타입 적용 (설계서 05_ERD/02 VENDOR_PROPOSALS_JSON shape)
// srm-bid-proposals Webhook으로 PMS에 전송되는 데이터의 원본
export const BID_PARTICIPANTS: BidParticipant[] = [
  { id: "P001", bidId: "BID-2026-004", vendorName: "(주)한국전기솔루션", srmPartnerId: "SRM-V-011", amount: 290000000, score: 88, status: "SUBMITTED", delivery: 75,  creditGrade: "A-",  debtRatio: "68%", historyCount: 4 },
  { id: "P002", bidId: "BID-2026-004", vendorName: "(주)전기공사",         srmPartnerId: "SRM-V-022", amount: 310000000, score: 75, status: "SUBMITTED", delivery: 90,  creditGrade: "BBB", debtRatio: "72%", historyCount: 2 },
  { id: "P003", bidId: "BID-2026-004", vendorName: "(주)그린에너지",       srmPartnerId: "SRM-V-033", amount: 275000000, score: 62, status: "SUBMITTED", delivery: 60,  creditGrade: "BB+", debtRatio: "85%", historyCount: 1 },
  // BID-2026-005 (공고중 → 제안서 접수 중)
  { id: "P004", bidId: "BID-2026-005", vendorName: "(주)태양전력",         srmPartnerId: "SRM-V-041", amount: 420000000, score:  0, status: "APPLIED",   delivery: 60,  creditGrade: "A",   debtRatio: "55%", historyCount: 3 },
  { id: "P005", bidId: "BID-2026-005", vendorName: "(주)에너지텍",         srmPartnerId: "SRM-V-052", amount: 445000000, score:  0, status: "APPLIED",   delivery: 75,  creditGrade: "BBB", debtRatio: "78%", historyCount: 1 },
  { id: "P006", bidId: "BID-2026-005", vendorName: "(주)스마트파워",       srmPartnerId: "SRM-V-063", amount: 437000000, score:  0, status: "APPLIED",   delivery: 45,  creditGrade: "BB",  debtRatio: "92%", historyCount: 0 },
  // BID-2026-003 (기술평가 완료)
  { id: "P007", bidId: "BID-2026-003", vendorName: "(주)한국전기솔루션",   srmPartnerId: "SRM-V-011", amount: 86500000,  score: 88, status: "SUBMITTED", delivery: 30,  creditGrade: "A-",  debtRatio: "68%", historyCount: 2 },
  { id: "P008", bidId: "BID-2026-003", vendorName: "(주)그린솔루션",       srmPartnerId: "SRM-V-071", amount: 84000000,  score: 75, status: "SUBMITTED", delivery: 35,  creditGrade: "BBB", debtRatio: "70%", historyCount: 1 },
  { id: "P009", bidId: "BID-2026-003", vendorName: "(주)태양전력",         srmPartnerId: "SRM-V-041", amount: 87800000,  score: 62, status: "SUBMITTED", delivery: 40,  creditGrade: "A",   debtRatio: "55%", historyCount: 0 },
];

export const MOCK_AWARDS: Award[] = [
  { id: "AWD-2026-003", bidId: "BID-2026-004", title: "변압기 교체 공사", vendorName: "(주)전기공사", awardedAmount: 310000000, status: "PENDING", awardedAt: "-" },
  { id: "AWD-2026-002", bidId: "BID-2026-003", title: "배전반 유지보수", vendorName: "(주)한국전기솔루션", awardedAmount: 93000000, status: "AWARDED", awardedAt: "2026-04-19" },
  { id: "AWD-2026-001", bidId: "BID-2026-001", title: "사무용 PC 납품", vendorName: "(주)IT파트너스", awardedAmount: 76000000, status: "AWARDED", awardedAt: "2026-03-22" },
];

// 심사 목록 (SCR-S-08)
export const EVAL_BID_LIST = [
  { id: "BID-2026-005", title: "태양광 인버터 구매 입찰", method: "QUALIFIED", participantCount: 5, evalStatus: "위원배정완료" },
  { id: "BID-2026-004", title: "변압기 교체 공사 입찰", method: "TWO_STAGE", participantCount: 8, evalStatus: "심사진행중" },
  { id: "BID-2026-003", title: "배전반 유지보수 입찰", method: "LOWEST_PRICE", participantCount: 3, evalStatus: "자동선정" },
  { id: "BID-2026-002", title: "UPS 시스템 구축", method: "NEGOTIATION", participantCount: 2, evalStatus: "자동선정" },
];

// 심사 기준 항목
export const EVAL_CRITERIA = [
  { id: "C001", name: "품질관리능력", evalType: "GRADE", maxScore: 30, weight: 0.30 },
  { id: "C002", name: "납기이행능력", evalType: "GRADE", maxScore: 25, weight: 0.25 },
  { id: "C003", name: "재정건전성", evalType: "SCORE", maxScore: 20, weight: 0.20 },
  { id: "C004", name: "시공실적", evalType: "SCORE", maxScore: 15, weight: 0.15 },
  { id: "C005", name: "면허 보유", evalType: "PASS_FAIL", maxScore: 10, weight: 0.10 },
];

// 심사 위원
export const EVAL_REVIEWERS = [
  { id: "R001", name: "이계약", dept: "계약팀", role: "LEAD", assignedAt: "2026-04-20", status: "배정완료" },
  { id: "R002", name: "김사업", dept: "전력사업팀", role: "MEMBER", assignedAt: "2026-04-20", status: "배정완료" },
  { id: "R003", name: "박담당", dept: "구매팀", role: "MEMBER", assignedAt: "2026-04-20", status: "배정완료" },
];

// 심사 참여업체 상태
export const EVAL_PARTICIPANTS_STATUS = [
  { vendorName: "(주)한국전기솔루션", applyDate: "04-15 09:30", docStatus: "완료", r001: "제출", r002: "제출", r003: "진행중", score: 88.5, pass: true },
  { vendorName: "(주)태양전력", applyDate: "04-15 14:20", docStatus: "완료", r001: "제출", r002: "진행중", r003: "미시작", score: 75.2, pass: true },
  { vendorName: "(주)그린솔루션", applyDate: "04-16 10:00", docStatus: "완료", r001: "제출", r002: "제출", r003: "진행중", score: 62.8, pass: true },
  { vendorName: "(주)스마트파워", applyDate: "04-17 09:00", docStatus: "완료", r001: "제출", r002: "제출", r003: "제출", score: 55.1, pass: false },
];

// SCR-S-09 배정된 심사 목록 (사업담당자)
export const B_ASSIGNED_REVIEWS = [
  { bidId: "BID-2026-005", title: "태양광 인버터 구매 입찰", deadline: "2026-05-01", myStatus: "IN_PROGRESS", myStatusLabel: "진행중", totalDone: 2, totalReviewers: 3, step: 3 },
  { bidId: "BID-2026-003", title: "배전반 유지보수 입찰", deadline: "2026-04-25", myStatus: "SUBMITTED", myStatusLabel: "제출완료", totalDone: 3, totalReviewers: 3, step: 5 },
  { bidId: "BID-2026-001", title: "사무용 PC 납품", deadline: "2026-04-10", myStatus: "WAITING", myStatusLabel: "미시작", totalDone: 0, totalReviewers: 2, step: 1 },
];

// SCR-S-09 참여업체별 심사 상태
export const B_REVIEW_VENDORS = [
  { id: "V001", vendorName: "(주)한국전기솔루션", selfAssess: "완료", tender: "완료", myStatus: "DONE", myStatusLabel: "입력완료" },
  { id: "V002", vendorName: "(주)태양전력", selfAssess: "완료", tender: "완료", myStatus: "DRAFT", myStatusLabel: "임시저장" },
  { id: "V003", vendorName: "(주)그린솔루션", selfAssess: "완료", tender: "완료", myStatus: "NONE", myStatusLabel: "미작성" },
  { id: "V004", vendorName: "(주)에너지텍", selfAssess: "완료", tender: "완료", myStatus: "NONE", myStatusLabel: "미작성" },
  { id: "V005", vendorName: "(주)스마트파워", selfAssess: "미제출", tender: "완료", myStatus: "NONE", myStatusLabel: "미작성" },
];

// 예비가 15개
export const RESERVE_PRICES = [
  { no: 1, amount: 101000000 },
  { no: 2, amount: 99500000 },
  { no: 3, amount: 100000000 },
  { no: 4, amount: 98500000 },
  { no: 5, amount: 102000000 },
  { no: 6, amount: 97000000 },
  { no: 7, amount: 103000000 },
  { no: 8, amount: 99000000 },
  { no: 9, amount: 101500000 },
  { no: 10, amount: 98000000 },
  { no: 11, amount: 96000000 },
  { no: 12, amount: 104000000 },
  { no: 13, amount: 100500000 },
  { no: 14, amount: 97500000 },
  { no: 15, amount: 102500000 },
];

// 개찰 결과
export const OPEN_BID_RESULTS = [
  { rank: 1, vendorName: "(주)한국전기솔루션", amount: 86500000, estRate: "88.3%", qualified: true, candidate: true },
  { rank: 2, vendorName: "(주)태양전력", amount: 87800000, estRate: "89.6%", qualified: true, candidate: true },
  { rank: 3, vendorName: "(주)그린솔루션", amount: 84000000, estRate: "85.7%", qualified: false, candidate: false },
  { rank: 4, vendorName: "(주)에너지텍", amount: 99000000, estRate: "101.0%", qualified: true, candidate: false },
  { rank: 5, vendorName: "(주)스마트파워", amount: 0, estRate: "-", qualified: false, candidate: false, abandoned: true },
];
