import { getUserById } from "~~/server/services/users.service";
import { ROLE_GROUPS } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
  await requireRole(event, ROLE_GROUPS.ALL);

  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }

  const user = await getUserById(id);

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  return user;
});