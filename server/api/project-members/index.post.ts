import { createProjectMembers } from "~~/server/services/project-members.service";
import { createProjectMemberSchema } from "~~/server/validation/project-members.schema";
import { ROLE_GROUPS } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
  await requireRole(
    event,
    ROLE_GROUPS.MANAGEMENT,
  );

  const body = await readBody(event);

  const data = createProjectMemberSchema.parse(body);

  return await createProjectMembers(data);
});