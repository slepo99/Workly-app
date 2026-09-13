import { z } from 'zod'

export const createProjectMemberSchema = z.object({
  userId: z.uuid(),
  projectId: z.uuid(),
  role: z.string().min(1).max(50),
})
