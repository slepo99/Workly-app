import { getGroupedTasksByUserId } from "~~/server/services/grouped-tasks.service";
import { ROLE_GROUPS, type Role } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(
    event,
    ROLE_GROUPS.ALL,
  );

  const targetUserId = getRouterParam(event, "id");

  if (!targetUserId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }

  const query = getQuery(event);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 5;

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid pagination parameters",
    });
  }

  return await getGroupedTasksByUserId(
    targetUserId,
    currentUser.id,
    currentUser.role as Role,
    page,
    limit,
  );
});