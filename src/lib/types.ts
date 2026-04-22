export type Role = "B" | "V" | "C" | "A";

export const ROLE_LABELS: Record<Role, string> = {
  B: "사업담당자",
  V: "협력업체",
  C: "계약담당자",
  A: "관리자",
};

// 공통 도메인 타입
export interface Quote {
  id: string; title: string; vendorName: string; amount: number;
  status: string; requestedAt: string; deadline: string;
}

export interface Order {
  id: string; title: string; method: string; amount: number;
  status: string; requestedAt: string; assignee: string;
}

export interface Bid {
  id: string; title: string; method: string; estAmount: number;
  status: string; publishedAt: string; deadline: string;
}

export interface Award {
  id: string; bidId: string; title: string; vendorName: string;
  awardedAmount: number; status: string; awardedAt: string;
}

export interface Contract {
  id: string; title: string; vendorName: string; amount: number;
  startDate: string; endDate: string; status: string; pmsStatus?: string;
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
