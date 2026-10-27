import { getUserPersonalStats } from "~~/server/services/users.service";
import { ROLE_GROUPS, type Role } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
    await requireRole(event, ROLE_GROUPS.ALL);
  const userId = getRouterParam(event, "id");

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }

  return getUserPersonalStats(userId);
});
