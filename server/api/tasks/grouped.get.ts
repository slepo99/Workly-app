import { getGroupedTasks } from "~~/server/services/grouped-tasks.service";
import {
  ROLE_GROUPS,
  type Role,
} from "~~/server/constants/roles";
import {
  TASK_STATUSES,
  type TaskStatus,
} from "~~/server/constants/taskStatuses";
import {
  isTaskSort,
  type TaskSort,
} from "~~/server/constants/taskSort";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(
    event,
    ROLE_GROUPS.ALL,
  );

  const query = getQuery(event);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 5;

  const search =
    typeof query.search === "string"
      ? query.search.trim()
      : "";

  const rawStatus = query.status;

  const statuses = (
    Array.isArray(rawStatus)
      ? rawStatus
      : rawStatus
        ? [rawStatus]
        : []
  ).filter((status): status is TaskStatus =>
    Object.values(TASK_STATUSES).includes(
      status as TaskStatus,
    ),
  );

  const rawSort =
    typeof query.sort === "string"
      ? query.sort
      : "";

  const sort: TaskSort = isTaskSort(rawSort)
    ? rawSort
    : "updatedAt";

  const order: "asc" | "desc" =
    query.order === "asc" ? "asc" : "desc";

  return await getGroupedTasks(
    currentUser.id,
    currentUser.role as Role,
    page,
    limit,
    search,
    statuses,
    sort,
    order,
  );
});