import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  position: z.string().max(100).optional(),
  avatar: z.url().max(500).optional(),
})
export const updateUserSchema = createUserSchema.partial()