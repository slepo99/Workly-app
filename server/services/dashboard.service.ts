import {
  and,
  count,
  eq,
  inArray,
  asc,
  desc,
  gte,
  isNotNull,
  lte,
  notInArray,
} from "drizzle-orm";

import { db } from "~~/server/db";

import {
  projectMembers,
  projects,
  users,
  tasks,
  taskAssignees,
} from "~~/server/db/schema";

import { ROLES, type Role } from "~~/server/constants/roles";
import { TASK_STATUSES } from "~~/server/constants/taskStatuses";
import { getTaskAccessCondition } from "../policies/task.policy";
import { getTaskAssignees } from "~~/server/services/task-assignees.service";


async function getAdminStats() {
  const [
    totalTasksResult,
    completedTasksResult,
    totalProjectsResult,
    totalUsersResult,
  ] = await Promise.all([
    db.select({ count: count() }).from(tasks),

    db
      .select({ count: count() })
      .from(tasks)
      .where(eq(tasks.status, TASK_STATUSES.COMPLETED)),

    db.select({ count: count() }).from(projects),

    db.select({ count: count() }).from(users),
  ]);

  return {
    totalTasks: totalTasksResult[0]?.count ?? 0,
    completedTasks: completedTasksResult[0]?.count ?? 0,
    totalProjects: totalProjectsResult[0]?.count ?? 0,
    totalUsers: totalUsersResult[0]?.count ?? 0,
  };
}

async function getManagerTaskStats(userId: string) {
  const [totalTasksResult, completedTasksResult] = await Promise.all([
    db
      .select({ count: count() })
      .from(tasks)
      .innerJoin(projectMembers, eq(projectMembers.projectId, tasks.projectId))
      .where(eq(projectMembers.userId, userId)),

    db
      .select({ count: count() })
      .from(tasks)
      .innerJoin(projectMembers, eq(projectMembers.projectId, tasks.projectId))
      .where(
        and(
          eq(projectMembers.userId, userId),
          eq(tasks.status, TASK_STATUSES.COMPLETED),
        ),
      ),
  ]);

  return {
    totalTasks: totalTasksResult[0]?.count ?? 0,
    completedTasks: completedTasksResult[0]?.count ?? 0,
  };
}

async function getWorkerTaskStats(userId: string) {
  const [totalTasksResult, completedTasksResult] = await Promise.all([
    db
      .select({ count: count() })
      .from(tasks)
      .innerJoin(taskAssignees, eq(taskAssignees.taskId, tasks.id))
      .where(eq(taskAssignees.userId, userId)),

    db
      .select({ count: count() })
      .from(tasks)
      .innerJoin(taskAssignees, eq(taskAssignees.taskId, tasks.id))
      .where(
        and(
          eq(taskAssignees.userId, userId),
          eq(tasks.status, TASK_STATUSES.COMPLETED),
        ),
      ),
  ]);

  return {
    totalTasks: totalTasksResult[0]?.count ?? 0,
    completedTasks: completedTasksResult[0]?.count ?? 0,
  };
}

async function getUserProjectStats(userId: string) {
  const userProjects = await db
    .select({
      projectId: projectMembers.projectId,
    })
    .from(projectMembers)
    .where(eq(projectMembers.userId, userId));

  const projectIds = userProjects.map((item) => item.projectId);

  if (!projectIds.length) {
    return {
      totalProjects: 0,
      totalUsers: 0,
    };
  }

  const employees = await db
    .select({
      userId: projectMembers.userId,
    })
    .from(projectMembers)
    .where(inArray(projectMembers.projectId, projectIds));

  const uniqueUsers = new Set(employees.map((item) => item.userId));

  return {
    totalProjects: projectIds.length,
    totalUsers: uniqueUsers.size,
  };
}

export async function getStats(userId: string, role: Role) {
  if (role === ROLES.SUPERADMIN || role === ROLES.ADMIN) {
    return await getAdminStats();
  }

  const projectStats = await getUserProjectStats(userId);

  if (role === ROLES.MANAGER) {
    const taskStats = await getManagerTaskStats(userId);

    return {
      ...taskStats,
      ...projectStats,
    };
  }

  const taskStats = await getWorkerTaskStats(userId);

  return {
    ...taskStats,
    ...projectStats,
  };
}
export async function getDashboardTasks(userId: string, role: Role) {
  const accessCondition = getTaskAccessCondition(userId, role);

  const now = new Date();

  const deadlineLimit = new Date(now);

  deadlineLimit.setDate(deadlineLimit.getDate() + 7);

  const [recentTasks, upcomingDeadlines] = await Promise.all([
    db
      .select()
      .from(tasks)
      .where(accessCondition)
      .orderBy(desc(tasks.updatedAt), desc(tasks.id))
      .limit(2),

    db
      .select()
      .from(tasks)
      .where(
        and(
          accessCondition,
          isNotNull(tasks.endDate),
          gte(tasks.endDate, now),
          lte(tasks.endDate, deadlineLimit),
          notInArray(tasks.status, [
            TASK_STATUSES.COMPLETED,
            TASK_STATUSES.CANCELLED,
          ]),
        ),
      )
      .orderBy(asc(tasks.endDate), asc(tasks.id))
      .limit(3),
  ]);

  const [recentTasksWithAssignees, upcomingDeadlinesWithAssignees] =
    await Promise.all([
      Promise.all(
        recentTasks.map(async (task) => ({
          ...task,
          assignees: await getTaskAssignees(task.id),
        })),
      ),

      Promise.all(
        upcomingDeadlines.map(async (task) => ({
          ...task,
          assignees: await getTaskAssignees(task.id),
        })),
      ),
    ]);

  return {
    recentTasks: recentTasksWithAssignees,
    upcomingDeadlines: upcomingDeadlinesWithAssignees,
  };
}
