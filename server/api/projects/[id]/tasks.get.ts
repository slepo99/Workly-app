import { getRouterParam } from "h3"
import { getTasksByProjectId } from "~~/server/services/projects.service"
import { requireRole } from "~~/server/utils/requireRole"
import { ROLE_GROUPS, type Role } from "~~/server/constants/roles"

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(
    event,
    ROLE_GROUPS.ALL,
  )

  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Project ID is required",
    })
  }

  return await getTasksByProjectId(
    id,
    currentUser.id,
    currentUser.role as Role,
  )
})