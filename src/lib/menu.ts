import type { Role } from "./types";
import type { MenuIconName, MenuItem, MenuLeaf, RoleMenuMap } from "./menu-types";
import { roleAMenu, roleBMenu, roleCMenu, roleVMenu } from "./menus";

export type { MenuIconName, MenuItem, MenuLeaf } from "./menu-types";
export { roleAMenu, roleBMenu, roleCMenu, roleVMenu } from "./menus";

export const MENUS: RoleMenuMap = {
  B: roleBMenu,
  V: roleVMenu,
  C: roleCMenu,
  A: roleAMenu,
};

function stripQuery(pathname: string) {
  return pathname.split("?")[0].split("#")[0];
}

export function normalizePath(pathname: string) {
  const path = stripQuery(pathname);
  if (path === "/") return path;
  return path.replace(/\/$/, "");
}

export function isPathMatch(currentPath: string, targetPath: string) {
  const current = normalizePath(currentPath);
  const target = normalizePath(targetPath);
  return current === target || current.startsWith(`${target}/`);
}

export function getMenuLeaves(menu: MenuItem): MenuLeaf[] {
  return menu.type === "group" ? menu.items : [{ label: menu.label, href: menu.href }];
}

export function isMenuActive(menu: MenuItem, pathname: string) {
  return isPathMatch(pathname, menu.href) || getMenuLeaves(menu).some((leaf) => isPathMatch(pathname, leaf.href));
}

export function findMenuMatch(role: Role, pathname: string) {
  for (const menu of MENUS[role]) {
    const matchedLeaf = getMenuLeaves(menu).find((leaf) => isPathMatch(pathname, leaf.href));

    if (matchedLeaf) {
      return { menu, leaf: matchedLeaf };
    }

    if (isPathMatch(pathname, menu.href)) {
      return {
        menu,
        leaf: menu.type === "single" ? { label: menu.label, href: menu.href } : undefined,
      };
    }
  }

  return null;
}

export function getMenuLabel(role: Role, pathname: string): string | null {
  const match = findMenuMatch(role, pathname);
  if (!match) return null;
  if (match.menu.type === "group") return match.leaf?.label ?? match.menu.label;
  return match.menu.label;
}

export function getRoleMenuLabels(role: Role): string[] {
  return MENUS[role].flatMap((menu) => [menu.label, ...getMenuLeaves(menu).map((leaf) => leaf.label)]);
}

export function getAllMenuLabels(): string[] {
  return Array.from(new Set((Object.keys(MENUS) as Role[]).flatMap((role) => getRoleMenuLabels(role))));
}

export function getBreadcrumb(role: Role, pathname: string): string[] {
  const match = findMenuMatch(role, pathname);
  if (!match) return [];

  if (match.menu.type === "group") {
    if (match.leaf && match.leaf.label !== match.menu.label) {
      return [match.menu.label, match.leaf.label];
    }
    return [match.menu.label];
  }

  return [match.menu.label];
}
