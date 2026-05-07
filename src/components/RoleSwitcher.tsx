"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role";
import type { Role } from "@/lib/types";
import { ROLE_LABELS } from "@/lib/types";

const ROLES: Role[] = ["B", "V", "C", "A"];
const DASHBOARD_PATH: Record<Role, string> = {
  B: "/b/dashboard/",
  V: "/v/dashboard/",
  C: "/c/dashboard/",
  A: "/a/system/",
};

export default function RoleSwitcher() {
  const [role, setRole] = useRole();
  const router = useRouter();

  const handleRoleChange = (nextRole: Role) => {
    setRole(nextRole);
    router.push(DASHBOARD_PATH[nextRole]);
  };

  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {ROLES.map((r) => (
        <button
          key={r}
          onClick={() => handleRoleChange(r)}
          style={{
            padding: "2px 8px",
            fontSize: 11,
            height: 22,
            borderRadius: 4,
            border: r === role ? "1px solid #DFE8F0" : "1px solid #CFCFCF",
            background: r === role ? "#654024" : "#ffffff",
            color: r === role ? "#ffffff" : "#654024",
            cursor: "pointer",
            fontWeight: r === role ? 700 : 400,
            fontFamily: "inherit",
          }}
          title={ROLE_LABELS[r]}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
