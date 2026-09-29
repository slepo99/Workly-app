import { getMembersByProjectId } from "~~/server/services/projects.service"
import { ROLE_GROUPS, type Role } from "~~/server/constants/roles"
import { requireRole } from "~~/server/utils/requireRole"

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

  const result = await getMembersByProjectId(
    id,
    currentUser.id,
    currentUser.role as Role,
  )

  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    })
  }

  return result
})