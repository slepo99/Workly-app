import { createTask } from "~~/server/services/tasks.service";
import { createTaskSchema } from "~~/server/validation/tasks.schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const data = createTaskSchema.parse(body);
  return await createTask(data);
})