import { db } from "~~/server/db";
import {
  tasks,
  projects,
  users,
  projectMembers,
  taskAssignees,
} from "~~/server/db/schema";
import { eq, and, count, desc } from "drizzle-orm";
import { getTaskAssignees } from "./task-assignees.service";
import { ROLES, type Role } from "~~/server/constants/roles";
export async function createTask(data: {
  projectId: string;
  assigneeIds?: string[];
  title: string;
  description?: string;
  status?: string;
}) {
  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.id, data.projectId));

  if (!project[0]) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }

  const assigneeIds = data.assigneeIds ?? [];

  for (const userId of assigneeIds) {
    const user = await db.select().from(users).where(eq(users.id, userId));

    if (!user[0]) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    const member = await db
      .select()
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, data.projectId),
          eq(projectMembers.userId, userId),
        ),
      );

    if (!member[0]) {
      throw createError({
        statusCode: 400,
        statusMessage: "User is not a member of this project",
      });
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
    .returning();

  if (!task) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create task",
    });
  }

  if (assigneeIds.length) {
    await db.insert(taskAssignees).values(
      assigneeIds.map((userId) => ({
        taskId: task.id,
        userId,
      })),
    );
  }

  return task;
}
export async function getTasks(
  userId: string,
  role: Role,
  page: number,
  limit: number,
) {
  const offset = (page - 1) * limit

  let taskList
  let total = 0

  if (
    role === ROLES.SUPERADMIN ||
    role === ROLES.ADMIN
  ) {
    const totalResult = await db
      .select({
        count: count(),
      })
      .from(tasks)

    total = totalResult[0]?.count ?? 0

    taskList = await db
      .select()
      .from(tasks)
      .orderBy(desc(tasks.updatedAt))
      .limit(limit)
      .offset(offset)
  } else if (role === ROLES.MANAGER) {
    const totalResult = await db
      .select({
        count: count(),
      })
      .from(tasks)
      .innerJoin(
        projectMembers,
        eq(projectMembers.projectId, tasks.projectId),
      )
      .where(eq(projectMembers.userId, userId))

    total = totalResult[0]?.count ?? 0

    taskList = await db
      .select({
        id: tasks.id,
        projectId: tasks.projectId,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        startDate: tasks.startDate,
        endDate: tasks.endDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
      })
      .from(tasks)
      .innerJoin(
        projectMembers,
        eq(projectMembers.projectId, tasks.projectId),
      )
      .where(eq(projectMembers.userId, userId))
      .orderBy(desc(tasks.updatedAt))
      .limit(limit)
      .offset(offset)
  } else {
    const totalResult = await db
      .select({
        count: count(),
      })
      .from(tasks)
      .innerJoin(
        taskAssignees,
        eq(taskAssignees.taskId, tasks.id),
      )
      .where(eq(taskAssignees.userId, userId))

    total = totalResult[0]?.count ?? 0

    taskList = await db
      .select({
        id: tasks.id,
        projectId: tasks.projectId,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        startDate: tasks.startDate,
        endDate: tasks.endDate,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
      })
      .from(tasks)
      .innerJoin(
        taskAssignees,
        eq(taskAssignees.taskId, tasks.id),
      )
      .where(eq(taskAssignees.userId, userId))
      .orderBy(desc(tasks.updatedAt))
      .limit(limit)
      .offset(offset)
  }

  const tasksWithAssignees = await Promise.all(
    taskList.map(async (task) => ({
      ...task,
      assignees: await getTaskAssignees(task.id),
    })),
  )

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    tasks: tasksWithAssignees,
  }
}

export async function getTaskById(id: string) {
  const [task] = await db.select().from(tasks).where(eq(tasks.id, id));

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
    projectId?: string
    assigneeId?: string
    title?: string
    description?: string
    status?: string
  },
) {
  const result = await db
    .update(tasks)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, id))
    .returning()

  const updatedTask = result[0]

  if (!updatedTask) {
    return undefined
  }

  const assignees = await db
    .select({
      id: users.id,
      name: users.name,
      avatar: users.avatar,
    })
    .from(taskAssignees)
    .innerJoin(
      users,
      eq(taskAssignees.userId, users.id),
    )
    .where(
      eq(taskAssignees.taskId, updatedTask.id),
    )

  return {
    ...updatedTask,
    assignees,
  }
}
export async function deleteTaskById(id: string) {
  const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();

  return result[0];
}