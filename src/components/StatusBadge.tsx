import React from "react";

interface StatusBadgeProps {
  status: string;
}

const STATUS_MAP: Record<string, { bg: string; color: string }> = {
  // 기존 한글 상태명
  완료: { bg: "#D1FAE5", color: "#065F46" },
  완납: { bg: "#D1FAE5", color: "#065F46" },
  승인완료: { bg: "#D1FAE5", color: "#065F46" },
  검수완료: { bg: "#D1FAE5", color: "#065F46" },
  진행중: { bg: "#DBEAFE", color: "#1E40AF" },
  결재중: { bg: "#DBEAFE", color: "#1E40AF" },
  검수중: { bg: "#DBEAFE", color: "#1E40AF" },
  소싱중: { bg: "#DBEAFE", color: "#1E40AF" },
  투입중: { bg: "#DBEAFE", color: "#1E40AF" },
  계약중: { bg: "#DBEAFE", color: "#1E40AF" },
  반려: { bg: "#FEE2E2", color: "#991B1B" },
  대기: { bg: "#FEF3C7", color: "#92400E" },
  검토중: { bg: "#FEF3C7", color: "#92400E" },
  승인대기: { bg: "#FEF3C7", color: "#92400E" },
  검수요청: { bg: "#FEF3C7", color: "#92400E" },
  견적접수: { bg: "#FEF3C7", color: "#92400E" },
  미지급: { bg: "#FEE2E2", color: "#991B1B" },
  일부지급: { bg: "#FEF3C7", color: "#92400E" },
  승인: { bg: "#D1FAE5", color: "#065F46" },
  // 영문 상태명 추가
  DRAFT: { bg: "#F3F4F6", color: "#374151" },
  SUBMITTED: { bg: "#DBEAFE", color: "#1E40AF" },
  ACTIVE: { bg: "#D1FAE5", color: "#065F46" },
  IN_PROGRESS: { bg: "#DBEAFE", color: "#1E40AF" },
  FAILED: { bg: "#FEE2E2", color: "#991B1B" },
  CLOSED: { bg: "#E5E7EB", color: "#374151" },
  CANCELLED: { bg: "#FEE2E2", color: "#7F1D1D" },
  SYNCED: { bg: "#D1FAE5", color: "#065F46" },
  PENDING: { bg: "#FEF3C7", color: "#92400E" },
  AWARDED: { bg: "#EDE9FE", color: "#5B21B6" },
  OPENED: { bg: "#DBEAFE", color: "#1E40AF" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_MAP[status] || { bg: "#f0f0f0", color: "#666" };
  return (
    <span
      style={{
        display: "inline-block",
        background: style.bg,
        color: style.color,
        borderRadius: "999px",
        padding: "2px 10px",
        fontSize: "12px",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}
