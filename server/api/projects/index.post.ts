import { createProject } from "~~/server/services/projects.service"
import { createProjectSchema } from "~~/server/validation/projects.schema"
import { ROLE_GROUPS, type Role } from "~~/server/constants/roles"
import { requireRole } from "~~/server/utils/requireRole"

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(
    event,
    ROLE_GROUPS.MANAGEMENT,
  )

  const body = await readBody(event)

  const data = createProjectSchema.parse(body)

  return await createProject(
    currentUser.id,
    currentUser.role as Role,
    data,
  )
})