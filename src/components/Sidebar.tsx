"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useRole } from "@/lib/role";
import { MENUS } from "@/lib/menu";

interface SidebarProps { isOpen: boolean; onClose: () => void; }

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
      <nav>
        {groups.map((group) => {
          const open = openGroups.has(group.label);
          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "0.625rem 1rem",
                  fontSize: 15,
                  fontWeight: 400,
                  color: "#654024",
                  background: "#ffffff",
                  border: "1px solid #CFCFCF",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#ebeef2"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f5f7fa"; }}
              >
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span>{group.label}</span>
              </button>
              {open && (
                <div>
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 1rem 0.5rem 2.5rem",
                          margin: "2px 0.5rem",
                          borderRadius: active ? 20 : 4,
                          fontSize: 14,
                          color: active ? "#ffffff" : "#555555",
                          background: active ? "#D58040" : "transparent",
                          textDecoration: "none",
                          fontWeight: active ? 700 : 400,
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            (e.currentTarget as HTMLAnchorElement).style.background = "#f0f4f8";
                            (e.currentTarget as HTMLAnchorElement).style.color = "#1a1a1a";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                            (e.currentTarget as HTMLAnchorElement).style.color = "#555555";
                          }
                        }}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
              <div style={{ height: 1, background: "#e6ebf0", margin: "0.25rem 0" }} />
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
