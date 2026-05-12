import type { MenuItem } from "../menu-types";

export const roleAMenu: MenuItem[] = [
  {
    type: "group",
    label: "대시보드",
    href: "/a/dashboard/",
    icon: "LayoutDashboard",
    items: [{ label: "대시보드", href: "/a/dashboard/" }],
  },
  {
    type: "group",
    label: "사용자 관리",
    href: "/a/users/",
    icon: "Users",
    items: [{ label: "내부 사용자 관리", href: "/a/users/" }],
  },
  {
    type: "group",
    label: "협력업체 관리",
    href: "/a/vendors/",
    icon: "Building2",
    items: [{ label: "협력업체 승인·목록", href: "/a/vendors/" }],
  },
  {
    type: "group",
    label: "기준정보 관리",
    href: "/a/items/",
    icon: "Database",
    items: [{ label: "품목 기준정보", href: "/a/items/" }],
  },
  {
    type: "group",
    label: "시스템 환경설정",
    href: "/a/system/",
    icon: "Settings",
    divider: true,
    items: [{ label: "시스템 환경설정", href: "/a/system/" }],
  },
];
