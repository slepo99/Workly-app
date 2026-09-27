import { db } from "~~/server/db";
import { tasks, projects, users, projectMembers,  taskAssignees } from "~~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getTaskAssignees } from "./task-assignees.service"

export async function createTask(data: {
  projectId: string
  assigneeIds?: string[]
  title: string
  description?: string
  status?: string
}) {
  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.id, data.projectId))

  if (!project[0]) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    })
  }

  const assigneeIds = data.assigneeIds ?? []

  for (const userId of assigneeIds) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))

    if (!user[0]) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      })
    }

    const member = await db
      .select()
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, data.projectId),
          eq(projectMembers.userId, userId),
        ),
      )

    if (!member[0]) {
      throw createError({
        statusCode: 400,
        statusMessage: "User is not a member of this project",
      })
    }
  }

 const [task] = await db
  .insert(tasks)
  .values({
    projectId: data.projectId,
    title: data.title,
    description: data.description,
    status: data.status,
  })
  .returning()

if (!task) {
  throw createError({
    statusCode: 500,
    statusMessage: "Failed to create task",
  })
}

if (assigneeIds.length) {
  await db.insert(taskAssignees).values(
    assigneeIds.map((userId) => ({
      taskId: task.id,
      userId,
    })),
  )
}

return task
}
export async function getTasks() {
  const taskList = await db.select().from(tasks)

  return Promise.all(
    taskList.map(async (task) => ({
      ...task,
      assignees: await getTaskAssignees(task.id),
    })),
  )
}

export async function getTaskById(id: string) {
  const [task] = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, id));

  if (!task) {
    return undefined;
  }

  const assignees = await getTaskAssignees(task.id);

  return {
    ...task,
    assignees,
  };
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
