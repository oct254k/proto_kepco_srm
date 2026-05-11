import type { Role } from "./types";

export type MenuIconName =
  | "LayoutDashboard"
  | "Receipt"
  | "Package"
  | "Gavel"
  | "ClipboardCheck"
  | "Trophy"
  | "FileSignature"
  | "CircleUser"
  | "Settings"
  | "Users"
  | "Building2"
  | "Database"
  | "ClipboardList"
  | "Scale"
  | "Flag"
  | "BarChart3"
  | "Repeat"
  | "UserSquare"
  | "Briefcase"
  | "Search"
  | "FileText"
  | "Award";

export interface MenuLeaf {
  label: string;
  href: string;
}

export interface MenuGroup {
  /** 최상위 메뉴 라벨 */
  label: string;
  /** 최상위 클릭 시 이동할 기본 경로 (보통 첫 서브항목과 동일) */
  href: string;
  /** lucide-react 아이콘 이름 */
  icon: MenuIconName;
  /** 그룹 안 서브항목들. 1개여도 OK */
  items: MenuLeaf[];
  /** true면 항목 위에 구분선 표시 */
  divider?: boolean;
}

export const MENUS: Record<Role, MenuGroup[]> = {
  B: [
    { label: "대시보드", href: "/b/dashboard/", icon: "LayoutDashboard", items: [{ label: "대시보드", href: "/b/dashboard/" }] },
    { label: "견적", href: "/b/quote-requests/", icon: "Receipt", items: [{ label: "견적요청 관리", href: "/b/quote-requests/" }] },
    { label: "발주", href: "/b/orders/", icon: "Package", items: [{ label: "발주계약요청", href: "/b/orders/" }] },
    {
      label: "입찰",
      href: "/b/bids/",
      icon: "Gavel",
      items: [
        { label: "입찰계획·공고 조회", href: "/b/bids/" },
        { label: "입찰심사", href: "/b/bid-review/" },
      ],
    },
    { label: "마이페이지", href: "/b/mypage/", icon: "CircleUser", divider: true, items: [{ label: "마이페이지", href: "/b/mypage/" }] },
  ],
  V: [
    { label: "대시보드", href: "/v/dashboard/", icon: "LayoutDashboard", items: [{ label: "대시보드", href: "/v/dashboard/" }] },
    { label: "견적", href: "/v/quotes/", icon: "Receipt", items: [{ label: "견적작성·현황", href: "/v/quotes/" }] },
    {
      label: "입찰참여",
      href: "/v/bid-pipeline/",
      icon: "Gavel",
      items: [
        { label: "입찰 파이프라인", href: "/v/bid-pipeline/" },
        { label: "입찰·투찰 현황", href: "/v/bid-history/" },
      ],
    },
    { label: "계약·보증", href: "/v/contracts/", icon: "FileSignature", items: [{ label: "계약·보증 관리", href: "/v/contracts/" }] },
    { label: "마이페이지", href: "/v/company/", icon: "CircleUser", divider: true, items: [{ label: "기업정보", href: "/v/company/" }] },
  ],
  C: [
    { label: "대시보드", href: "/c/dashboard/", icon: "LayoutDashboard", items: [{ label: "대시보드", href: "/c/dashboard/" }] },
    {
      label: "발주관리",
      href: "/c/orders/",
      icon: "Package",
      items: [
        { label: "발주계약요청·계획", href: "/c/orders/" },
        { label: "견적요청 관리", href: "/c/quote-requests/" },
      ],
    },
    { label: "입찰관리", href: "/c/bids/", icon: "Gavel", items: [{ label: "입찰계획·공고", href: "/c/bids/" }] },
    { label: "참여업체평가", href: "/c/evaluations/", icon: "ClipboardCheck", items: [{ label: "평가·심사관리", href: "/c/evaluations/" }] },
    { label: "낙찰관리", href: "/c/awards/", icon: "Trophy", items: [{ label: "낙찰관리", href: "/c/awards/" }] },
    { label: "계약관리", href: "/c/contracts/", icon: "FileSignature", items: [{ label: "계약관리", href: "/c/contracts/" }] },
    { label: "마이페이지", href: "/c/mypage/", icon: "CircleUser", divider: true, items: [{ label: "마이페이지", href: "/c/mypage/" }] },
  ],
  A: [
    { label: "사용자관리", href: "/a/users/", icon: "Users", items: [{ label: "사용자·협력업체 관리", href: "/a/users/" }] },
    { label: "협력업체관리", href: "/a/vendors/", icon: "Building2", items: [{ label: "협력업체 승인관리", href: "/a/vendors/" }] },
    { label: "기준정보(품목)", href: "/a/items/", icon: "Database", items: [{ label: "품목 기준정보", href: "/a/items/" }] },
    { label: "시스템환경", href: "/a/system/", icon: "Settings", divider: true, items: [{ label: "시스템 환경설정", href: "/a/system/" }] },
  ],
};

export function getMenuLabel(role: Role, pathname: string): string | null {
  const cleanPath = pathname.replace(/\/$/, "");
  for (const group of MENUS[role]) {
    for (const sub of group.items) {
      const cleanSub = sub.href.replace(/\/$/, "");
      if (cleanPath === cleanSub) return group.label;
    }
    const cleanGroup = group.href.replace(/\/$/, "");
    if (cleanPath === cleanGroup || cleanPath.startsWith(cleanGroup + "/")) return group.label;
  }
  return null;
}

export function getRoleMenuLabels(role: Role): string[] {
  return MENUS[role].map((group) => group.label);
}

export function getAllMenuLabels(): string[] {
  return Array.from(
    new Set(
      (Object.keys(MENUS) as Role[]).flatMap((role) => getRoleMenuLabels(role)),
    ),
  );
}

export function getBreadcrumb(role: Role, pathname: string): string[] {
  const label = getMenuLabel(role, pathname);
  return label ? [label] : [];
}
