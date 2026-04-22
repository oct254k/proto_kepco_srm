import type { User, Vendor } from "../types";

export const MOCK_USERS: User[] = [
  { id: "U001", name: "김사업", role: "B", dept: "사업1팀", email: "b.kim@kepco-es.co.kr", status: "ACTIVE", createdAt: "2025-03-01" },
  { id: "U002", name: "이계약", role: "C", dept: "계약1팀", email: "c.lee@kepco-es.co.kr", status: "ACTIVE", createdAt: "2025-03-01" },
  { id: "U003", name: "박사업", role: "B", dept: "사업2팀", email: "b.park@kepco-es.co.kr", status: "ACTIVE", createdAt: "2025-04-01" },
  { id: "U004", name: "최계약", role: "C", dept: "계약2팀", email: "c.choi@kepco-es.co.kr", status: "INACTIVE", createdAt: "2025-02-01" },
  { id: "U005", name: "정계약", role: "C", dept: "계약3팀", email: "c.jung@kepco-es.co.kr", status: "ACTIVE", createdAt: "2025-05-01" },
];

export const MOCK_VENDORS: Vendor[] = [
  { id: "V001", name: "(주)한국전기솔루션", bizNo: "123-45-67890", category: "전기공사업", contactName: "김영수", contactEmail: "ys.kim@korelec.com", status: "ACTIVE", joinedAt: "2025-01-15" },
  { id: "V002", name: "(주)전기공사", bizNo: "234-56-78901", category: "건설업", contactName: "이철수", contactEmail: "cs.lee@elec.com", status: "ACTIVE", joinedAt: "2025-02-20" },
  { id: "V003", name: "(주)그린에너지", bizNo: "345-67-89012", category: "신재생에너지", contactName: "박민수", contactEmail: "ms.park@green.com", status: "ACTIVE", joinedAt: "2025-03-10" },
  { id: "V004", name: "(주)IT파트너스", bizNo: "456-78-90123", category: "IT서비스업", contactName: "최지영", contactEmail: "jy.choi@itp.com", status: "INACTIVE", joinedAt: "2025-01-01" },
];

export const PENDING_VENDORS: Vendor[] = [
  { id: "PV001", name: "(주)에너지솔루션", bizNo: "567-89-01234", category: "전기공사업", contactName: "강민준", contactEmail: "mj.kang@energy.com", status: "PENDING", joinedAt: "2026-04-20" },
  { id: "PV002", name: "(주)스마트전기", bizNo: "678-90-12345", category: "전기공사업", contactName: "윤서연", contactEmail: "sy.yoon@smart.com", status: "PENDING", joinedAt: "2026-04-21" },
  { id: "PV003", name: "(주)파워시스템", bizNo: "789-01-23456", category: "건설업", contactName: "조현우", contactEmail: "hw.cho@power.com", status: "PENDING", joinedAt: "2026-04-22" },
];

export interface PermGroup {
  id: string;
  name: string;
  role: string;
  userCount: number;
  description: string;
}

export const PERM_GROUPS: PermGroup[] = [
  { id: "PG001", name: "사업담당자_기본", role: "B", userCount: 8, description: "견적요청/발주요청 권한" },
  { id: "PG002", name: "계약담당자_기본", role: "C", userCount: 5, description: "전체 계약 관리 권한" },
  { id: "PG003", name: "계약담당자_확장", role: "C", userCount: 2, description: "기준정보 조회 포함 권한" },
];
