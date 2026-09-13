import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'

export default defineEventHandler(async () => {
  return await db.select().from(users)
})