import { z } from "zod"

import { loginUser } from "~~/server/services/auth.service"
import { createJwt } from "~~/server/utils/jwt"

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default defineEventHandler(async (event) => {
  const body = bodySchema.parse(await readBody(event))

  const user = await loginUser(body)

  const token = await createJwt({
    userId: user.id,
    role: user.role,
  })

  setCookie(event, "auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })

  return user
})