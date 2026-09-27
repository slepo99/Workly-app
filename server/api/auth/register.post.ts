import { z } from "zod"
import { registerUser } from "~~/server/services/auth.service"

const bodySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
})

export default defineEventHandler(async (event) => {
  const body = bodySchema.parse(await readBody(event))

  return registerUser(body)
})