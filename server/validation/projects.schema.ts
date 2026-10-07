import { z } from "zod";
import {
  PROJECT_STATUSES,
  type ProjectStatus,
} from "~~/server/constants/projectStatuses";

const projectStatusSchema = z.enum(
  Object.values(PROJECT_STATUSES) as [ProjectStatus, ...ProjectStatus[]],
);

export const createProjectSchema = z.object({
  name: z.string().min(1).max(150),
  description: z.string().max(1000).optional(),
  status: projectStatusSchema.optional(),
  image: z.url().nullable().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();