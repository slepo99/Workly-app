import { removeTaskAssignee } from "~~/server/services/task-assignees.service";
import { getTaskById } from "~~/server/services/tasks.service";
import {
  ROLE_GROUPS,
  type Role,
} from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(
    event,
    ROLE_GROUPS.MANAGEMENT,
  );

  const taskId = getRouterParam(event, "taskId");
  const userId = getRouterParam(event, "userId");

  if (!taskId || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task ID and User ID are required",
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

  return removeTaskAssignee(taskId, userId);
});