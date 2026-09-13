import { createProjectMember } from '~~/server/services/project-members.service'
import { createProjectMemberSchema } from '~~/server/validation/project-members.schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const data = createProjectMemberSchema.parse(body)

  return await createProjectMember(data)
})