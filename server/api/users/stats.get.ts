import { ROLE_GROUPS, Role } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";
import { getUsersStats } from "~~/server/services/users.service";

export default defineEventHandler(async (event) => {
  await requireRole(event, ROLE_GROUPS.MANAGEMENT);

  return await getUsersStats();
});
