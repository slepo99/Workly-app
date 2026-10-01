import { getRouterParam, getQuery } from "h3"

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

  const query = getQuery(event)

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20

  return await getTasksByProjectId(
    id,
    currentUser.id,
    currentUser.role as Role,
    page,
    limit,
  )
})