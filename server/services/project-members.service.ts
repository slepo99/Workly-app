import { db } from "~~/server/db";
import { projectMembers, projects, users } from "~~/server/db/schema";
import { eq } from "drizzle-orm";
export async function createProjectMember(data: {
  userId: string;
  projectId: string;
  role: string;
}) {
  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.id, data.projectId));

  if (!project[0]) {
   throw  createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }

  const user = await db.select().from(users).where(eq(users.id, data.userId));

  if (!user[0]) {
   throw  createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }
  const result = await db.insert(projectMembers).values(data).returning();

  return result[0];
}
export async function getProjectMembers() {
  return await db.select().from(projectMembers);
}
