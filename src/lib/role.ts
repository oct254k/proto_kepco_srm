"use client";
import { useSyncExternalStore } from "react";
import type { Role } from "./types";

const STORAGE_KEY = "srm_role";
const DEFAULT_ROLE: Role = "B";

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
