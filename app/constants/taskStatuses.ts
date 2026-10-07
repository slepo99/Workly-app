export const TASK_STATUSES = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const

export type TaskStatus =
  (typeof TASK_STATUSES)[keyof typeof TASK_STATUSES];