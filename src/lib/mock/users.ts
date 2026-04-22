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

// ─── B 마이페이지 추가 Mock ───────────────────────────────────────────────────

export const B_SYSTEM_REQUESTS = [
  {
    id: "SRQ-001",
    title: "발주요청 임시저장 후 재진입 시 데이터 초기화 오류",
    type: "버그신고",
    registeredAt: "2026-04-20",
    status: "검토중",
  },
  {
    id: "SRQ-002",
    title: "견적 비교 화면 정렬 기능 추가 요청",
    type: "개선요청",
    registeredAt: "2026-04-18",
    status: "접수",
  },
  {
    id: "SRQ-003",
    title: "입찰 공고 마감일 변경 프로세스 안내",
    type: "문의",
    registeredAt: "2026-04-15",
    status: "답변완료",
  },
];

export const B_MAIL_SEND_HISTORY = [
  {
    id: "MSH-001",
    sentAt: "2026-04-22 14:30",
    bidTitle: "태양광 인버터 구매 입찰 공고",
    targetType: "전체 참여업체",
    sentCount: 12,
    status: "발송완료",
  },
  {
    id: "MSH-002",
    sentAt: "2026-04-20 10:00",
    bidTitle: "변압기 교체 공사 입찰 공고",
    targetType: "낙찰업체",
    sentCount: 1,
    status: "발송완료",
  },
];

// B 마이페이지 발주요청현황용 (내가 요청한 발주)
export const B_MY_ORDERS_DETAIL = [
  {
    id: "ORD-2026-010",
    title: "전력 계측 장비 발주",
    method: "NEGOTIATION",
    amount: 95000000,
    status: "SUBMITTED",
    requestedAt: "2026-04-22",
    assignee: "홍계약(계약1팀)",
    pmsProject: "PRJ-2026-010",
    description: "154kV 변전소 내 전력 계측 장비 교체. GIS 계측 모듈 포함.",
    histories: [
      { date: "2026-04-22 10:00", status: "DRAFT → SUBMITTED", actor: "김영희(B)", note: "제출 완료" },
      { date: "2026-04-22 11:30", status: "SUBMITTED → RECEIVED", actor: "홍계약(C)", note: "발주계획 수립 예정" },
    ],
    linkedBid: null,
  },
  {
    id: "ORD-2026-009",
    title: "변압기 교체 발주",
    method: "LOWEST_PRICE",
    amount: 310000000,
    status: "IN_PROGRESS",
    requestedAt: "2026-04-19",
    assignee: "이계약(계약2팀)",
    pmsProject: "PRJ-2026-009",
    description: "154kV 변압기 2대 교체 공사. 주변 케이블 포함.",
    histories: [
      { date: "2026-04-19 09:00", status: "DRAFT → SUBMITTED", actor: "김영희(B)", note: "" },
      { date: "2026-04-19 14:00", status: "SUBMITTED → RECEIVED", actor: "이계약(C)", note: "입찰공고 준비 중" },
      { date: "2026-04-21 10:00", status: "RECEIVED → IN_PROGRESS", actor: "이계약(C)", note: "입찰계획 확정" },
    ],
    linkedBid: { id: "BID-2026-003", title: "변압기 교체 입찰 공고", date: "2026-04-21", deadline: "2026-05-01", status: "공고중" },
  },
];

// ─── C 마이페이지 추가 Mock ───────────────────────────────────────────────────

export interface OrderPlan {
  id: string;
  title: string;
  site: string;
  category: string;
  amount: number;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "AWARDED" | "CONTRACTED" | "CANCELLED";
  pmsSync: "PENDING" | "SYNCED" | "FAILED";
  requestedAt: string;
  requester: string;
  description: string;
}

