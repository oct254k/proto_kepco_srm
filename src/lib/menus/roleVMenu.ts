import type { MenuItem } from "../menu-types";

export const roleVMenu: MenuItem[] = [
  {
    type: "group",
    label: "대시보드",
    href: "/v/dashboard/",
    icon: "LayoutDashboard",
    items: [{ label: "대시보드", href: "/v/dashboard/" }],
  },
  {
    type: "group",
    label: "견적관리",
    href: "/v/quotes/",
    icon: "Receipt",
    items: [{ label: "견적작성·현황", href: "/v/quotes/" }],
  },
  {
    type: "group",
    label: "투찰관리",
    href: "/v/bid-pipeline/",
    icon: "Gavel",
    items: [{ label: "입찰 파이프라인", href: "/v/bid-pipeline/" }],
  },
  {
    type: "group",
    label: "계약관리",
    href: "/v/contracts/",
    icon: "FileSignature",
    items: [{ label: "계약·보증 관리", href: "/v/contracts/" }],
  },
  {
    type: "group",
    label: "마이페이지",
    href: "/v/bid-history/",
    icon: "CircleUser",
    divider: true,
    items: [
      { label: "입찰·투찰 현황", href: "/v/bid-history/" },
      { label: "기업정보 관리", href: "/v/company/" },
    ],
  },
];
