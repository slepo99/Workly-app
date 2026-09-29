import { getRouterParam, readBody } from "h3"

import {
  ROLE_ASSIGNMENTS,
  ROLE_GROUPS,
  type Role,
} from "~~/server/constants/roles"
import {
  getUserById,
  updateUserRole,
} from "~~/server/services/users.service"
import { requireRole } from "~~/server/utils/requireRole"
import { updateUserRoleSchema } from "~~/server/validation/users.schema"

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(
    event,
    ROLE_GROUPS.ADMINS,
  )

  const userId = getRouterParam(event, "id")

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    })
  }

  const body = await readBody(event)
  const data = updateUserRoleSchema.parse(body)

  const targetUser = await getUserById(userId)

  if (!targetUser) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    })
  }

  const currentRole = currentUser.role as Role
  const targetRole = targetUser.role as Role

  const allowedRoles = ROLE_ASSIGNMENTS[currentRole]

  const canManageTarget = allowedRoles.includes(targetRole)
  const canAssignRole = allowedRoles.includes(data.role)

  if (!canManageTarget || !canAssignRole) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    })
  }

  const user = await updateUserRole(
    userId,
    data.role,
  )

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    })
  }

  return user
})