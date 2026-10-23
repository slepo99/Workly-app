export const TASK_SORT_FIELDS = {
  UPDATED_AT: "updatedAt",
  CREATED_AT: "createdAt",
  START_DATE: "startDate",
  END_DATE: "endDate",
  TITLE: "title",
  STATUS: "status",
} as const;

export const TASK_SORT_ORDERS = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type TaskSort =
  (typeof TASK_SORT_FIELDS)[keyof typeof TASK_SORT_FIELDS];

export type TaskSortOrder =
  (typeof TASK_SORT_ORDERS)[keyof typeof TASK_SORT_ORDERS];