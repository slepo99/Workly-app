export const ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  MANAGER: "manager",
  WORKER: "worker",
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export const ROLE_GROUPS = {
  SUPERADMINS: [ROLES.SUPERADMIN],
  ADMINS: [ROLES.SUPERADMIN, ROLES.ADMIN],
  MANAGEMENT: [
    ROLES.SUPERADMIN,
    ROLES.ADMIN,
    ROLES.MANAGER,
  ],
  ALL: [
    ROLES.SUPERADMIN,
    ROLES.ADMIN,
    ROLES.MANAGER,
    ROLES.WORKER,
  ],
} as const

export const ROLE_ASSIGNMENTS: Record<Role, readonly Role[]> = {
  [ROLES.SUPERADMIN]: [
    ROLES.ADMIN,
    ROLES.MANAGER,
    ROLES.WORKER,
  ],

  [ROLES.ADMIN]: [
    ROLES.MANAGER,
    ROLES.WORKER,
  ],

  [ROLES.MANAGER]: [
    ROLES.WORKER,
  ],

  [ROLES.WORKER]: [],
}