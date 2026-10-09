import { db } from "~~/server/db";
import { projectMembers, projects, users } from "~~/server/db/schema";
import { eq, inArray, and } from "drizzle-orm";
import { type Role, ROLES } from "~~/server/constants/roles";
export async function createProjectMembers(data: {
  projectId: string;
  members: {
    userId: string;
    role: string;
  }[];
}) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, data.projectId));

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }

  const userIds = data.members.map((member) => member.userId);

  const existingUsers = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(inArray(users.id, userIds));

  if (existingUsers.length !== userIds.length) {
    throw createError({
      statusCode: 404,
      statusMessage: "One or more users not found",
    });
  }

  const membersToInsert = data.members.map((member) => ({
    projectId: data.projectId,
    userId: member.userId,
    role: member.role,
  }));

  const createdMembers = await db
    .insert(projectMembers)
    .values(membersToInsert)
    .onConflictDoNothing()
    .returning();

  return createdMembers;
}

export async function getProjectMembers() {
  return await db.select().from(projectMembers);
}

export async function updateProjectMemberRole(
  projectId: string,
  userId: string,
  role: string,
) {
  const [updatedMember] = await db
    .update(projectMembers)
    .set({ role })
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId),
      ),
    )
    .returning();

  if (!updatedMember) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project member not found",
    });
  }

  return updatedMember;
}
export async function deleteProjectMember(
  memberId: string,
  currentUserId: string,
  currentUserRole: Role,
) {
  const [memberToDelete] = await db
    .select()
    .from(projectMembers)
    .where(eq(projectMembers.id, memberId));

  if (!memberToDelete) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project member not found",
    });
  }
  if (ROLES.ADMIN === currentUserRole || ROLES.SUPERADMIN === currentUserRole) {
    const [deletedMember] = await db
      .delete(projectMembers)
      .where(eq(projectMembers.id, memberId))
      .returning();

    if (!deletedMember) {
      throw createError({
        statusCode: 404,
        statusMessage: "Project member not found",
      });
    }

    return deletedMember;
  }
  if (ROLES.MANAGER === currentUserRole) {
    const [managerMembership] = await db
        .select()
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, memberToDelete.projectId),
            eq(projectMembers.userId, currentUserId),
          ),
        );

    if (!managerMembership) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    const [deletedMember] = await db
      .delete(projectMembers)
      .where(eq(projectMembers.id, memberId))
      .returning();

    if (!deletedMember) {
      throw createError({
        statusCode: 404,
        statusMessage: "Project member not found",
      });
    }

    return deletedMember;
  }
  throw createError({
    statusCode: 403,
    statusMessage: "Forbidden",
  });
}
