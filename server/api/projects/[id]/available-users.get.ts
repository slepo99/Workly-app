import { getAvailableUsersByProjectId } from "~~/server/services/projects.service";
import { ROLE_GROUPS } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
  await requireRole(
    event,
    ROLE_GROUPS.MANAGEMENT,
  );

  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Project ID is required",
    });
  }

  return await getAvailableUsersByProjectId(id);
});