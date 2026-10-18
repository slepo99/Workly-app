import { db } from "~~/server/db";
import { users } from "~~/server/db/schema";
import { ROLE_GROUPS } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";
import { getUsers } from "~~/server/services/users.service";

export default defineEventHandler(async (event) => {
  await requireRole(event, ROLE_GROUPS.ALL);

  return await getUsers();
});
