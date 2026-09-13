import { createUser } from '~~/server/services/users.service'
import { createUserSchema } from '~~/server/validation/users.schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const data = createUserSchema.parse(body)

  return await createUser(data)

})