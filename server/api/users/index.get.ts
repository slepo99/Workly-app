import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'

export default defineEventHandler(async () => {
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
    .from(users)
})