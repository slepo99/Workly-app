import { getTasksByUserId } from "~~/server/services/tasks.service";
import { requireRole } from "~~/server/utils/requireRole";
import { ROLE_GROUPS } from "~~/server/constants/roles";

export default defineEventHandler(async (event) => {
  await requireRole(event, ROLE_GROUPS.ALL);

const userId = getRouterParam(event, "id");

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }

  const query = getQuery(event);
  const limit = query.limit ? Number(query.limit) : undefined;

  if (
    limit !== undefined &&
    (!Number.isInteger(limit) || limit < 1 || limit > 100)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid limit",
    });
  }

  return await getTasksByUserId(userId, limit);
});