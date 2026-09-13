import { updateProjectById } from '~~/server/services/projects.service'
import { updateProjectSchema } from '~~/server/validation/projects.schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project ID is required',
    })
  }

  const body = await readBody(event)
  const data = updateProjectSchema.parse(body)

  const project = await updateProjectById(id, data)

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not found',
    })
  }

  return project
})