import { updateProjectMemberRole } from "~~/server/services/project-members.service";
import { updateProjectMemberRoleSchema } from "~~/server/validation/project-members.schema";
import { ROLE_GROUPS } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
  await requireRole(
    event,
    ROLE_GROUPS.MANAGEMENT,
  );

  const body = await readBody(event);

 const data = updateProjectMemberRoleSchema.parse(body);

  return await updateProjectMemberRole(data.projectId, data.userId, data.role);
});