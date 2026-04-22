"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useRole } from "@/lib/role";
import { ROLE_LABELS } from "@/lib/types";
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
      position: "fixed", top: 0, left: 0, right: 0, height: 56, background: "#fff",
      display: "flex", alignItems: "center", padding: "0 20px", zIndex: 100, gap: 16,
      borderBottom: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      {/* 햄버거 (모바일) */}
      <button
        className="lg:hidden"
        onClick={onMenuClick}
        style={{ background: "transparent", border: "none", cursor: "pointer", color: "#555", padding: 4 }}
        aria-label="메뉴"
      >
        <span style={{ fontSize: 23 }}>☰</span>
      </button>

      {/* 로고 */}
      <Link href={`/${role.toLowerCase()}/dashboard/`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", whiteSpace: "nowrap" }}>
        <Image src="/logo.png" alt="KEPCO-ES 로고" width={95} height={25} style={{ objectFit: "contain" }} priority />
        <span style={{ color: "#333", fontWeight: 600, fontSize: 18 }}>구매시스템</span>
      </Link>

      <div style={{ flex: 1 }} />

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        {/* 역할 스위처 */}
        <RoleSwitcher />

        {/* 알림 */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setShowNotif((v) => !v); setShowUser(false); }}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#555", padding: 4, position: "relative" }}
            aria-label="알림"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 0, right: 0, width: 16, height: 16, borderRadius: "50%",
                background: "#f00", color: "#fff", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
              }}>
                {unreadCount}
              </span>
            )}
          </button>
          {showNotif && (
            <div style={{
              position: "absolute", top: 44, right: 0, width: 320, background: "#fff",
              borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 200,
            }}>
              <div style={{ padding: "12px 16px", fontWeight: 700, fontSize: 17, borderBottom: "1px solid #eee" }}>
                🔔 알림 ({unreadCount}건)
              </div>
              {MOCK_NOTIFICATIONS.map((n) => (
                <div key={n.id} style={{ padding: "10px 16px", fontSize: 16, borderBottom: "1px solid #f0f0f0", color: n.read ? "#888" : "#222" }}>
                  <div style={{ fontWeight: n.read ? 400 : 600 }}>{n.message}</div>
                  <div style={{ color: "#aaa", fontSize: 15, marginTop: 2 }}>{n.createdAt}</div>
                </div>
              ))}
              <div style={{ padding: "10px 16px", textAlign: "center", fontSize: 16, color: "#01ACC8", cursor: "pointer" }}>
                전체 알림 보기
              </div>
            </div>
          )}
        </div>

        {/* 사용자 메뉴 */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setShowUser((v) => !v); setShowNotif(false); }}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "#333", display: "flex", alignItems: "center", gap: 4, fontSize: 16 }}
          >
            <User size={18} />
            <span>테스트{ROLE_LABELS[role]}님</span>
            <ChevronDown size={14} />
          </button>
          {showUser && (
            <div style={{
              position: "absolute", top: 44, right: 0, width: 160, background: "#fff",
              borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 200,
            }}>
              {[
                { label: "마이페이지", href: `/${role.toLowerCase()}/mypage/` },
                { label: "비밀번호 변경", href: "#" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setShowUser(false)}
                  style={{ display: "block", padding: "10px 16px", fontSize: 16, color: "#333", textDecoration: "none" }}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => setShowUser(false)}
                style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "10px 16px", fontSize: 16, color: "#e53e3e", background: "transparent", border: "none", cursor: "pointer", borderTop: "1px solid #eee", fontFamily: "inherit" }}
              >
                <LogOut size={14} /> 로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
