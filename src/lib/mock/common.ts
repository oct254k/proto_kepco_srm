import type { Notice, Notification } from "../types";

export const MOCK_NOTICES: Notice[] = [
  { id: "N001", title: "2026년 상반기 전자입찰 시스템 점검 안내", content: "4월 25일(토) 00:00~06:00 시스템 점검 예정입니다.", author: "시스템관리자", createdAt: "2026-04-20", isPinned: true },
  { id: "N002", title: "견적서 제출 가이드라인 개정 안내", content: "2026년 5월 1일부터 개정된 가이드라인이 적용됩니다.", author: "계약담당자", createdAt: "2026-04-18", isPinned: false },
  { id: "N003", title: "협력업체 등록 서류 제출 마감 안내", content: "4월 30일까지 서류 제출 완료 부탁드립니다.", author: "시스템관리자", createdAt: "2026-04-15", isPinned: false },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "NF001", type: "공고", message: "[새 공고] 태양광 인버터 구매 공고 발행", createdAt: "2026-04-22 09:15", read: false },
  { id: "NF002", type: "보증서", message: "[보증서 제출] (주)한국전기솔루션 이행보증서가 제출되었습니다.", createdAt: "2026-04-22 08:30", read: false },
  { id: "NF003", type: "발주", message: "[발주요청 접수] ORD-2026-010 접수되었습니다.", createdAt: "2026-04-21 17:00", read: false },
];
