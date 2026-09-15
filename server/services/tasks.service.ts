import { db } from "~~/server/db";
import { tasks, projects, users, projectMembers } from "~~/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function createTask(data: {
  projectId: string;
  assigneeId?: string;
  title: string;
  description?: string;
  status?: string;
}) {
  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.id, data.projectId));

  if (!project[0]) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }
  if (data.assigneeId) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, data.assigneeId));

    if (!user[0]) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }
    const member = await db
      .select()
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, data.projectId),
          eq(projectMembers.userId, data.assigneeId),
        ),
      );
    if (!member[0]) {
      throw createError({
        statusCode: 400,
        statusMessage: "User is not a member of this project",
      });
    }
  }

  const result = await db.insert(tasks).values(data).returning();

  return result[0];
}
export async function getTasks() {
  return await db.select().from(tasks);
}
export async function getTaskById(id: string) {
  const result = await db.select().from(tasks).where(eq(tasks.id, id));

  return result[0];
}
export async function updateTaskById(
  id: string,
  data: {
    projectId?: string;
    assigneeId?: string;
    title?: string;
    description?: string;
    status?: string;
  },
) {
  const result = await db
    .update(tasks)
    .set(data)
    .where(eq(tasks.id, id))
    .returning();

  return result[0];
}
