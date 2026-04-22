import type { Role } from "./types";

export interface MenuItem {
  label: string;
  href: string;
}

export interface MenuGroup {
  label: string; // GNB 메뉴명
  items: MenuItem[]; // LNB 항목
}

export const MENUS: Record<Role, MenuGroup[]> = {
  B: [
    { label: "대시보드", items: [{ label: "대시보드", href: "/b/dashboard/" }] },
    { label: "견적", items: [{ label: "견적요청 관리", href: "/b/quote-requests/" }] },
    { label: "발주", items: [{ label: "발주계약요청", href: "/b/orders/" }] },
    {
      label: "입찰",
      items: [
        { label: "입찰계획·공고 조회", href: "/b/bids/" },
        { label: "입찰심사", href: "/b/bid-review/" },
      ],
    },
    { label: "마이페이지", items: [{ label: "마이페이지", href: "/b/mypage/" }] },
  ],
  V: [
    { label: "대시보드", items: [{ label: "대시보드", href: "/v/dashboard/" }] },
    { label: "견적", items: [{ label: "견적작성·현황", href: "/v/quotes/" }] },
    {
      label: "입찰참여",
      items: [
        { label: "입찰 파이프라인", href: "/v/bid-pipeline/" },
        { label: "입찰·투찰 현황", href: "/v/bid-history/" },
      ],
    },
    { label: "계약·보증", items: [{ label: "계약·보증 관리", href: "/v/contracts/" }] },
    {
      label: "마이페이지",
      items: [{ label: "기업정보", href: "/v/company/" }],
    },
  ],
  C: [
    { label: "대시보드", items: [{ label: "대시보드", href: "/c/dashboard/" }] },
    {
      label: "발주관리",
      items: [
        { label: "발주계약요청·계획", href: "/c/orders/" },
        { label: "견적요청 관리", href: "/c/quote-requests/" },
      ],
    },
    { label: "입찰관리", items: [{ label: "입찰계획·공고", href: "/c/bids/" }] },
    { label: "참여업체평가", items: [{ label: "평가·심사관리", href: "/c/evaluations/" }] },
    { label: "낙찰관리", items: [{ label: "낙찰관리", href: "/c/awards/" }] },
    {
      label: "계약관리",
      items: [{ label: "계약관리", href: "/c/contracts/" }],
    },
    { label: "마이페이지", items: [{ label: "마이페이지", href: "/c/mypage/" }] },
  ],
  A: [
    { label: "사용자관리", items: [{ label: "사용자·협력업체 관리", href: "/a/users/" }] },
    { label: "협력업체관리", items: [{ label: "협력업체 승인관리", href: "/a/vendors/" }] },
    { label: "기준정보(품목)", items: [{ label: "품목 기준정보", href: "/a/items/" }] },
    { label: "시스템환경", items: [{ label: "시스템 환경설정", href: "/a/system/" }] },
  ],
};

// 현재 경로에서 breadcrumb 산출
export function getBreadcrumb(role: Role, pathname: string): string[] {
  for (const group of MENUS[role]) {
    for (const item of group.items) {
      const clean = item.href.replace(/\/$/, "");
      if (pathname === clean || pathname === item.href) {
        if (group.label === item.label) return [group.label];
        return [group.label, item.label];
      }
    }
  }
  return [];
}
