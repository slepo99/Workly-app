import { createUser } from '~~/server/services/users.service'
import { createUserSchema } from '~~/server/validation/users.schema'
import { ROLE_GROUPS } from "~~/server/constants/roles"
import { requireRole } from "~~/server/utils/requireRole"

export default defineEventHandler(async (event) => {
  await requireRole(event, ROLE_GROUPS.MANAGEMENT)
  const body = await readBody(event)

  const data = createUserSchema.parse(body)

  return await createUser(data)

})