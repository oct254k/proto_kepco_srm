"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search, LayoutDashboard, Users, Building2, Database, Settings,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

const LUCIDE_FALLBACK: Partial<Record<MenuIconName, React.ComponentType<LucideProps>>> = {
  LayoutDashboard,
  Users,
  Building2,
  Database,
  Settings,
};
import { useRole } from "@/lib/role";
import { MENUS, type MenuGroup, type MenuIconName } from "@/lib/menu";

interface SidebarProps { isOpen: boolean; onClose: () => void; }

const SVG_ICON_MAP: Partial<Record<MenuIconName, string>> = {
  Receipt:       "/icons/lnb/icon-quote.svg",
  Package:       "/icons/lnb/icon-order.svg",
  Gavel:         "/icons/lnb/icon-bid.svg",
  ClipboardCheck:"/icons/lnb/icon-eval.svg",
  Trophy:        "/icons/lnb/icon-award.svg",
  FileSignature: "/icons/lnb/icon-contract.svg",
  CircleUser:    "/icons/lnb/icon-mypage.svg",
  Settings:      "/icons/lnb/icon-system.svg",
};

const ACTIVE_BG   = "#D58040";
const ACTIVE_FG   = "#ffffff";
const REST_FG     = "#3B414E";
const HOVER_BG    = "#FFF3E8";
const SUB_ACTIVE_BG = "#FDF3EB";
const SUB_ACTIVE_FG = "#9A4A1A";

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [role] = useRole();
  const groups = MENUS[role];
  const [query, setQuery] = useState("");

  const cleanPath = pathname.replace(/\/$/, "");

  const isLeafActive = (href: string) => cleanPath === href.replace(/\/$/, "");
  const isGroupActive = (group: MenuGroup) => group.items.some((it) => isLeafActive(it.href));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (it) => it.label.toLowerCase().includes(q) || g.label.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.items.length > 0 || g.label.toLowerCase().includes(q));
  }, [groups, query]);

  return (
    <aside
      className={[
        "fixed left-0 bottom-0 z-40 overflow-y-auto",
        "transition-transform duration-200",
        "lg:sticky lg:shrink-0 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
      style={{
        top: 48,
        width: 220,
        minWidth: 220,
        height: "calc(100vh - 48px)",
        background: "#ffffff",
        borderRight: "1px solid #E8E8E8",
      }}
    >
      {/* 메뉴 검색 */}
      <div style={{ padding: "14px 12px 8px" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="메뉴를 검색하세요."
            style={{
              width: "100%",
              height: 34,
              padding: "0 34px 0 12px",
              border: "1px solid #E8E8E8",
              borderRadius: 6,
              background: "#fff",
              fontSize: 12,
              fontFamily: "inherit",
              color: "#1a1a1a",
              outline: "none",
            }}
          />
          <Search size={13} color="#9CA3AF" style={{ position: "absolute", right: 10, pointerEvents: "none" }} />
        </div>
      </div>

      {/* 메뉴 목록 */}
      <nav style={{ padding: "4px 10px 16px" }}>
        {filtered.map((group) => {
          const groupActive = isGroupActive(group);
          const svgSrc = SVG_ICON_MAP[group.icon];
          const hasMultipleItems = group.items.length > 1;

          return (
            <React.Fragment key={group.href}>
              {group.divider && (
                <div aria-hidden style={{ height: 1, background: "#E8E8E8", margin: "8px 4px" }} />
              )}

              <Link
                href={group.href}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  margin: "2px 0",
                  padding: "9px 12px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: groupActive ? 700 : 500,
                  color: groupActive ? ACTIVE_FG : REST_FG,
                  background: groupActive ? ACTIVE_BG : "transparent",
                  textDecoration: "none",
                  transition: "background 0.12s ease, color 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  if (!groupActive) (e.currentTarget as HTMLAnchorElement).style.background = HOVER_BG;
                }}
                onMouseLeave={(e) => {
                  if (!groupActive) (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                {svgSrc ? (
                  <Image
                    src={svgSrc}
                    width={18}
                    height={18}
                    alt=""
                    unoptimized
                    style={{
                      filter: groupActive ? "brightness(0) invert(1)" : "none",
                      flexShrink: 0,
                    }}
                  />
                ) : (() => {
                  const FallbackIcon = LUCIDE_FALLBACK[group.icon];
                  return FallbackIcon ? (
                    <FallbackIcon
                      size={18}
                      strokeWidth={groupActive ? 2.4 : 2}
                      color={groupActive ? ACTIVE_FG : REST_FG}
                      style={{ flexShrink: 0 }}
                    />
                  ) : null;
                })()}
                <span>{group.label}</span>
              </Link>

              {hasMultipleItems && (
                <div style={{ margin: "2px 0 4px" }}>
                  {group.items.map((sub) => {
                    const subActive = isLeafActive(sub.href);
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onClose}
                        style={{
                          display: "block",
                          margin: "1px 4px 1px 40px",
                          padding: "6px 12px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: subActive ? 700 : 400,
                          color: subActive ? SUB_ACTIVE_FG : "#6B7280",
                          background: subActive ? SUB_ACTIVE_BG : "transparent",
                          textDecoration: "none",
                        }}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </aside>
  );
}
