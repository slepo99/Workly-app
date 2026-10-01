import { and, count, eq, inArray } from "drizzle-orm"

import { db } from "~~/server/db"

import {
  projectMembers,
  projects,
  users,
  tasks,
  taskAssignees,
} from "~~/server/db/schema"

import {
  ROLES,
  type Role,
} from "~~/server/constants/roles"

import { TASK_STATUSES } from "~~/server/constants/taskStatuses"


async function getAdminStats() {
  const [
    totalTasksResult,
    completedTasksResult,
    totalProjectsResult,
    totalUsersResult,
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(tasks),

    db
      .select({ count: count() })
      .from(tasks)
      .where(
        eq(
          tasks.status,
          TASK_STATUSES.COMPLETED,
        ),
      ),

    db
      .select({ count: count() })
      .from(projects),

    db
      .select({ count: count() })
      .from(users),
  ])

  return {
    totalTasks: totalTasksResult[0]?.count ?? 0,
    completedTasks: completedTasksResult[0]?.count ?? 0,
    totalProjects: totalProjectsResult[0]?.count ?? 0,
    totalUsers: totalUsersResult[0]?.count ?? 0,
  }
}


async function getManagerTaskStats(userId: string) {
  const [
    totalTasksResult,
    completedTasksResult,
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(tasks)
      .innerJoin(
        projectMembers,
        eq(
          projectMembers.projectId,
          tasks.projectId,
        ),
      )
      .where(
        eq(
          projectMembers.userId,
          userId,
        ),
      ),

    db
      .select({ count: count() })
      .from(tasks)
      .innerJoin(
        projectMembers,
        eq(
          projectMembers.projectId,
          tasks.projectId,
        ),
      )
      .where(
        and(
          eq(
            projectMembers.userId,
            userId,
          ),
          eq(
            tasks.status,
            TASK_STATUSES.COMPLETED,
          ),
        ),
      ),
  ])

  return {
    totalTasks: totalTasksResult[0]?.count ?? 0,
    completedTasks: completedTasksResult[0]?.count ?? 0,
  }
}


async function getWorkerTaskStats(userId: string) {
  const [
    totalTasksResult,
    completedTasksResult,
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(tasks)
      .innerJoin(
        taskAssignees,
        eq(
          taskAssignees.taskId,
          tasks.id,
        ),
      )
      .where(
        eq(
          taskAssignees.userId,
          userId,
        ),
      ),

    db
      .select({ count: count() })
      .from(tasks)
      .innerJoin(
        taskAssignees,
        eq(
          taskAssignees.taskId,
          tasks.id,
        ),
      )
      .where(
        and(
          eq(
            taskAssignees.userId,
            userId,
          ),
          eq(
            tasks.status,
            TASK_STATUSES.COMPLETED,
          ),
        ),
      ),
  ])

  return {
    totalTasks: totalTasksResult[0]?.count ?? 0,
    completedTasks: completedTasksResult[0]?.count ?? 0,
  }
}


async function getUserProjectStats(userId: string) {
  const userProjects = await db
    .select({
      projectId: projectMembers.projectId,
    })
    .from(projectMembers)
    .where(
      eq(
        projectMembers.userId,
        userId,
      ),
    )

  const projectIds = userProjects.map(
    (item) => item.projectId,
  )

  if (!projectIds.length) {
    return {
      totalProjects: 0,
      totalUsers: 0,
    }
  }

  const employees = await db
    .select({
      userId: projectMembers.userId,
    })
    .from(projectMembers)
    .where(
      inArray(
        projectMembers.projectId,
        projectIds,
      ),
    )

  const uniqueUsers = new Set(
    employees.map(
      (item) => item.userId,
    ),
  )

  return {
    totalProjects: projectIds.length,
    totalUsers: uniqueUsers.size,
  }
}


export async function getStats(
  userId: string,
  role: Role,
) {
  if (
    role === ROLES.SUPERADMIN ||
    role === ROLES.ADMIN
  ) {
    return await getAdminStats()
  }

  const projectStats =
    await getUserProjectStats(userId)

  if (role === ROLES.MANAGER) {
    const taskStats =
      await getManagerTaskStats(userId)

    return {
      ...taskStats,
      ...projectStats,
    }
  }

  const taskStats =
    await getWorkerTaskStats(userId)

  return {
    ...taskStats,
    ...projectStats,
  }
}