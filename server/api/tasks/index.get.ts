import { getTasks } from "~~/server/services/tasks.service";
import { ROLE_GROUPS, type Role } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";
export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(event, ROLE_GROUPS.ALL);
  return await getTasks(
    currentUser.id,
    currentUser.role as Role,
  )
});
