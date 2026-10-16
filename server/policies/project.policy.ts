import { and, eq, exists, type SQL } from "drizzle-orm";
import { db } from "~~/server/db";
import { projects, projectMembers } from "~~/server/db/schema";
import { ROLES, type Role } from "~~/server/constants/roles";

export function getProjectAccessCondition(
  userId: string,
  role: Role,
): SQL | undefined {
  if (role === ROLES.SUPERADMIN || role === ROLES.ADMIN) {
    return undefined;
  }

  return exists(
    db
      .select({
        id: projectMembers.id,
      })
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, projects.id),
          eq(projectMembers.userId, userId),
        ),
      ),
  );
}
export async function hasProjectAccess(
  projectId: string,
  userId: string,
  role: Role,
): Promise<boolean> {
  if (role === ROLES.SUPERADMIN || role === ROLES.ADMIN) {
    return true;
  }

  if (role !== ROLES.MANAGER && role !== ROLES.WORKER) {
    return false;
  }

  const [membership] = await db
    .select({
      id: projectMembers.id,
    })
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId),
      ),
    )

  return Boolean(membership);
}