import { updateUserById } from '~~/server/services/users.service'
import { updateUserSchema } from '~~/server/validation/users.schema'
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required',
    })
  }

  const body = await readBody(event)
  const data = updateUserSchema.parse(body)
  
  const user = await updateUserById(id, data)

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }

  return user
})