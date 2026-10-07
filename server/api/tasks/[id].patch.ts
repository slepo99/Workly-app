import { getTaskById, updateTaskById } from "~~/server/services/tasks.service";
import { updateTaskSchema } from "~~/server/validation/tasks.schema";
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

  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task ID is required",
    });
  }

  const existingTask = await getTaskById(
    id,
    currentUser.id,
    currentUser.role as Role,
  );

  if (!existingTask) {
    throw createError({
      statusCode: 404,
      statusMessage: "Task not found",
    });
  }

  const body = await readBody(event);
  const data = updateTaskSchema.parse(body);

  const task = await updateTaskById(id, data);

  if (!task) {
    throw createError({
      statusCode: 404,
      statusMessage: "Task not found",
    });
  }

  return task;
});