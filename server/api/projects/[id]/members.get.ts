import { getMembersByProjectId } from '~~/server/services/projects.service'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project ID is required',
    })
  }

  const result = await getMembersByProjectId(id)

  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not found',
    })
  }

  return result
})