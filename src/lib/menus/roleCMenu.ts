import type { MenuItem } from "../menu-types";

export const roleCMenu: MenuItem[] = [
  {
    type: "group",
    label: "대시보드",
    href: "/c/dashboard/",
    icon: "LayoutDashboard",
    items: [{ label: "대시보드", href: "/c/dashboard/" }],
  },
  {
    type: "group",
    label: "견적",
    href: "/c/quote-requests/",
    icon: "Receipt",
    items: [{ label: "견적요청·조회", href: "/c/quote-requests/" }],
  },
  {
    type: "group",
    label: "발주",
    href: "/c/orders/",
    icon: "Package",
    items: [{ label: "발주계약요청·계획", href: "/c/orders/" }],
  },
  {
    type: "group",
    label: "입찰",
    href: "/c/bids/",
    icon: "Gavel",
    items: [{ label: "입찰계획·공고 관리", href: "/c/bids/" }],
  },
  {
    type: "group",
    label: "참여업체평가",
    href: "/c/evaluations/",
    icon: "ClipboardCheck",
    items: [{ label: "심사관리", href: "/c/evaluations/" }],
  },
  {
    type: "group",
    label: "낙찰관리",
    href: "/c/awards/",
    icon: "Trophy",
    items: [{ label: "낙찰관리 통합", href: "/c/awards/" }],
  },
  {
    type: "group",
    label: "계약",
    href: "/c/contracts/",
    icon: "FileSignature",
    items: [{ label: "계약 관리", href: "/c/contracts/" }],
  },
  {
    type: "group",
    label: "마이페이지",
    href: "/c/mypage/",
    icon: "CircleUser",
    divider: true,
    items: [{ label: "담당 업무 현황", href: "/c/mypage/" }],
  },
];
