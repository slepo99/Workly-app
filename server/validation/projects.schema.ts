import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1).max(150),
  description: z.string().max(1000).optional(),
  status: z.string().max(50).optional(),
})

export const updateProjectSchema = createProjectSchema.partial()