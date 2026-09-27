import { getCookie } from "h3"

import { getUserById } from "~~/server/services/users.service"
import { verifyJwt } from "~~/server/utils/jwt"

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token")

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  const payload = await verifyJwt(token)

  const userId = payload.userId

  if (typeof userId !== "string") {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid token",
    })
  }

  const user = await getUserById(userId)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not found",
    })
  }

  return user
})