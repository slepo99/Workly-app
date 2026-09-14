import { db } from '~~/server/db'
import { tasks, users } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export async function createUser(data: {
  name: string
  email: string
  position?: string
  avatar?: string
}) {
  const result = await db
    .insert(users)
    .values(data)
    .returning()

  return result[0]
}
export async function getUserById(id: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))

  return result[0]
}
export async function deleteUserById(id: string) {
  const result = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning()

  return result[0]
}
export async function updateUserById(
  id: string,
  data: {
    name?: string
    email?: string
    position?: string
    avatar?: string
  },
) {
  const result = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning()

  return result[0]
}
export async function deleteTaskById(id: string) {
  const result = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning()

  return result[0]
}