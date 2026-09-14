import { db } from '~~/server/db'
import { projectMembers, projects, users } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export async function createProject(data: {
  name: string
  description?: string
  status?: string
}) {
  const result = await db
    .insert(projects)
    .values(data)
    .returning()

  return result[0]
}

export async function getProjects() {
  return await db.select().from(projects)
}

export async function getProjectById(id: string) {
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))

  return result[0]
}

export async function updateProjectById(
  id: string,
  data: {
    name?: string
    description?: string
    status?: string
  },
) {
  const result = await db
    .update(projects)
    .set(data)
    .where(eq(projects.id, id))
    .returning()

  return result[0]
}
export async function deleteProjectById(id: string) {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning()

    return result[0]
}
export async function getProjectWithMembers(id: string) {
  const rows = await db
    .select({
      project: projects,
      role: projectMembers.role,
      user: users,
    })
    .from(projects)
    .leftJoin(
      projectMembers,
      eq(projectMembers.projectId, projects.id),
    )
    .leftJoin(
      users,
      eq(users.id, projectMembers.userId),
    )
    .where(eq(projects.id, id))

  const firstRow = rows[0]

  if (!firstRow) {
    return null
  }

  return {
    project: firstRow.project,
    members: rows
      .filter((row) => row.user)
      .map((row) => ({
        user: row.user,
        role: row.role,
      })),
  }
}
