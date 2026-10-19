import { deleteUserById } from "~~/server/services/users.service";
import { ROLE_GROUPS } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(event, ROLE_GROUPS.MANAGEMENT);
  const id = getRouterParam(event, "id");
  if(currentUser.id === id) {
    throw createError({
      statusCode: 400,
      statusMessage: "User cannot delete himself",
    });
  }
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }

  const user = await deleteUserById(id);

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  return user;
});
