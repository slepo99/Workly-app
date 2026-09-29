import { z } from 'zod'
import { ROLES } from "~~/server/constants/roles"

export const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  position: z.string().max(100).optional(),
  avatar: z.url().max(500).optional(),
})
export const updateUserSchema = createUserSchema.partial()


export const updateUserRoleSchema = z.object({
  role: z.enum([
    ROLES.ADMIN,
    ROLES.MANAGER,
    ROLES.WORKER,
  ]),
})