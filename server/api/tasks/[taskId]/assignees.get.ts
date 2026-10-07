import { getTaskById } from "~~/server/services/tasks.service";
import { ROLE_GROUPS, type Role } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(
    event,
    ROLE_GROUPS.ALL,
  );

  const taskId = getRouterParam(event, "taskId");

  if (!taskId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task ID is required",
    });
  }

  const task = await getTaskById(
    taskId,
    currentUser.id,
    currentUser.role as Role,
  );

  if (!task) {
    throw createError({
      statusCode: 404,
      statusMessage: "Task not found",
    });
  }

  return task.assignees;
});