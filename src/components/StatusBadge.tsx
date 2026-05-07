import React from "react";

interface StatusBadgeProps {
  status: string;
}

const STATUS_MAP: Record<string, { bg: string; color: string }> = {
  // 한글 상태명 (PMS 팔레트)
  완료: { bg: "#d4edda", color: "#155724" },
  완납: { bg: "#d4edda", color: "#155724" },
  승인완료: { bg: "#d4edda", color: "#155724" },
  검수완료: { bg: "#d4edda", color: "#155724" },
  진행중: { bg: "#cce5ff", color: "#004085" },
  결재중: { bg: "#cce5ff", color: "#004085" },
  검수중: { bg: "#cce5ff", color: "#004085" },
  소싱중: { bg: "#cce5ff", color: "#004085" },
  투입중: { bg: "#cce5ff", color: "#004085" },
  계약중: { bg: "#cce5ff", color: "#004085" },
  반려: { bg: "#f8d7da", color: "#721c24" },
  대기: { bg: "#fff3cd", color: "#856404" },
  검토중: { bg: "#fff3cd", color: "#856404" },
  승인대기: { bg: "#fff3cd", color: "#856404" },
  검수요청: { bg: "#fff3cd", color: "#856404" },
  견적접수: { bg: "#fff3cd", color: "#856404" },
  미지급: { bg: "#f8d7da", color: "#721c24" },
  일부지급: { bg: "#fff3cd", color: "#856404" },
  승인: { bg: "#d4edda", color: "#155724" },
  // 영문 상태명
  DRAFT: { bg: "#e2e3e5", color: "#383d41" },
  SUBMITTED: { bg: "#cce5ff", color: "#004085" },
  ACTIVE: { bg: "#d4edda", color: "#155724" },
  IN_PROGRESS: { bg: "#cce5ff", color: "#004085" },
  FAILED: { bg: "#f8d7da", color: "#721c24" },
  CLOSED: { bg: "#e2e3e5", color: "#383d41" },
  CANCELLED: { bg: "#f8d7da", color: "#7f1d1d" },
  SYNCED: { bg: "#d4edda", color: "#155724" },
  PENDING: { bg: "#fff3cd", color: "#856404" },
  AWARDED: { bg: "#ede9fe", color: "#5b21b6" },
  OPENED: { bg: "#cce5ff", color: "#004085" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_MAP[status] || { bg: "#e2e3e5", color: "#383d41" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: style.bg,
        color: style.color,
        borderRadius: 9999,
        padding: "2px 8px",
        fontSize: "11px",
        fontWeight: 700,
        whiteSpace: "nowrap",
        lineHeight: 1.4,
      }}
    >
      {status}
    </span>
  );
}
