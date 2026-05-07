"use client";

import { useRouter } from "next/navigation";
import { useContractAuthority, useRole } from "@/lib/role";
import { CONTRACT_AUTHORITY_LABELS, type ContractAuthority } from "@/lib/types";

const AUTHORITIES: ContractAuthority[] = ["CONTRACT_MANAGER", "PRICE_REVIEWER"];

export default function ContractAuthoritySwitcher() {
  const [role] = useRole();
  const [authority, setAuthority] = useContractAuthority();
  const router = useRouter();

  if (role !== "C") return null;

  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {AUTHORITIES.map((item) => {
        const active = item === authority;
        return (
          <button
            key={item}
            onClick={() => {
              setAuthority(item);
              router.refresh();
            }}
            style={{
              padding: "3px 10px",
              fontSize: 14,
              borderRadius: 999,
              border: active ? "1px solid #0F766E" : "1px solid #CBD5E1",
              background: active ? "#CCFBF1" : "#fff",
              color: active ? "#115E59" : "#475569",
              cursor: "pointer",
              fontWeight: active ? 700 : 500,
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
            title={CONTRACT_AUTHORITY_LABELS[item]}
          >
            {CONTRACT_AUTHORITY_LABELS[item]}
          </button>
        );
      })}
    </div>
  );
}
