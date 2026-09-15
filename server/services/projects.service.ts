import { db } from "~~/server/db";
import { projectMembers, projects, users, tasks } from "~~/server/db/schema";
import { eq } from "drizzle-orm";

export async function createProject(data: {
  name: string;
  description?: string;
  status?: string;
}) {
  const result = await db.insert(projects).values(data).returning();

  return result[0];
}

export async function getProjects() {
  return await db.select().from(projects);
}

export async function getProjectById(id: string) {
  const result = await db.select().from(projects).where(eq(projects.id, id));

  return result[0];
}

export async function updateProjectById(
  id: string,
  data: {
    name?: string;
    description?: string;
    status?: string;
  },
) {
  const result = await db
    .update(projects)
    .set(data)
    .where(eq(projects.id, id))
    .returning();

  return result[0];
}
export async function deleteProjectById(id: string) {
  const result = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning();

  return result[0];
}
export async function getMembersByProjectId(id: string) {
  const rows = await db
    .select({
      role: projectMembers.role,
      user: users,
      projectId: projectMembers.projectId
    })
    .from(projectMembers)
    .leftJoin(users, eq(users.id, projectMembers.userId))
    .where(eq(projectMembers.projectId, id));

  if (!rows[0]) {
    return null;
  }

  return rows
    .filter((row) => row.user)
}
export async function getTasksByProjectId(projectId: string) {
  const rows = await db
    .select()
    .from(tasks)
    .where(eq(tasks.projectId, projectId))

  return rows
}