export const C_ORDER_PLANS: OrderPlan[] = [
  {
    id: "ORD-2026-001",
    title: "한전 변전소 설비공사 자재 구매",
    site: "서울북부",
    category: "전기자재",
    amount: 145000000,
    status: "PENDING",
    pmsSync: "PENDING",
    requestedAt: "2026-01-05",
    requester: "홍길동(B)",
    description: "변전소 내 GIS 설비 교체 및 신규 변압기 설치 공사. 주요 자재 154kV급 변전 설비 일체.",
  },
  {
    id: "ORD-2026-002",
    title: "154kV 송전선 교체 자재",
    site: "경인",
    category: "전선·케이블",
    amount: 230000000,
    status: "ACCEPTED",
    pmsSync: "SYNCED",
    requestedAt: "2026-01-07",
    requester: "김담당(B)",
    description: "154kV 송전선 노후 구간 교체를 위한 전선 및 철탑 자재 구매.",
  },
  {
    id: "ORD-2026-003",
    title: "배전반 신설 공사 자재",
    site: "부산",
    category: "전기자재",
    amount: 89000000,
    status: "IN_PROGRESS",
    pmsSync: "SYNCED",
    requestedAt: "2026-01-10",
    requester: "이사업(B)",
    description: "신규 배전반 설치를 위한 분전함 및 배선 자재.",
  },
  {
    id: "ORD-2026-004",
    title: "변전소 통신설비 구매",
    site: "대전",
    category: "통신·제어",
    amount: 65000000,
    status: "AWARDED",
    pmsSync: "SYNCED",
    requestedAt: "2026-01-12",
    requester: "박사업(B)",
    description: "변전소 IEC 61850 통신 장비 및 RTU 교체.",
  },
  {
    id: "ORD-2026-005",
    title: "송전탑 점검 용역",
    site: "광주",
    category: "유지보수",
    amount: 42000000,
    status: "CONTRACTED",
    pmsSync: "SYNCED",
    requestedAt: "2026-01-15",
    requester: "최사업(B)",
    description: "송전탑 정기점검 및 도장 유지보수 용역.",
  },
  {
    id: "ORD-2026-006",
    title: "지중케이블 교체 공사",
    site: "서울남부",
    category: "전선·케이블",
    amount: 178000000,
    status: "PENDING",
    pmsSync: "FAILED",
    requestedAt: "2026-04-18",
    requester: "강담당(B)",
    description: "노후 지중 케이블 구간 교체. 22.9kV 지중 케이블 3km.",
  },
];

export const C_ORDER_PLAN_HISTORIES: Record<string, { date: string; from: string; to: string; actor: string; note: string }[]> = {
  "ORD-2026-001": [
    { date: "2026-01-05 14:23", from: "DRAFT", to: "PENDING", actor: "홍길동(B)", note: "발주 요청 등록" },
    { date: "2026-01-05 15:00", from: "PENDING", to: "PENDING", actor: "시스템", note: "계약담당자(김계약) 배정" },
  ],
  "ORD-2026-002": [
    { date: "2026-01-07 09:00", from: "DRAFT", to: "PENDING", actor: "김담당(B)", note: "발주 요청 등록" },
    { date: "2026-01-07 14:00", from: "PENDING", to: "ACCEPTED", actor: "김계약(C)", note: "발주 수락" },
    { date: "2026-01-07 14:01", from: "ACCEPTED", to: "ACCEPTED", actor: "PMS", note: "PMS 동기화 완료 (PMS_ID: ORD-PMS-0042)" },
  ],
  "ORD-2026-006": [
    { date: "2026-04-18 10:00", from: "DRAFT", to: "PENDING", actor: "강담당(B)", note: "발주 요청 등록" },
    { date: "2026-04-18 10:05", from: "PENDING", to: "PENDING", actor: "시스템", note: "PMS 동기화 실패 — 재동기화 필요" },
  ],
};

export const C_ORDER_PLAN_SUMMARY = {
  PENDING: 2,
  ACCEPTED: 1,
  IN_PROGRESS: 1,
  AWARDED: 1,
  CONTRACTED: 1,
};

// suppress unused import warning - User type is used for typing context
export type { User };
