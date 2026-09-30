export const PROJECT_STATUSES = {
  ACTIVE: "active",
  COMPLETED: "completed",
  ON_HOLD: "on-hold",
} as const;

export type ProjectStatus =
  (typeof PROJECT_STATUSES)[keyof typeof PROJECT_STATUSES];