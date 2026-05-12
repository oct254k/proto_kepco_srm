import type { MenuItem } from "../menu-types";

export const roleBMenu: MenuItem[] = [
  {
    type: "group",
    label: "대시보드",
    href: "/b/dashboard/",
    icon: "LayoutDashboard",
    items: [{ label: "대시보드", href: "/b/dashboard/" }],
  },
  {
    type: "group",
    label: "견적",
    href: "/b/quote-requests/",
    icon: "Receipt",
    items: [{ label: "견적요청·조회", href: "/b/quote-requests/" }],
  },
  {
    type: "group",
    label: "발주",
    href: "/b/orders/",
    icon: "Package",
    items: [{ label: "발주계약요청·계획", href: "/b/orders/" }],
  },
  {
    type: "group",
    label: "입찰",
    href: "/b/bids/",
    icon: "Gavel",
    items: [{ label: "입찰공고 조회", href: "/b/bids/" }],
  },
  {
    type: "group",
    label: "참여업체평가",
    href: "/b/bid-review/",
    icon: "ClipboardCheck",
    items: [{ label: "입찰심사", href: "/b/bid-review/" }],
  },
  {
    type: "group",
    label: "마이페이지",
    href: "/b/mypage/",
    icon: "CircleUser",
    divider: true,
    items: [
      { label: "발주요청현황", href: "/b/mypage/" },
      { label: "수정요청·메일발송", href: "/b/mypage/?view=change-mail" },
    ],
  },
];
