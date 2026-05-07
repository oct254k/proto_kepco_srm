"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useRole } from "@/lib/role";
import { MENUS } from "@/lib/menu";

interface SidebarProps { isOpen: boolean; onClose: () => void; }

const ACTIVE_BG = "#D58040";
const HOVER_BG = "#fae6d4";
const ACTIVE_FG = "#ffffff";
const HOVER_FG = "#654024";
const REST_FG = "#555555";
const ITEM_RADIUS = 20;

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [role] = useRole();
  const groups = MENUS[role];
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(groups.map((g) => g.label))
  );

  function toggleGroup(label: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  const activeHref = useMemo(() => {
    const allHrefs = groups.flatMap((g) =>
      g.items.map((i) => i.href.replace(/\/$/, "")).filter((h): h is string => Boolean(h))
    );
    const cleanPath = pathname.replace(/\/$/, "");
    return allHrefs
      .filter((h) => cleanPath === h || cleanPath.startsWith(h + "/"))
      .sort((a, b) => b.length - a.length)[0];
  }, [pathname, groups]);

  const isActive = (href: string) => href.replace(/\/$/, "") === activeHref;

  function renderItemLink(href: string, label: string, depth: 1 | 2) {
    const active = isActive(href);
    const basePadding = depth === 1
      ? "0.5rem 1rem 0.5rem 1rem"
      : "0.5rem 1rem 0.5rem 2.5rem";
    return (
      <Link
        key={href}
        href={href}
        onClick={onClose}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: basePadding,
          margin: "2px 0.5rem",
          borderRadius: ITEM_RADIUS,
          fontSize: depth === 1 ? 15 : 14,
          color: active ? ACTIVE_FG : REST_FG,
          background: active ? ACTIVE_BG : "transparent",
          textDecoration: "none",
          fontWeight: active ? 700 : 400,
          transition: "background-color 0.12s ease, color 0.12s ease",
        }}
        onMouseEnter={(e) => {
          if (!active) {
            (e.currentTarget as HTMLAnchorElement).style.background = HOVER_BG;
            (e.currentTarget as HTMLAnchorElement).style.color = HOVER_FG;
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            (e.currentTarget as HTMLAnchorElement).style.color = REST_FG;
          }
        }}
      >
        {label}
      </Link>
    );
  }

  return (
    <aside
      className={[
        "fixed left-0 bottom-0 w-[220px] bg-white border-r overflow-y-auto z-40",
        "transition-transform duration-200",
        "lg:sticky lg:shrink-0 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
      style={{
        top: 48,
        height: "calc(100vh - 48px)",
        borderRightColor: "#e6ebf0",
      }}
    >
      <nav style={{ padding: "0.25rem 0" }}>
        {groups.map((group) => {
          const isLeaf = group.items.length === 1;

          // 단일 항목 그룹 → 그룹 라벨로 직접 네비게이션 (chevron 없음)
          if (isLeaf) {
            return (
              <div key={group.label}>
                {renderItemLink(group.items[0].href, group.label, 1)}
              </div>
            );
          }

          // 다중 항목 그룹 → 토글 가능한 그룹 헤더 + 자식 링크
          const open = openGroups.has(group.label);
          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "calc(100% - 1rem)",
                  margin: "2px 0.5rem",
                  padding: "0.5rem 1rem",
                  fontSize: 15,
                  fontWeight: 400,
                  color: REST_FG,
                  background: "transparent",
                  border: "none",
                  borderRadius: ITEM_RADIUS,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  userSelect: "none",
                  transition: "background-color 0.12s ease, color 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = HOVER_BG;
                  (e.currentTarget as HTMLButtonElement).style.color = HOVER_FG;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = REST_FG;
                }}
              >
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span style={{ flex: 1 }}>{group.label}</span>
              </button>
              {open && (
                <div>
                  {group.items.map((item) => renderItemLink(item.href, item.label, 2))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
