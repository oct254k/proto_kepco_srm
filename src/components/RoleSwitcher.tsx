"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/role";
import { getDefaultPath } from "@/lib/access";
import type { Role } from "@/lib/types";
import { ROLE_LABELS } from "@/lib/types";

const ROLES: Role[] = ["B", "V", "C", "A"];

export default function RoleSwitcher() {
  const [role, setRole] = useRole();
  const router = useRouter();

  const handleRoleChange = (nextRole: Role) => {
    setRole(nextRole);
    router.push(getDefaultPath(nextRole));
  };

  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {ROLES.map((r) => (
        <button
          key={r}
          onClick={() => handleRoleChange(r)}
          style={{
            padding: "3px 10px",
            fontSize: 15,
            borderRadius: 4,
            border: r === role ? "1px solid #01ACC8" : "1px solid #ccc",
            background: r === role ? "#01ACC8" : "#fff",
            color: r === role ? "#fff" : "#555",
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
