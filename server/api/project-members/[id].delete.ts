import { deleteProjectMember } from "~~/server/services/project-members.service";
import { type Role, ROLE_GROUPS } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(
    event,
    ROLE_GROUPS.MANAGEMENT,
  );

  const memberId = getRouterParam(event, "id");

  if (!memberId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Project member ID is required",
    });
  }

  return await deleteProjectMember(
    memberId,
    currentUser.id,
    currentUser.role as Role,
  );
});