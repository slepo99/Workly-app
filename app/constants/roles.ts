export const ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  MANAGER: "manager",
  WORKER: "worker",
} as const;
export type ROLE = (typeof ROLES)[keyof typeof ROLES];