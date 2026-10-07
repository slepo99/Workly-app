import { getTaskById } from "~~/server/services/tasks.service";
import { ROLE_GROUPS, type Role } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(event, ROLE_GROUPS.ALL);

  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task ID is required",
    });
  }

  const task = await getTaskById(id, currentUser.id, currentUser.role as Role);

  if (!task) {
    throw createError({
      statusCode: 404,
      statusMessage: "Task not found",
    });
  }

  return task;
});
