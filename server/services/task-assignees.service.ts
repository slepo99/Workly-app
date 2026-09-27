import { and, eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { taskAssignees, users } from "~~/server/db/schema"

export async function getTaskAssignees(taskId: string) {
  return db
    .select({
      id: users.id,
      name: users.name,
      avatar: users.avatar,
    })
    .from(taskAssignees)
    .innerJoin(users, eq(taskAssignees.userId, users.id))
    .where(eq(taskAssignees.taskId, taskId))
}
export async function addTaskAssignee(taskId: string, userId: string) {
  const [assignee] = await db
    .insert(taskAssignees)
    .values({
      taskId,
      userId,
    })
    .returning()

  return assignee
}
export async function removeTaskAssignee(taskId: string, userId: string) {
  const [assignee] = await db
    .delete(taskAssignees)
    .where(
      and(
        eq(taskAssignees.taskId, taskId),
        eq(taskAssignees.userId, userId),
      ),
    )
    .returning()

  return assignee
}