"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, ChevronDown } from "lucide-react";
import { useRole } from "@/lib/role";
import { ROLE_LABELS } from "@/lib/types";
import { getDefaultPath } from "@/lib/access";
import RoleSwitcher from "@/components/RoleSwitcher";
import ContractAuthoritySwitcher from "@/components/ContractAuthoritySwitcher";
import { MOCK_NOTIFICATIONS } from "@/lib/mock/common";

interface HeaderProps { onMenuClick?: () => void; }

const ROLE_DEPT: Record<string, string> = {
  B: "사업본부 개발팀",
  V: "협력업체 영업팀",
  C: "계약본부 계약1팀",
  A: "정보전략팀",
};

const SYSTEM_OPTIONS: { label: string; href: string }[] = [
  { label: "구매시스템 (SRM)", href: "#" },
  { label: "프로젝트관리 (PMS)", href: "#" },
  { label: "원가관리", href: "#" },
];

export default function Header({ onMenuClick }: HeaderProps) {
  const [role] = useRole();
  const [showNotif, setShowNotif] = useState(false);
  const [showSystem, setShowSystem] = useState(false);
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
  const myPageHref = role === "A" ? getDefaultPath(role) : role === "V" ? "/v/bid-history/" : `/${role.toLowerCase()}/mypage/`;
  const userName = `${ROLE_DEPT[role] ?? "조직"} 홍길동`;
  const initial = "H";

  // 외부 클릭 시 드롭다운 닫기
  const sysRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (sysRef.current && !sysRef.current.contains(e.target as Node)) setShowSystem(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: 80,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        padding: "0 1.5rem 0 0",
        zIndex: 150,
        gap: 0,
        borderBottom: "none",
      }}
    >
      {/* 로고 영역 (사이드바 너비와 동일) */}
      <Link
        href={getDefaultPath(role)}
        style={{
          width: 250, minWidth: 250, height: "100%",
          display: "flex", alignItems: "center", padding: "0 30px",
          background: "#ffffff", borderRight: "none",
          textDecoration: "none", whiteSpace: "nowrap", gap: 0,
        }}
      >
        <Image src="/logo.svg" alt="KEPCO ES" width={187} height={27} style={{ objectFit: "contain", width: 187, height: 27 }} priority unoptimized />
      </Link>


      <div style={{ flex: 1 }} />

      {/* 우측 영역 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* dev: 역할 / 계약권한 스위처 (작게) */}
        <RoleSwitcher />
        <ContractAuthoritySwitcher />

        {/* 업무시스템 이동 드롭다운 */}
        <div ref={sysRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => { setShowSystem((v) => !v); setShowNotif(false); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 36,
              padding: "0 14px",
              background: "#ffffff",
              border: "1px solid #E6D5B8",
              borderRadius: 999,
              fontSize: 13,
              color: "#654024",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
              minWidth: 160,
              justifyContent: "space-between",
            }}
          >
            <span>업무시스템 이동</span>
            <ChevronDown size={14} color="#654024" />
          </button>
          {showSystem && (
            <div
              style={{
                position: "absolute",
                top: 38,
                right: 0,
                minWidth: 180,
                background: "#fff",
                border: "1px solid #E8E8E8",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                zIndex: 200,
                overflow: "hidden",
              }}
            >
              {SYSTEM_OPTIONS.map((opt) => (
                <a
                  key={opt.label}
                  href={opt.href}
                  onClick={() => setShowSystem(false)}
                  style={{
                    display: "block",
                    padding: "10px 14px",
                    fontSize: 13,
                    color: "#1a1a1a",
                    textDecoration: "none",
                  }}
                >
                  {opt.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* 알림 (시안엔 없지만 dev/기능용 유지, 작게) */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => { setShowNotif((v) => !v); setShowSystem(false); }}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#6c757d",
              padding: 6,
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="알림"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 0, right: 0,
                  minWidth: 16, height: 16,
                  borderRadius: "50%",
                  background: "#dc3545",
                  color: "#fff",
                  fontSize: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  padding: "0 4px",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
          {showNotif && (
            <div
              style={{
                position: "absolute",
                top: 38, right: 0,
                width: 320,
                background: "#fff",
                border: "1px solid #E8E8E8",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                zIndex: 200,
              }}
            >
              <div style={{ padding: "10px 14px", fontWeight: 700, fontSize: 13, borderBottom: "1px solid #f0f0f0" }}>
                알림 ({unreadCount}건)
              </div>
              {MOCK_NOTIFICATIONS.map((n) => (
                <div key={n.id} style={{ padding: "10px 14px", fontSize: 12, borderBottom: "1px solid #f0f0f0", color: n.read ? "#888" : "#222" }}>
                  <div style={{ fontWeight: n.read ? 400 : 700 }}>{n.message}</div>
                  <div style={{ color: "#aaa", fontSize: 11, marginTop: 2 }}>{n.createdAt}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 사용자 배지: H 아바타 + 부서·이름 */}
        <Link
          href={myPageHref}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 36,
            padding: "0 14px 0 6px",
            background: "#FAF7F2",
            border: "1px solid #C9A87C",
            borderRadius: 999,
            color: "#654024",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 26, height: 26,
              borderRadius: "50%",
              background: "#D58040",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {initial}
          </span>
          <span>{userName} ({ROLE_LABELS[role]})</span>
        </Link>

        {/* 로그아웃 텍스트 링크 */}
        <Link
          href="/login/"
          style={{
            fontSize: 13,
            color: "#654024",
            fontWeight: 600,
            textDecoration: "none",
            padding: "0 4px",
          }}
        >
          로그아웃
        </Link>
      </div>
    </header>
  );
}
