"use client";

import Link from "next/link";
import { getDefaultPath } from "@/lib/access";
import { useRole } from "@/lib/role";
import { ROLE_LABELS } from "@/lib/types";

export default function ForbiddenView() {
  const [role] = useRole();

  return (
    <div
      style={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 16,
          padding: "40px 36px",
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700, color: "#DC2626", marginBottom: 8 }}>403 접근 제한</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
          현재 역할로는 이 화면에 접근할 수 없습니다.
        </div>
        <div style={{ fontSize: 16, color: "#4B5563", lineHeight: 1.6, marginBottom: 20 }}>
          메뉴를 숨기는 것만으로는 충분하지 않아 직접 URL 접근도 차단했습니다.
          현재 시연 역할은 <strong>{ROLE_LABELS[role]}</strong>입니다.
        </div>
        <div
          style={{
            background: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            padding: "14px 16px",
            fontSize: 15,
            color: "#374151",
            marginBottom: 20,
          }}
        >
          고객사 요구사항 강조포인트: 권한 없는 사용자가 직접 주소를 입력해도 업무 화면에 진입하지 못하도록 표현합니다.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href={getDefaultPath(role)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#01ACC8",
              color: "#fff",
              borderRadius: 8,
              padding: "10px 16px",
              fontSize: 16,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            내 역할 홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
