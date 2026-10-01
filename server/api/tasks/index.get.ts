import { getTasks } from "~~/server/services/tasks.service"
import { ROLE_GROUPS, type Role } from "~~/server/constants/roles"
import { requireRole } from "~~/server/utils/requireRole"

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(
    event,
    ROLE_GROUPS.ALL,
  )

  const query = getQuery(event)

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20

  return await getTasks(
    currentUser.id,
    currentUser.role as Role,
    page,
    limit,
  )
})