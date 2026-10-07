import { getProjectMembers } from "~~/server/services/project-members.service";
import { ROLE_GROUPS } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
  await requireRole(event, ROLE_GROUPS.ADMINS);

  return await getProjectMembers();
});