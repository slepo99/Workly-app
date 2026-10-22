import { and, eq, inArray } from "drizzle-orm";
import { db } from "~~/server/db";
import { taskAssignees, users } from "~~/server/db/schema";

export async function getTaskAssignees(taskId: string) {
  return db
    .select({
      id: users.id,
      name: users.name,
      avatar: users.avatar,
    })
    .from(taskAssignees)
    .innerJoin(users, eq(taskAssignees.userId, users.id))
    .where(eq(taskAssignees.taskId, taskId));
}
export async function addTaskAssignee(taskId: string, userId: string) {
  const [assignee] = await db
    .insert(taskAssignees)
    .values({
      taskId,
      userId,
    })
    .returning();

  return assignee;
}
export async function removeTaskAssignee(taskId: string, userId: string) {
  const [assignee] = await db
    .delete(taskAssignees)
    .where(
      and(eq(taskAssignees.taskId, taskId), eq(taskAssignees.userId, userId)),
    )
    .returning();

  return assignee;
}

export async function getTaskAssigneesByTaskIds(taskIds: string[]) {
  if (!taskIds.length) {
    return new Map();
  }

  const rows = await db
    .select({
      taskId: taskAssignees.taskId,

      user: {
        id: users.id,
        name: users.name,
        avatar: users.avatar,
      },
    })
    .from(taskAssignees)
    .innerJoin(users, eq(users.id, taskAssignees.userId))
    .where(inArray(taskAssignees.taskId, taskIds));

  type TaskAssignee = (typeof rows)[number]["user"];

  const assigneesByTaskId = new Map<string, TaskAssignee[]>();

  for (const row of rows) {
    const assignees = assigneesByTaskId.get(row.taskId) ?? [];

    assignees.push(row.user);
    assigneesByTaskId.set(row.taskId, assignees);
  }

  return assigneesByTaskId;
}