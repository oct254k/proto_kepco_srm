import type { Role } from "./types";

const DEFAULT_PATHS: Record<Role, string> = {
  B: "/b/dashboard/",
  V: "/v/dashboard/",
  C: "/c/dashboard/",
  A: "/a/system/",
};

const PATH_ROLE_MAP: Array<{ prefix: string; role: Role }> = [
  { prefix: "/b/", role: "B" },
  { prefix: "/v/", role: "V" },
  { prefix: "/c/", role: "C" },
  { prefix: "/a/", role: "A" },
];

export function getDefaultPath(role: Role) {
  return DEFAULT_PATHS[role];
}

export function getRequiredRoleForPath(pathname: string): Role | null {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const matched = PATH_ROLE_MAP.find(({ prefix }) => normalized.startsWith(prefix));
  return matched?.role ?? null;
}

export function canAccessPath(role: Role, pathname: string) {
  const requiredRole = getRequiredRoleForPath(pathname);
  if (!requiredRole) return true;
  return requiredRole === role;
}
