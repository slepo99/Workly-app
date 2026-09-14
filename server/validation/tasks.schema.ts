import { z } from "zod";

export const createTaskSchema = z.object({
    projectId: z.uuid(),
    assigneeId: z.uuid().optional(),
    title: z.string().min(1).max(150),
    description: z.string().max(1000).optional(),
    status: z.string().max(50).default("pending"),
})

export const updateTaskSchema = createTaskSchema.partial()