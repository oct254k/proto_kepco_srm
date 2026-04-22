import type { User } from "../types";

// 기업 정보 (V역할)
export const MY_COMPANY = {
  name: "(주)한국전기솔루션",
  bizNo: "123-45-67890",
  ceoName: "홍길동",
  address: "서울시 강남구 테헤란로 123",
  bizType: "법인",
  category: "전기공사업",
  tel: "02-1234-5678",
  email: "contact@korelec.com",
  registeredAt: "2025-01-15",
  status: "ACTIVE",
};

export interface ContactPerson {
  id: string;
  name: string;
  dept: string;
  position: string;
  tel: string;
  email: string;
  isMain: boolean;
}

export const MY_CONTACTS: ContactPerson[] = [
  {
    id: "CP001",
    name: "김영수",
    dept: "영업팀",
    position: "부장",
    tel: "010-1234-5678",
    email: "ys.kim@korelec.com",
    isMain: true,
  },
  {
    id: "CP002",
    name: "이지연",
    dept: "기술팀",
    position: "차장",
    tel: "010-2345-6789",
    email: "jy.lee@korelec.com",
    isMain: false,
  },
];

// B역할 마이페이지
export const B_MY_QUOTES = [
  {
    id: "QR-2026-015",
    title: "태양광 인버터 구매 견적",
    status: "SUBMITTED",
    requestedAt: "2026-04-22",
    deadline: "2026-04-30",
  },
  {
    id: "QR-2026-014",
    title: "서버실 UPS 교체 견적",
    status: "IN_PROGRESS",
    requestedAt: "2026-04-20",
    deadline: "2026-04-28",
  },
  {
    id: "QR-2026-013",
    title: "네트워크 장비 구매",
    status: "ACTIVE",
    requestedAt: "2026-04-18",
    deadline: "2026-04-25",
  },
];

export const B_MY_ORDERS = [
  {
    id: "ORD-2026-010",
    title: "전력 계측 장비 발주",
    method: "NEGOTIATION",
    status: "SUBMITTED",
    requestedAt: "2026-04-22",
  },
  {
    id: "ORD-2026-009",
    title: "변압기 교체 발주",
    method: "LOWEST_PRICE",
    status: "IN_PROGRESS",
    requestedAt: "2026-04-19",
  },
];

export const B_MAIL_INBOX = [
  {
    id: "ML001",
    from: "system@srm.kepco-es.co.kr",
    subject: "[SRM] 견적요청 QR-2026-015 접수 확인",
    receivedAt: "2026-04-22 10:05",
    read: true,
  },
  {
    id: "ML002",
    from: "contract@kepco-es.co.kr",
    subject: "[계약] ORD-2026-010 발주요청 검토 완료",
    receivedAt: "2026-04-22 09:30",
    read: false,
  },
  {
    id: "ML003",
    from: "system@srm.kepco-es.co.kr",
    subject: "[SRM] 입찰 BID-2026-005 공고 발행 알림",
    receivedAt: "2026-04-20 14:00",
    read: false,
  },
];

// C역할 마이페이지
export const C_MY_BIDS = [
  {
    id: "BID-2026-005",
    title: "태양광 인버터 구매 입찰",
    method: "LIMITED",
    status: "ACTIVE",
    deadline: "2026-04-30",
    participantCount: 5,
  },
  {
    id: "BID-2026-004",
    title: "변압기 교체 공사 입찰",
    method: "TWO_STAGE",
    status: "IN_PROGRESS",
    deadline: "2026-04-22",
    participantCount: 3,
  },
];

export const C_MY_CONTRACTS = [
  {
    id: "CTR-2026-003",
    title: "태양광 인버터 납품 계약",
    vendorName: "(주)한국전기솔루션",
    amount: 440000000,
    status: "ACTIVE",
    endDate: "2026-10-31",
  },
  {
    id: "CTR-2026-002",
    title: "변압기 교체 공사 계약",
    vendorName: "(주)전기공사",
    amount: 310000000,
    status: "ACTIVE",
    endDate: "2026-07-14",
  },
];

export const C_PROCESS_HISTORY = [
  {
    id: "PH001",
    type: "계약확정",
    target: "CTR-2026-003",
    date: "2026-04-22",
    result: "완료",
  },
  {
    id: "PH002",
    type: "낙찰확정",
    target: "AWD-2026-003",
    date: "2026-04-20",
    result: "완료",
  },
  {
    id: "PH003",
    type: "공고등록",
    target: "BID-2026-005",
    date: "2026-04-19",
    result: "완료",
  },
  {
    id: "PH004",
    type: "발주접수",
    target: "ORD-2026-010",
    date: "2026-04-18",
    result: "완료",
  },
];

// Mock user profiles
export const B_PROFILE = {
  name: "김영희",
  dept: "발전사업부",
  role: "사업담당자",
  email: "yh.kim@kepco-es.co.kr",
  lastLogin: "2026-04-22 09:00",
};

export const C_PROFILE = {
  name: "김계약",
  dept: "구매계약팀",
  role: "계약담당자",
  empNo: "EMP-20220315",
  email: "contract.kim@kepco-es.co.kr",
  tel: "02-1234-5678",
  position: "대리",
  accountStatus: "ACTIVE",
  lastLogin: "2026-04-20 09:12:33",
};

// suppress unused import warning - User type is used for typing context
export type { User };
