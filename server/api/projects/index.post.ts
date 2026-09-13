import { createProject } from '~~/server/services/projects.service'
import { createProjectSchema } from '~~/server/validation/projects.schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const data = createProjectSchema.parse(body)

  return await createProject(data)
})
