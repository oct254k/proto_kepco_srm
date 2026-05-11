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

interface BaseMenuItem {
  label: string;
  href: string;
  icon: MenuIconName;
  divider?: boolean;
}

export interface SingleMenuItem extends BaseMenuItem {
  type: "single";
}

export interface GroupMenuItem extends BaseMenuItem {
  type: "group";
  items: MenuLeaf[];
}

export type MenuItem = SingleMenuItem | GroupMenuItem;

export const roleBMenu = [
  { type: "single", label: "대시보드", href: "/b/dashboard/", icon: "LayoutDashboard" },
  { type: "single", label: "견적", href: "/b/quote-requests/", icon: "Receipt" },
  { type: "single", label: "발주", href: "/b/orders/", icon: "Package" },
  {
    type: "group",
    label: "입찰",
    href: "/b/bids/",
    icon: "Gavel",
    items: [
      { label: "입찰계획·공고 조회", href: "/b/bids/" },
      { label: "입찰심사", href: "/b/bid-review/" },
    ],
  },
  { type: "single", label: "마이페이지", href: "/b/mypage/", icon: "CircleUser", divider: true },
] satisfies MenuItem[];

export const roleVMenu = [
  { type: "single", label: "대시보드", href: "/v/dashboard/", icon: "LayoutDashboard" },
  { type: "single", label: "견적", href: "/v/quotes/", icon: "Receipt" },
  {
    type: "group",
    label: "입찰참여",
    href: "/v/bid-pipeline/",
    icon: "Gavel",
    items: [
      { label: "입찰 파이프라인", href: "/v/bid-pipeline/" },
      { label: "입찰·투찰 현황", href: "/v/bid-history/" },
    ],
  },
  { type: "single", label: "계약·보증", href: "/v/contracts/", icon: "FileSignature" },
  { type: "single", label: "마이페이지", href: "/v/company/", icon: "CircleUser", divider: true },
] satisfies MenuItem[];

export const roleCMenu = [
  { type: "single", label: "대시보드", href: "/c/dashboard/", icon: "LayoutDashboard" },
  {
    type: "group",
    label: "발주관리",
    href: "/c/orders/",
    icon: "Package",
    items: [
      { label: "발주계약요청·계획", href: "/c/orders/" },
      { label: "견적요청 관리", href: "/c/quote-requests/" },
    ],
  },
  { type: "single", label: "입찰관리", href: "/c/bids/", icon: "Gavel" },
  { type: "single", label: "참여업체평가", href: "/c/evaluations/", icon: "ClipboardCheck" },
  { type: "single", label: "낙찰관리", href: "/c/awards/", icon: "Trophy" },
  { type: "single", label: "계약관리", href: "/c/contracts/", icon: "FileSignature" },
  { type: "single", label: "마이페이지", href: "/c/mypage/", icon: "CircleUser", divider: true },
] satisfies MenuItem[];

export const roleAMenu = [
  { type: "single", label: "사용자관리", href: "/a/users/", icon: "Users" },
  { type: "single", label: "협력업체관리", href: "/a/vendors/", icon: "Building2" },
  { type: "single", label: "기준정보(품목)", href: "/a/items/", icon: "Database" },
  { type: "single", label: "시스템환경", href: "/a/system/", icon: "Settings", divider: true },
] satisfies MenuItem[];

export const MENUS: Record<Role, MenuItem[]> = {
  B: roleBMenu,
  V: roleVMenu,
  C: roleCMenu,
  A: roleAMenu,
};

export function normalizeMenuPath(pathname: string): string {
  if (!pathname) return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function isMenuPathActive(pathname: string, href: string): boolean {
  const currentPath = normalizeMenuPath(pathname);
  const targetPath = normalizeMenuPath(href);
  return currentPath === targetPath || currentPath.startsWith(targetPath);
}

export function isMenuItemActive(item: MenuItem, pathname: string): boolean {
  if (item.type === "single") {
    return isMenuPathActive(pathname, item.href);
  }

  return item.items.some((leaf) => isMenuPathActive(pathname, leaf.href));
}

export function isMenuLeafActive(item: GroupMenuItem, pathname: string, href: string): boolean {
  if (!item.items.some((leaf) => leaf.href === href)) return false;
  return isMenuPathActive(pathname, href);
}

export function getMenuLabel(role: Role, pathname: string): string | null {
  for (const item of MENUS[role]) {
    if (isMenuItemActive(item, pathname)) return item.label;
  }

  return null;
}

export function getRoleMenuLabels(role: Role): string[] {
  return MENUS[role].map((item) => item.label);
}

export function getAllMenuLabels(): string[] {
  return Array.from(
    new Set(
      (Object.keys(MENUS) as Role[]).flatMap((role) => getRoleMenuLabels(role)),
    ),
  );
}

export function getBreadcrumb(role: Role, pathname: string): string[] {
  for (const item of MENUS[role]) {
    if (!isMenuItemActive(item, pathname)) continue;

    if (item.type === "single") {
      return [item.label];
    }

    const activeLeaf = item.items.find((leaf) => isMenuPathActive(pathname, leaf.href));
    return activeLeaf ? [item.label, activeLeaf.label] : [item.label];
  }

  return [];
}
