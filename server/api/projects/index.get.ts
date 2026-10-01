import { getProjects } from "~~/server/services/projects.service"
import { ROLE_GROUPS, type Role } from "~~/server/constants/roles"
import { requireRole } from "~~/server/utils/requireRole"

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(
    event,
    ROLE_GROUPS.ALL,
  )

  const query = getQuery(event)

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 12

  return await getProjects(
    currentUser.id,
    currentUser.role as Role,
    page,
    limit,
  )
})