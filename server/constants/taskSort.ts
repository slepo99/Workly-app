export const TASK_SORT_FIELDS = [
  "updatedAt",
  "createdAt",
  "startDate",
  "endDate",
  "title",
  "status",
] as const;

export type TaskSort = (typeof TASK_SORT_FIELDS)[number];

export function isTaskSort(value: string): value is TaskSort {
  return TASK_SORT_FIELDS.includes(value as TaskSort);
}