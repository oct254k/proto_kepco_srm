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

interface MenuBase {
  /** 최상위 메뉴 라벨 */
  label: string;
  /** 최상위 클릭 시 이동할 기본 경로 */
  href: string;
  icon: MenuIconName;
  /** true면 항목 위에 구분선 표시 */
  divider?: boolean;
}

export interface SingleMenuItem extends MenuBase {
  type: "single";
}

export interface GroupMenuItem extends MenuBase {
  type: "group";
  items: MenuLeaf[];
}

export type MenuItem = SingleMenuItem | GroupMenuItem;

export const roleBMenu: MenuItem[] = [
  { label: "대시보드", href: "/b/dashboard/", icon: "LayoutDashboard", type: "single" },
  { label: "견적", href: "/b/quote-requests/", icon: "Receipt", type: "single" },
  { label: "발주", href: "/b/orders/", icon: "Package", type: "single" },
  {
    label: "입찰",
    href: "/b/bids/",
    icon: "Gavel",
    type: "group",
    items: [
      { label: "입찰계획·공고 조회", href: "/b/bids/" },
      { label: "입찰심사", href: "/b/bid-review/" },
    ],
  },
  { label: "마이페이지", href: "/b/mypage/", icon: "CircleUser", type: "single", divider: true },
];

export const roleVMenu: MenuItem[] = [
  { label: "대시보드", href: "/v/dashboard/", icon: "LayoutDashboard", type: "single" },
  { label: "견적", href: "/v/quotes/", icon: "Receipt", type: "single" },
  {
    label: "입찰참여",
    href: "/v/bid-pipeline/",
    icon: "Gavel",
    type: "group",
    items: [
      { label: "입찰 파이프라인", href: "/v/bid-pipeline/" },
      { label: "입찰·투찰 현황", href: "/v/bid-history/" },
    ],
  },
  { label: "계약·보증", href: "/v/contracts/", icon: "FileSignature", type: "single" },
  { label: "마이페이지", href: "/v/company/", icon: "CircleUser", type: "single", divider: true },
];

export const roleCMenu: MenuItem[] = [
  { label: "대시보드", href: "/c/dashboard/", icon: "LayoutDashboard", type: "single" },
  {
    label: "발주관리",
    href: "/c/orders/",
    icon: "Package",
    type: "group",
    items: [
      { label: "발주계약요청·계획", href: "/c/orders/" },
      { label: "견적요청 관리", href: "/c/quote-requests/" },
    ],
  },
  { label: "입찰관리", href: "/c/bids/", icon: "Gavel", type: "single" },
  { label: "참여업체평가", href: "/c/evaluations/", icon: "ClipboardCheck", type: "single" },
  { label: "낙찰관리", href: "/c/awards/", icon: "Trophy", type: "single" },
  { label: "계약관리", href: "/c/contracts/", icon: "FileSignature", type: "single" },
  { label: "마이페이지", href: "/c/mypage/", icon: "CircleUser", type: "single", divider: true },
];

export const roleAMenu: MenuItem[] = [
  { label: "사용자관리", href: "/a/users/", icon: "Users", type: "single" },
  { label: "협력업체관리", href: "/a/vendors/", icon: "Building2", type: "single" },
  { label: "기준정보(품목)", href: "/a/items/", icon: "Database", type: "single" },
  { label: "시스템환경", href: "/a/system/", icon: "Settings", type: "single", divider: true },
];

export const MENUS: Record<Role, MenuItem[]> = {
  B: roleBMenu,
  V: roleVMenu,
  C: roleCMenu,
  A: roleAMenu,
};

function normalizePath(pathname: string) {
  return pathname.replace(/\/$/, "");
}

function isPathMatch(currentPath: string, targetPath: string) {
  const current = normalizePath(currentPath);
  const target = normalizePath(targetPath);
  return current === target || current.startsWith(`${target}/`);
}

export function getMenuLeaves(menu: MenuItem): MenuLeaf[] {
  return menu.type === "group" ? menu.items : [{ label: menu.label, href: menu.href }];
}

export function findMenuMatch(role: Role, pathname: string) {
  const current = normalizePath(pathname);

  for (const menu of MENUS[role]) {
    const leaves = getMenuLeaves(menu);
    const matchedLeaf = leaves.find((leaf) => isPathMatch(current, leaf.href));

    if (matchedLeaf) {
      return {
        menu,
        leaf: matchedLeaf,
      };
    }

    if (isPathMatch(current, menu.href)) {
      return {
        menu,
        leaf: menu.type === "single" ? { label: menu.label, href: menu.href } : undefined,
      };
    }
  }

  return null;
}

export function getMenuLabel(role: Role, pathname: string): string | null {
  const match = findMenuMatch(role, pathname);
  if (!match) return null;
  if (match.menu.type === "group") return match.leaf?.label ?? match.menu.label;
  return match.menu.label;
}

export function getRoleMenuLabels(role: Role): string[] {
  return MENUS[role].map((menu) => menu.label);
}

export function getAllMenuLabels(): string[] {
  return Array.from(
    new Set(
      (Object.keys(MENUS) as Role[]).flatMap((role) => getRoleMenuLabels(role)),
    ),
  );
}

export function getBreadcrumb(role: Role, pathname: string): string[] {
  const match = findMenuMatch(role, pathname);
  if (!match) return [];

  if (match.menu.type === "group") {
    if (match.leaf && match.leaf.label !== match.menu.label) {
      return [match.menu.label, match.leaf.label];
    }
    return [match.menu.label];
  }

  return [match.menu.label];
}
