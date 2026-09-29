import { updateUserById } from "~~/server/services/users.service";
import { updateUserSchema } from "~~/server/validation/users.schema";
import { ROLE_GROUPS, ROLES } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(event, ROLE_GROUPS.ALL);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }
  const canUpdate =
    currentUser.id === id ||
    currentUser.role === ROLES.ADMIN ||
    currentUser.role === ROLES.SUPERADMIN;
    
  if (canUpdate) {
    const body = await readBody(event);
    const data = updateUserSchema.parse(body);

    const user = await updateUserById(id, data);

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    return user;
  } else {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }
});
