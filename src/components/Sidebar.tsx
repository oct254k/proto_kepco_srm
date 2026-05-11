"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, LayoutDashboard, Users, Building2, Database, Settings, ChevronRight } from "lucide-react";
import type { LucideProps } from "lucide-react";

import { useRole } from "@/lib/role";
import {
  MENUS,
  isMenuItemActive,
  isMenuLeafActive,
  type GroupMenuItem,
  type MenuIconName,
  type MenuItem,
} from "@/lib/menu";

const LUCIDE_FALLBACK: Partial<Record<MenuIconName, React.ComponentType<LucideProps>>> = {
  LayoutDashboard,
  Users,
  Building2,
  Database,
  Settings,
};

interface SidebarProps { isOpen: boolean; onClose: () => void; }

const SVG_ICON_MAP: Partial<Record<MenuIconName, string>> = {
  Receipt: "/icons/lnb/icon-quote.svg",
  Package: "/icons/lnb/icon-order.svg",
  Gavel: "/icons/lnb/icon-bid.svg",
  ClipboardCheck: "/icons/lnb/icon-eval.svg",
  Trophy: "/icons/lnb/icon-award.svg",
  FileSignature: "/icons/lnb/icon-contract.svg",
  CircleUser: "/icons/lnb/icon-mypage.svg",
  Settings: "/icons/lnb/icon-system.svg",
};

const ACTIVE_BG = "#D58040";
const ACTIVE_FG = "#ffffff";
const REST_FG = "#3B414E";
const HOVER_BG = "#FFF3E8";
const SUB_FG = "#483930";
const SEARCH_BG = "#F9F9F9";

function MenuIcon({ icon, active }: { icon: MenuIconName; active: boolean }) {
  const svgSrc = SVG_ICON_MAP[icon];
  if (svgSrc) {
    return (
      <Image
        src={svgSrc}
        width={24}
        height={24}
        alt=""
        unoptimized
        style={{
          filter: active ? "brightness(0) invert(1)" : "none",
          flexShrink: 0,
        }}
      />
    );
  }

  const FallbackIcon = LUCIDE_FALLBACK[icon];
  return FallbackIcon ? (
    <FallbackIcon
      size={24}
      strokeWidth={2}
      color={active ? ACTIVE_FG : REST_FG}
      style={{ flexShrink: 0 }}
    />
  ) : null;
}

function GroupLeaves({ item, pathname, onClose }: { item: GroupMenuItem; pathname: string; onClose: () => void }) {
  return (
    <div>
      {item.items.map((leaf) => {
        const active = isMenuLeafActive(item, pathname, leaf.href);
        return (
          <Link
            key={leaf.href}
            href={leaf.href}
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 20px",
              height: 40,
              fontSize: 14,
              fontWeight: active ? 700 : 400,
              color: SUB_FG,
              textDecoration: "none",
            }}
          >
            <span
              aria-hidden
              style={{
                flexShrink: 0,
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: active ? 1 : 0,
              }}
            >
              <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
                <path d="M1 1L7 5L1 9" fill="#483930" />
              </svg>
            </span>
            {leaf.label}
          </Link>
        );
      })}
    </div>
  );
}

function MenuRenderer({ item, pathname, onClose }: { item: MenuItem; pathname: string; onClose: () => void }) {
  const active = isMenuItemActive(item, pathname);
  const showLeaves = item.type === "group";

  return (
    <div style={{ marginBottom: 5 }}>
      {item.divider && (
        <div aria-hidden style={{ height: 1, background: "#E7EBEF", margin: "8px 0" }} />
      )}

      <Link
        href={item.href}
        onClick={onClose}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "11px 16px 11px 18px",
          borderRadius: 360,
          fontSize: 16,
          fontWeight: 600,
          color: active ? ACTIVE_FG : REST_FG,
          background: active ? ACTIVE_BG : "transparent",
          textDecoration: "none",
          transition: "background 0.12s ease, color 0.12s ease",
        }}
        onMouseEnter={(event) => {
          if (!active) event.currentTarget.style.background = HOVER_BG;
        }}
        onMouseLeave={(event) => {
          if (!active) event.currentTarget.style.background = "transparent";
        }}
      >
        <MenuIcon icon={item.icon} active={active} />
        <span style={{ flex: 1 }}>{item.label}</span>
        {showLeaves ? <ChevronRight size={16} color={active ? ACTIVE_FG : REST_FG} style={{ flexShrink: 0 }} /> : null}
      </Link>

      {item.type === "group" ? <GroupLeaves item={item} pathname={pathname} onClose={onClose} /> : null}
    </div>
  );
}

function filterMenuItems(items: MenuItem[], query: string): MenuItem[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.reduce<MenuItem[]>((acc, item) => {
    const labelMatch = item.label.toLowerCase().includes(normalizedQuery);

    if (item.type === "single") {
      if (labelMatch) acc.push(item);
      return acc;
    }

    const matchingLeaves = item.items.filter((leaf) => leaf.label.toLowerCase().includes(normalizedQuery));
    if (!labelMatch && matchingLeaves.length === 0) {
      return acc;
    }

    acc.push(
      {
        ...item,
        items: labelMatch ? item.items : matchingLeaves,
      },
    );
    return acc;
  }, []);
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [role] = useRole();
  const items = MENUS[role];
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => filterMenuItems(items, query), [items, query]);

  return (
    <aside
      className={[
        "fixed left-0 bottom-0 z-40 overflow-y-auto",
        "transition-transform duration-200",
        "lg:sticky lg:shrink-0 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
      style={{
        top: 80,
        width: 250,
        minWidth: 250,
        height: "calc(100vh - 80px)",
        background: "#ffffff",
        borderRight: "none",
        padding: "40px 31px 0px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: 20 }}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="메뉴를 검색하세요."
          style={{
            width: "100%",
            height: 44,
            padding: "0 40px 0 14px",
            border: "1px solid #E6EAF1",
            borderRadius: 9999,
            background: SEARCH_BG,
            fontSize: 13,
            fontFamily: "inherit",
            color: "#1a1a1a",
            outline: "none",
          }}
        />
        <Search size={16} color="#8F95A9" style={{ position: "absolute", right: 10, pointerEvents: "none" }} />
      </div>

      <nav>
        {filteredItems.map((item) => (
          <MenuRenderer key={item.href} item={item} pathname={pathname} onClose={onClose} />
        ))}
      </nav>
    </aside>
  );
}
