export const ROLES = [
  "customer",
  "captain",
  "player",
  "facilitator",
  "content_editor",
  "admin",
  "super_admin",
] as const;

export type Role = (typeof ROLES)[number];

export const ADMIN_ROLES: Role[] = ["admin", "super_admin", "content_editor", "facilitator"];

export function isAdminRole(role?: string | null): boolean {
  return !!role && ADMIN_ROLES.includes(role as Role);
}
