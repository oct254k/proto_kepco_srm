"use client";
import { useSyncExternalStore } from "react";
import type { ContractAuthority, Role } from "./types";

const STORAGE_KEY = "srm_role";
const CONTRACT_AUTHORITY_KEY = "srm_contract_authority";
const DEFAULT_ROLE: Role = "B";
const DEFAULT_CONTRACT_AUTHORITY: ContractAuthority = "CONTRACT_MANAGER";

function getSnapshot(): Role {
  if (typeof window === "undefined") return DEFAULT_ROLE;
  return (localStorage.getItem(STORAGE_KEY) as Role) || DEFAULT_ROLE;
}

function getServerSnapshot(): Role { return DEFAULT_ROLE; }

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("srm-role-change", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("srm-role-change", cb);
  };
}

export function setRole(role: Role) {
  localStorage.setItem(STORAGE_KEY, role);
  window.dispatchEvent(new Event("srm-role-change"));
}

export function useRole(): [Role, (r: Role) => void] {
  const role = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return [role, setRole];
}

function getContractAuthoritySnapshot(): ContractAuthority {
  if (typeof window === "undefined") return DEFAULT_CONTRACT_AUTHORITY;
  return (localStorage.getItem(CONTRACT_AUTHORITY_KEY) as ContractAuthority) || DEFAULT_CONTRACT_AUTHORITY;
}

function getContractAuthorityServerSnapshot(): ContractAuthority {
  return DEFAULT_CONTRACT_AUTHORITY;
}

export function setContractAuthority(authority: ContractAuthority) {
  localStorage.setItem(CONTRACT_AUTHORITY_KEY, authority);
  window.dispatchEvent(new Event("srm-role-change"));
}

export function useContractAuthority(): [ContractAuthority, (authority: ContractAuthority) => void] {
  const authority = useSyncExternalStore(
    subscribe,
    getContractAuthoritySnapshot,
    getContractAuthorityServerSnapshot,
  );
  return [authority, setContractAuthority];
}
