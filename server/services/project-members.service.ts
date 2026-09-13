import { db } from '~~/server/db'
import { projectMembers } from '~~/server/db/schema'

export async function createProjectMember(data: {
  userId: string
  projectId: string
  role: string
}) {
  const result = await db
    .insert(projectMembers)
    .values(data)
    .returning()

  return result[0]
}
export async function getProjectMembers() {
  return await db.select().from(projectMembers)
}