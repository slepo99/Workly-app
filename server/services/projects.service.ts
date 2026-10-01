import { db } from "~~/server/db";
import {
  projectMembers,
  projects,
  users,
  tasks,
  taskAssignees,
} from "~~/server/db/schema";
import { eq, and, count } from "drizzle-orm";
import { ROLES, type Role } from "~~/server/constants/roles";
import { getTaskAssignees } from "./task-assignees.service";
import { TASK_STATUSES } from "~~/server/constants/taskStatuses";

export async function createProject(data: {
  name: string;
  description?: string;
  status?: string;
}) {
  const result = await db.insert(projects).values(data).returning();

  return result[0];
}

export async function getProjects(
  userId: string,
  role: Role,
  page: number,
  limit: number,
) {
  const offset = (page - 1) * limit;

  let projectList;
  let total = 0;

  if (role === ROLES.SUPERADMIN || role === ROLES.ADMIN) {
    const totalResult = await db
      .select({
        count: count(),
      })
      .from(projects);

    total = totalResult[0]?.count ?? 0;

    projectList = await db.select().from(projects).limit(limit).offset(offset);
  } else {
    const totalResult = await db
      .select({
        count: count(),
      })
      .from(projects)
      .innerJoin(projectMembers, eq(projectMembers.projectId, projects.id))
      .where(eq(projectMembers.userId, userId));

    total = totalResult[0]?.count ?? 0;

    projectList = await db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        status: projects.status,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .innerJoin(projectMembers, eq(projectMembers.projectId, projects.id))
      .where(eq(projectMembers.userId, userId))
      .limit(limit)
      .offset(offset);
  }

  const projectsWithStats = await Promise.all(
    projectList.map(async (project) => {
      const allTasksResult = await db
        .select({
          count: count(),
        })
        .from(tasks)
        .where(eq(tasks.projectId, project.id));

      const completedTasksResult = await db
        .select({
          count: count(),
        })
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, project.id),
            eq(tasks.status, TASK_STATUSES.COMPLETED),
          ),
        );

      const tasksCount = allTasksResult[0]?.count ?? 0;

      const completedCount = completedTasksResult[0]?.count ?? 0;

      const completionPercent =
        tasksCount === 0 ? 0 : Math.round((completedCount / tasksCount) * 100);

      return {
        ...project,
        tasksCount,
        completionPercent,
      };
    }),
  );

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    projects: projectsWithStats,
  };
}
export async function getProjectById(id: string) {
  const result = await db.select().from(projects).where(eq(projects.id, id));

  return result[0];
}

export async function updateProjectById(
  id: string,
  data: {
    name?: string;
    description?: string;
    status?: string;
  },
) {
  const result = await db
    .update(projects)
    .set(data)
    .where(eq(projects.id, id))
    .returning();

  return result[0];
}
export async function deleteProjectById(id: string) {
  const result = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning();

  return result[0];
}
export async function getMembersByProjectId(
  projectId: string,
  userId: string,
  role: Role,
) {
  if (ROLES.ADMIN === role || ROLES.SUPERADMIN === role) {
    const rows = await db
      .select({
        role: projectMembers.role,
        user: users,
        projectId: projectMembers.projectId,
      })
      .from(projectMembers)
      .innerJoin(users, eq(users.id, projectMembers.userId))
      .where(eq(projectMembers.projectId, projectId));

    return rows;
  }
  if (ROLES.MANAGER === role || ROLES.WORKER === role) {
    const [membership] = await db
      .select()
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, projectId),
          eq(projectMembers.userId, userId),
        ),
      );

    if (!membership) {
      return null;
    }
    const rows = await db
      .select({
        role: projectMembers.role,
        user: users,
        projectId: projectMembers.projectId,
      })
      .from(projectMembers)
      .innerJoin(users, eq(users.id, projectMembers.userId))
      .where(eq(projectMembers.projectId, projectId));

    return rows;
  }
}
export async function getTasksByProjectId(
  projectId: string,
  userId: string,
  role: Role,
  page: number,
  limit: number,
) {
  const offset = (page - 1) * limit;

  let tasksList;
  let total = 0;

  if (role === ROLES.ADMIN || role === ROLES.SUPERADMIN) {
    const totalResult = await db
      .select({
        count: count(),
      })
      .from(tasks)
      .where(eq(tasks.projectId, projectId));

    total = totalResult[0]?.count ?? 0;

    tasksList = await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .limit(limit)
      .offset(offset);
  } else if (role === ROLES.MANAGER) {
    const totalResult = await db
      .select({
        count: count(),
      })
      .from(tasks)
      .innerJoin(projectMembers, eq(projectMembers.projectId, tasks.projectId))
      .where(
        and(eq(tasks.projectId, projectId), eq(projectMembers.userId, userId)),
      );

    total = totalResult[0]?.count ?? 0;

    tasksList = await db
      .select({
        id: tasks.id,
        projectId: tasks.projectId,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        startDate: tasks.startDate,
        endDate: tasks.endDate,
        createdAt: tasks.createdAt,
      })
      .from(tasks)
      .innerJoin(projectMembers, eq(projectMembers.projectId, tasks.projectId))
      .where(
        and(eq(tasks.projectId, projectId), eq(projectMembers.userId, userId)),
      )
      .limit(limit)
      .offset(offset);
  } else {
    const totalResult = await db
      .select({
        count: count(),
      })
      .from(tasks)
      .innerJoin(taskAssignees, eq(taskAssignees.taskId, tasks.id))
      .where(
        and(eq(taskAssignees.userId, userId), eq(tasks.projectId, projectId)),
      );

    total = totalResult[0]?.count ?? 0;

    tasksList = await db
      .select({
        id: tasks.id,
        projectId: tasks.projectId,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        startDate: tasks.startDate,
        endDate: tasks.endDate,
        createdAt: tasks.createdAt,
      })
      .from(tasks)
      .innerJoin(taskAssignees, eq(taskAssignees.taskId, tasks.id))
      .where(
        and(eq(taskAssignees.userId, userId), eq(tasks.projectId, projectId)),
      )
      .limit(limit)
      .offset(offset);
  }

  const tasksWithAssignees = await Promise.all(
    tasksList.map(async (task) => ({
      ...task,
      assignees: await getTaskAssignees(task.id),
    })),
  );

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    tasks: tasksWithAssignees,
  };
}
