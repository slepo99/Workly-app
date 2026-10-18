import { ROLE_GROUPS, Role } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";
import { getUsers } from "~~/server/services/users.service";

export default defineEventHandler(async (event) => {
  await requireRole(event, ROLE_GROUPS.MANAGEMENT);
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const search = typeof query.search === "string" ? query.search.trim() : "";
  return await getUsers(page, limit, search);
});
