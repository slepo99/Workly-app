import { db } from '~~/server/db'
import { tasks, users } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'
import type { Role } from "~~/server/constants/roles"

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
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      position: users.position,
      avatar: users.avatar,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))

  return user
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
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      position: users.position,
      avatar: users.avatar,
      createdAt: users.createdAt,
    })

  return result[0]
}
export async function deleteTaskById(id: string) {
  const result = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning()

  return result[0]
}
export async function updateUserRole(
  userId: string,
  role: Role,
) {
  const [user] = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      position: users.position,
      avatar: users.avatar,
      createdAt: users.createdAt,
    })

  return user
}