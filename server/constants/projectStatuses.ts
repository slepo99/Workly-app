export const PROJECT_STATUSES = {
  ACTIVE: "active",
  ON_HOLD: "on_hold",
  COMPLETED: "completed",
} as const

export type ProjectStatus =
  typeof PROJECT_STATUSES[keyof typeof PROJECT_STATUSES]