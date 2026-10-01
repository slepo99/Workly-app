import { getStats } from "~~/server/services/dashboard.service"
import { ROLE_GROUPS, type Role } from "~~/server/constants/roles"
import { requireRole } from "~~/server/utils/requireRole"

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(
    event,
    ROLE_GROUPS.ALL,
  )

  return await getStats(
    currentUser.id,
    currentUser.role as Role,
  )
})