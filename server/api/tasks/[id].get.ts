import { getTaskById } from "~~/server/services/tasks.service";
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task ID is required",
    });
  }

  const task = await getTaskById(id);

  if (!task) {
    throw createError({
      statusCode: 404,
      statusMessage: "Task not found",
    });
  }
  return task
});
