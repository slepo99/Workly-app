import { createTask } from "~~/server/services/tasks.service";
import { createTaskSchema } from "~~/server/validation/tasks.schema";
import { ROLE_GROUPS } from "~~/server/constants/roles"
import { requireRole } from "~~/server/utils/requireRole"

export default defineEventHandler(async (event) => {
  await requireRole(event, ROLE_GROUPS.MANAGEMENT)
  const body = await readBody(event);
  const data = createTaskSchema.parse(body);
  return await createTask(data);
})