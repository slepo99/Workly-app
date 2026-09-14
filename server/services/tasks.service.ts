import { db } from "~~/server/db";
import { tasks } from "~~/server/db/schema";
import { eq } from "drizzle-orm";

export async function createTask(data: {
  projectId: string;
  assigneeId?: string;
  title: string;
  description?: string;
  status?: string;
}) {
  const result = await db.insert(tasks).values(data).returning();
  return result[0];
}
export async function getTasks() {
  return await db.select().from(tasks);
}
export async function getTaskById(id: string) {
  const result = await db.select().from(tasks).where(eq(tasks.id, id));

  return result[0];
}
export async function updateTaskById(
  id: string,
  data: {
    projectId?: string;
    assigneeId?: string;
    title?: string;
    description?: string;
    status?: string;
  },
) {
  const result = await db
    .update(tasks)
    .set(data)
    .where(eq(tasks.id, id))
    .returning();

  return result[0];
}
