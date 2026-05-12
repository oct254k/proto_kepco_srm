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
  /** 1Depth 메뉴 그룹 라벨 */
  label: string;
  /** 1Depth 클릭 시 이동할 기본 경로 */
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
  /** 2Depth 실제 메뉴명. 최대 depth는 여기까지. */
  items: MenuLeaf[];
}

export type MenuItem = SingleMenuItem | GroupMenuItem;
export type RoleMenuMap = Record<Role, MenuItem[]>;
