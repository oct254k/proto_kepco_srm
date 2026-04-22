import type { Item } from "../types";

export const ITEM_CATEGORIES_L = [
  { id: "L001", name: "전기자재", count: 24 },
  { id: "L002", name: "IT장비", count: 18 },
  { id: "L003", name: "사무용품", count: 12 },
  { id: "L004", name: "건설자재", count: 31 },
];

export const ITEM_CATEGORIES_M: Record<string, { id: string; name: string; count: number }[]> = {
  L001: [
    { id: "M001", name: "변압기", count: 8 },
    { id: "M002", name: "배전반", count: 6 },
    { id: "M003", name: "케이블", count: 10 },
  ],
  L002: [
    { id: "M004", name: "서버", count: 5 },
    { id: "M005", name: "네트워크장비", count: 8 },
    { id: "M006", name: "UPS", count: 5 },
  ],
  L003: [
    { id: "M007", name: "PC/노트북", count: 6 },
    { id: "M008", name: "복합기", count: 3 },
    { id: "M009", name: "소모품", count: 3 },
  ],
  L004: [
    { id: "M010", name: "철구조물", count: 12 },
    { id: "M011", name: "배관자재", count: 9 },
    { id: "M012", name: "도장재", count: 10 },
  ],
};

export const MOCK_ITEMS: Item[] = [
  { id: "IT001", categoryL: "전기자재", categoryM: "변압기", name: "몰드변압기 100kVA", unit: "대", stdPrice: 8500000, active: true },
  { id: "IT002", categoryL: "전기자재", categoryM: "변압기", name: "유입변압기 500kVA", unit: "대", stdPrice: 25000000, active: true },
  { id: "IT003", categoryL: "전기자재", categoryM: "배전반", name: "MCC 판넬 (400A)", unit: "면", stdPrice: 12000000, active: true },
  { id: "IT004", categoryL: "IT장비", categoryM: "서버", name: "랙서버 (2U, 32Core)", unit: "대", stdPrice: 4500000, active: true },
  { id: "IT005", categoryL: "IT장비", categoryM: "UPS", name: "UPS 20kVA", unit: "대", stdPrice: 3200000, active: false },
  { id: "IT006", categoryL: "사무용품", categoryM: "PC/노트북", name: "업무용 노트북 14인치", unit: "대", stdPrice: 1200000, active: true },
];

export interface CommonCode {
  id: string;
  groupCode: string;
  groupName: string;
  code: string;
  name: string;
  sortOrder: number;
  active: boolean;
}

export const MOCK_COMMON_CODES: CommonCode[] = [
  { id: "CC001", groupCode: "BID_METHOD", groupName: "선정방법", code: "NEGOTIATION", name: "수의계약", sortOrder: 1, active: true },
  { id: "CC002", groupCode: "BID_METHOD", groupName: "선정방법", code: "LOWEST_PRICE", name: "최저가", sortOrder: 2, active: true },
  { id: "CC003", groupCode: "BID_METHOD", groupName: "선정방법", code: "LIMITED", name: "제한경쟁", sortOrder: 3, active: true },
  { id: "CC004", groupCode: "CONTRACT_STATUS", groupName: "계약상태", code: "ACTIVE", name: "진행중", sortOrder: 1, active: true },
  { id: "CC005", groupCode: "CONTRACT_STATUS", groupName: "계약상태", code: "CLOSED", name: "완료", sortOrder: 2, active: true },
];

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  ip: string;
  createdAt: string;
}

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: "AL001", userId: "U001", userName: "김사업", action: "견적요청 등록", target: "QR-2026-015", ip: "192.168.1.10", createdAt: "2026-04-22 10:05" },
  { id: "AL002", userId: "U002", userName: "이계약", action: "낙찰 확정", target: "AWD-2026-003", ip: "192.168.1.20", createdAt: "2026-04-22 09:30" },
  { id: "AL003", userId: "ADMIN", userName: "관리자", action: "협력업체 승인", target: "V001", ip: "192.168.1.1", createdAt: "2026-04-21 17:00" },
  { id: "AL004", userId: "U003", userName: "박사업", action: "발주요청 등록", target: "ORD-2026-009", ip: "192.168.1.11", createdAt: "2026-04-21 14:20" },
  { id: "AL005", userId: "U002", userName: "이계약", action: "계약 PMS 연동", target: "CTR-2026-002", ip: "192.168.1.20", createdAt: "2026-04-21 11:00" },
];

export interface SystemSetting {
  key: string;
  label: string;
  value: string;
  type: "text" | "number" | "boolean" | "select";
  options?: string[];
}

export const MOCK_SYSTEM_SETTINGS: SystemSetting[] = [
  { key: "MAX_BID_DAYS", label: "입찰 최대 기간(일)", value: "30", type: "number" },
  { key: "QUOTE_EXPIRE_DAYS", label: "견적 유효기간(일)", value: "14", type: "number" },
  { key: "PMS_SYNC_AUTO", label: "PMS 자동 연동", value: "true", type: "boolean" },
  { key: "NOTIFICATION_EMAIL", label: "알림 이메일 발송", value: "true", type: "boolean" },
  { key: "SESSION_TIMEOUT", label: "세션 타임아웃(분)", value: "60", type: "number" },
  { key: "MAINTENANCE_MODE", label: "점검 모드", value: "false", type: "boolean" },
];

export interface ManualDoc {
  id: string;
  title: string;
  category: string;
  version: string;
  updatedAt: string;
  fileSize: string;
}

export const MOCK_MANUALS: ManualDoc[] = [
  { id: "MD001", title: "사업담당자 이용 가이드 v2.1", category: "사용자", version: "2.1", updatedAt: "2026-04-01", fileSize: "3.2MB" },
  { id: "MD002", title: "협력업체 이용 가이드 v2.0", category: "사용자", version: "2.0", updatedAt: "2026-03-15", fileSize: "2.8MB" },
  { id: "MD003", title: "계약담당자 이용 가이드 v1.5", category: "사용자", version: "1.5", updatedAt: "2026-02-20", fileSize: "4.1MB" },
  { id: "MD004", title: "시스템 관리자 가이드 v1.0", category: "관리자", version: "1.0", updatedAt: "2026-01-10", fileSize: "2.5MB" },
];
