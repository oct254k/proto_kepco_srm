"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  function isActive(href: string) {
    const clean = href.replace(/\/$/, "");
    return pathname === clean || pathname === href;
  }

  return (
    <aside
      className={[
        "fixed top-14 left-0 bottom-0 w-[220px] bg-white border-r border-[#e0e0e0] overflow-y-auto z-40",
        "transition-transform duration-200",
        "lg:sticky lg:top-14 lg:h-[calc(100vh-56px)] lg:shrink-0 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
    >
      <nav>
        {groups.map((group) => {
          const open = openGroups.has(group.label);
          return (
            <div key={group.label} style={{ borderBottom: "1px solid #eee" }}>
              <button
                onClick={() => toggleGroup(group.label)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "10px 16px", fontSize: 17, fontWeight: 600,
                  color: open ? "#fff" : "#333",
                  background: open ? "#01ACC8" : "transparent",
                  border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                }}
              >
                <span>{group.label}</span>
                <span style={{ fontSize: 17 }}>{open ? "−" : "+"}</span>
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
                          display: "block", padding: "8px 16px 8px 24px", fontSize: 16,
                          color: active ? "#01ACC8" : "#444",
                          background: active ? "#f0f8fb" : "transparent",
                          textDecoration: "none",
                          borderLeft: active ? "3px solid #01ACC8" : "3px solid transparent",
                          fontWeight: active ? 600 : 400,
                        }}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
