"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useRole } from "@/lib/role";
import { ROLE_LABELS } from "@/lib/types";
import { MENUS } from "@/lib/menu";
import RoleSwitcher from "@/components/RoleSwitcher";
import { MOCK_NOTIFICATIONS } from "@/lib/mock/common";

interface HeaderProps { onMenuClick?: () => void; }

export default function Header({ onMenuClick }: HeaderProps) {
  const [role] = useRole();
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 48, background: "#ffffff",
      display: "flex", alignItems: "center", padding: "0 1.5rem 0 0", zIndex: 150, gap: 0,
      borderBottom: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    }}>
      {/* 햄버거 (모바일) */}
      <button
        className="lg:hidden"
        onClick={onMenuClick}
        style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666", padding: "0 0.75rem", height: "100%" }}
        aria-label="메뉴"
      >
        <span style={{ fontSize: 18 }}>☰</span>
      </button>

      {/* 로고 영역 (PMS GNB: 220px, 우측 보더, 로고만) */}
      <Link
        href={MENUS[role]?.[0]?.items?.[0]?.href ?? "/"}
        style={{
          width: 220, minWidth: 220, height: "100%",
          display: "flex", alignItems: "center", padding: "0 1.25rem",
          background: "#ffffff", borderRight: "1px solid #e5e7eb",
          textDecoration: "none", whiteSpace: "nowrap", gap: 0,
        }}
      >
        <Image src="/logo.svg" alt="KEPCO-ES 로고" width={140} height={32} style={{ objectFit: "contain", height: 32, width: "auto" }} priority unoptimized />
      </Link>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* 역할 스위처 */}
        <RoleSwitcher />

        {/* 알림 */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setShowNotif((v) => !v); setShowUser(false); }}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666", padding: 4, position: "relative" }}
            aria-label="알림"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%",
                background: "#dc3545", color: "#fff", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
              }}>
                {unreadCount}
              </span>
            )}
          </button>
          {showNotif && (
            <div style={{
              position: "absolute", top: 36, right: 0, width: 320, background: "#fff",
              border: "1px solid #e6ebf0", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 200,
            }}>
              <div style={{ padding: "10px 14px", fontWeight: 700, fontSize: 13, borderBottom: "1px solid #e6ebf0", background: "#f8f9fa" }}>
                알림 ({unreadCount}건)
              </div>
              {MOCK_NOTIFICATIONS.map((n) => (
                <div key={n.id} style={{ padding: "10px 14px", fontSize: 12, borderBottom: "1px solid #f0f0f0", color: n.read ? "#888" : "#222" }}>
                  <div style={{ fontWeight: n.read ? 400 : 700 }}>{n.message}</div>
                  <div style={{ color: "#aaa", fontSize: 11, marginTop: 2 }}>{n.createdAt}</div>
                </div>
              ))}
              <div style={{ padding: "10px 14px", textAlign: "center", fontSize: 12, color: "#00a7ea", cursor: "pointer" }}>
                전체 알림 보기
              </div>
            </div>
          )}
        </div>

        {/* 사용자 메뉴 */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setShowUser((v) => !v); setShowNotif(false); }}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#333", display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}
          >
            <User size={16} style={{ color: "#666" }} />
            <span>테스트{ROLE_LABELS[role]}님</span>
            <ChevronDown size={12} />
          </button>
          {showUser && (
            <div style={{
              position: "absolute", top: 36, right: 0, width: 160, background: "#fff",
              border: "1px solid #e6ebf0", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 200,
            }}>
              {[
                { label: "마이페이지", href: `/${role.toLowerCase()}/mypage/` },
                { label: "비밀번호 변경", href: "#" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setShowUser(false)}
                  style={{ display: "block", padding: "8px 14px", fontSize: 12, color: "#333", textDecoration: "none" }}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => setShowUser(false)}
                style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "8px 14px", fontSize: 12, color: "#654024", background: "#ffffff", border: "1px solid #CFCFCF", cursor: "pointer", borderTop: "1px solid #e6ebf0", fontFamily: "inherit" }}
              >
                <LogOut size={12} /> 로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
