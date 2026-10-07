import { z } from "zod";
import {
  TASK_STATUSES,
  type TaskStatus,
} from "~~/server/constants/taskStatuses";

const taskStatusSchema = z.enum(
  Object.values(TASK_STATUSES) as [TaskStatus, ...TaskStatus[]],
);
export const createTaskSchema = z.object({
  projectId: z.uuid(),
  assigneeIds: z.array(z.uuid()).optional(),
  title: z.string().min(1).max(150),
  description: z.string().max(1000).optional(),
  status: taskStatusSchema.optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
