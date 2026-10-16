import { getTasks } from "~~/server/services/tasks.service";
import { ROLE_GROUPS, type Role } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";
import {
  isTaskSort,
  type TaskSort,
} from "~~/server/constants/taskSort";

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(event, ROLE_GROUPS.ALL);

  const query = getQuery(event);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  
   const sortParam =
    typeof query.sort === "string" ? query.sort : "updatedAt";

  const sort: TaskSort = isTaskSort(sortParam)
    ? sortParam
    : "updatedAt";

  return await getTasks(currentUser.id, currentUser.role as Role, page, limit, sort);
});
