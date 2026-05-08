export interface StatusMeta {
  label: string;
  bg: string;
  color: string;
}

const STATUS_META: Record<string, StatusMeta> = {
  DRAFT: { label: "초안", bg: "#F3F4F6", color: "#374151" },
  RECEIVED: { label: "접수", bg: "#DBEAFE", color: "#1D4ED8" },
  UNDER_REVIEW: { label: "검토중", bg: "#FEF3C7", color: "#92400E" },
  PENDING_APPROVAL: { label: "승인대기", bg: "#FEF3C7", color: "#92400E" },
  PENDING_SUPPLIER_APPROVAL: { label: "협력업체 확인대기", bg: "#E0F2FE", color: "#075985" },
  PENDING_BUSINESS_APPROVAL: { label: "사업담당 승인대기", bg: "#EDE9FE", color: "#6D28D9" },
  ACTIVE: { label: "계약확정", bg: "#D1FAE5", color: "#065F46" },
  PMS_SYNCED: { label: "PMS 전송완료", bg: "#DCFCE7", color: "#166534" },
  PMS_FAILED: { label: "PMS 전송실패", bg: "#FEE2E2", color: "#991B1B" },
  PMS_PENDING: { label: "PMS 전송대기", bg: "#FEF3C7", color: "#92400E" },
  AMENDED: { label: "계약변경", bg: "#E0F2FE", color: "#0C4A6E" },
  TERMINATED: { label: "계약종료", bg: "#E5E7EB", color: "#374151" },
  CANCELLED: { label: "계약취소", bg: "#FEE2E2", color: "#991B1B" },
  CLOSED: { label: "종료", bg: "#E5E7EB", color: "#374151" },
  SUBMITTED: { label: "제출완료", bg: "#DBEAFE", color: "#1D4ED8" },
  TEMP_SAVED: { label: "임시저장", bg: "#F3F4F6", color: "#4B5563" },
  REJECTED: { label: "반려", bg: "#FEE2E2", color: "#991B1B" },
  RESUBMIT_REQUIRED: { label: "재제출요청", bg: "#FEF3C7", color: "#92400E" },
  APPROVED: { label: "승인완료", bg: "#D1FAE5", color: "#065F46" },
  NOT_SUBMITTED: { label: "미제출", bg: "#F3F4F6", color: "#6B7280" },
  OPEN_NOTICE: { label: "공고중", bg: "#DBEAFE", color: "#1D4ED8" },
  APPLICATION_CLOSED: { label: "신청마감", bg: "#E0F2FE", color: "#0C4A6E" },
  SELF_REVIEW: { label: "자가심사중", bg: "#FEF3C7", color: "#92400E" },
  BID_OPEN: { label: "투찰중", bg: "#EDE9FE", color: "#6D28D9" },
  OPENED: { label: "개찰완료", bg: "#D1FAE5", color: "#065F46" },
  AWARDED: { label: "낙찰", bg: "#EDE9FE", color: "#5B21B6" },
  NOT_AWARDED: { label: "미낙찰", bg: "#F3F4F6", color: "#374151" },
  FAILED_BID: { label: "유찰", bg: "#FEE2E2", color: "#991B1B" },
  QUALIFIED: { label: "심사통과", bg: "#D1FAE5", color: "#065F46" },
  DISQUALIFIED: { label: "심사탈락", bg: "#FEE2E2", color: "#991B1B" },
  IN_PROGRESS: { label: "진행중", bg: "#DBEAFE", color: "#1E40AF" },
  계획: { label: "계획", bg: "#DBEAFE", color: "#1D4ED8" },
  입찰공고: { label: "입찰공고", bg: "#FEF3C7", color: "#92400E" },
  업체평가: { label: "업체평가", bg: "#D1FAE5", color: "#065F46" },
  개찰: { label: "개찰", bg: "#EDE9FE", color: "#6D28D9" },
  작성중: { label: "작성중", bg: "#DBEAFE", color: "#1D4ED8" },
  완료: { label: "완료", bg: "#D1FAE5", color: "#065F46" },
  진행중: { label: "진행중", bg: "#DBEAFE", color: "#1E40AF" },
  반려: { label: "반려", bg: "#FEE2E2", color: "#991B1B" },
  대기: { label: "대기", bg: "#FEF3C7", color: "#92400E" },
  승인완료: { label: "승인완료", bg: "#D1FAE5", color: "#065F46" },
  계약확정: { label: "계약확정", bg: "#D1FAE5", color: "#065F46" },
  보증제출대기: { label: "보증제출대기", bg: "#FEF3C7", color: "#92400E" },
  보증검토중: { label: "보증검토중", bg: "#E0F2FE", color: "#0C4A6E" },
  보증반려: { label: "보증반려", bg: "#FEE2E2", color: "#991B1B" },
};

export function getStatusMeta(status: string, label?: string): StatusMeta {
  const base = STATUS_META[status];
  if (base) {
    return label ? { ...base, label } : base;
  }
  return {
    label: label ?? status,
    bg: "#F3F4F6",
    color: "#4B5563",
  };
}

export function getStatusLabel(status: string, label?: string) {
  return getStatusMeta(status, label).label;
}
