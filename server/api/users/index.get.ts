import { db } from "~~/server/db";
import { users } from "~~/server/db/schema";
import { ROLE_GROUPS } from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

export default defineEventHandler(async (event) => {
  await requireRole(event, ROLE_GROUPS.ALL);

  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      position: users.position,
      avatar: users.avatar,
      createdAt: users.createdAt,
    })
    .from(users);
});