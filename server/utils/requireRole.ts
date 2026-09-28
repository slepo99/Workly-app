import type { H3Event } from "h3"
import { getCookie } from "h3"

import { getUserById } from "~~/server/services/users.service"
import { verifyJwt } from "~~/server/utils/jwt"
import type { Role } from "~~/server/constants/roles"

export async function requireRole(
  event: H3Event,
  allowedRoles: readonly Role[],
) {
  const token = getCookie(event, "auth_token")

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  const payload = await verifyJwt(token)

  if (typeof payload.userId !== "string") {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid token",
    })
  }

  const user = await getUserById(payload.userId)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not found",
    })
  }

  if (!allowedRoles.includes(user.role as Role)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    })
  }

  return user
}