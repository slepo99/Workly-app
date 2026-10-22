import { db } from "~~/server/db";
import {
  projectMembers,
  projects,
  users,
  tasks,
  taskAssignees,
} from "~~/server/db/schema";
import { eq, and, count, desc, ilike, inArray, isNull, asc, sql } from "drizzle-orm";
import { ROLES, type Role } from "~~/server/constants/roles";
import { getTaskAssignees } from "./task-assignees.service";
import { TASK_STATUSES } from "~~/server/constants/taskStatuses";
import { deleteImageByUrl } from "~~/server/services/uploads.service";
import type { ProjectStatus } from "~~/server/constants/projectStatuses";
import { getProjectAccessCondition, hasProjectAccess } from "../policies/project.policy";
import { getTaskAccessCondition } from "../policies/task.policy";

export async function createProject(
  userId: string,
  role: Role,
  data: {
    name: string;
    description?: string;
    status?: string;
    image?: string | null;
  },
) {
  return await db.transaction(async (tx) => {
    const [project] = await tx.insert(projects).values(data).returning();

    if (!project) {
      throw new Error("Failed to create project");
    }

    await tx.insert(projectMembers).values({
      projectId: project.id,
      userId,
      role,
    });

    return project;
  });
}

export async function getProjects(
  userId: string,
  role: Role,
  page: number,
  limit: number,
  search: string,
  statuses: ProjectStatus[],
) {
  const offset = (page - 1) * limit;

  const accessCondition = getProjectAccessCondition(userId, role);

  const searchCondition = search
    ? ilike(projects.name, `%${search}%`)
    : undefined;

  const statusCondition = statuses.length
    ? inArray(projects.status, statuses)
    : undefined;

  const whereCondition = and(
    accessCondition,
    searchCondition,
    statusCondition,
  );

  const [totalResult, projectList] = await Promise.all([
    db
      .select({
        count: count(),
      })
      .from(projects)
      .where(whereCondition),

    db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        status: projects.status,
        image: projects.image,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .where(whereCondition)
      .orderBy(desc(projects.updatedAt))
      .limit(limit)
      .offset(offset),
  ]);

  const total = totalResult[0]?.count ?? 0;

  if (!projectList.length) {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      projects: [],
    };
  }

  const projectIds = projectList.map((project) => project.id);

  const statsList = await db
    .select({
      projectId: tasks.projectId,

      tasksCount: sql<number>`
        cast(count(*) as integer)
      `,

      completedCount: sql<number>`
        cast(
          count(*) filter (
            where ${tasks.status} = ${TASK_STATUSES.COMPLETED}
          )
          as integer
        )
      `,
    })
    .from(tasks)
    .where(inArray(tasks.projectId, projectIds))
    .groupBy(tasks.projectId);

  const statsByProjectId = new Map(
    statsList.map((stats) => [stats.projectId, stats]),
  );

  const projectsWithStats = projectList.map((project) => {
    const stats = statsByProjectId.get(project.id);

    const tasksCount = stats?.tasksCount ?? 0;
    const completedCount = stats?.completedCount ?? 0;

    const completionPercent =
      tasksCount === 0
        ? 0
        : Math.round((completedCount / tasksCount) * 100);

    return {
      ...project,
      tasksCount,
      completionPercent,
    };
  });

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    projects: projectsWithStats,
  };
}

export async function getProjectById(
  id: string,
  userId: string,
  role: Role,
) {
  const accessCondition = getProjectAccessCondition(userId, role);

  const [project] = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      image: projects.image,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .where(
      and(
        eq(projects.id, id),
        accessCondition,
      ),
    );

  if (!project) {
    return undefined;
  }

  const [allTasksResult, completedTasksResult] = await Promise.all([
    db
      .select({
        count: count(),
      })
      .from(tasks)
      .where(eq(tasks.projectId, project.id)),

    db
      .select({
        count: count(),
      })
      .from(tasks)
      .where(
        and(
          eq(tasks.projectId, project.id),
          eq(tasks.status, TASK_STATUSES.COMPLETED),
        ),
      ),
  ]);

  const tasksCount = allTasksResult[0]?.count ?? 0;
  const completedCount = completedTasksResult[0]?.count ?? 0;

  const completionPercent =
    tasksCount === 0
      ? 0
      : Math.round((completedCount / tasksCount) * 100);

  return {
    ...project,
    tasksCount,
    completionPercent,
  };
}

export async function updateProjectById(
  id: string,
  data: {
    name?: string;
    description?: string;
    status?: string;
    image?: string;
  },
) {
  const [oldProject] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id));

  if (!oldProject) {
    return undefined;
  }

  const [updatedProject] = await db
    .update(projects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning();

  if ("image" in data && oldProject.image && data.image !== oldProject.image) {
    await deleteImageByUrl(oldProject.image);
  }

  return updatedProject;
}

export async function deleteProjectById(id: string) {
  const [deletedProject] = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning();

  if (!deletedProject) {
    return undefined;
  }

  if (deletedProject.image) {
    await deleteImageByUrl(deletedProject.image);
  }

  return deletedProject;
}

export async function getMembersByProjectId(
  projectId: string,
  userId: string,
  role: Role,
) {
  const hasAccess = await hasProjectAccess(projectId, userId, role);

  if (!hasAccess) {
    return null;
  }

  return await db
    .select({
      role: projectMembers.role,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        position: users.position,
        avatar: users.avatar,
        createdAt: users.createdAt,
      },
      projectId: projectMembers.projectId,
      id: projectMembers.id,
      createdAt: projectMembers.createdAt,
    })
    .from(projectMembers)
    .innerJoin(users, eq(users.id, projectMembers.userId))
    .where(eq(projectMembers.projectId, projectId))
    .orderBy(asc(projectMembers.createdAt), asc(projectMembers.id));
}

export async function getTasksByProjectId(
  projectId: string,
  userId: string,
  role: Role,
  page: number,
  limit: number,
) {
  const offset = (page - 1) * limit;

  const accessCondition = getTaskAccessCondition(userId, role);

  const whereCondition = and(
    eq(tasks.projectId, projectId),
    accessCondition,
  );

  const [totalResult, tasksList] = await Promise.all([
    db
      .select({
        count: count(),
      })
      .from(tasks)
      .where(whereCondition),

    db
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
      .where(whereCondition)
      .orderBy(asc(tasks.createdAt), asc(tasks.id))
      .limit(limit)
      .offset(offset),
  ]);

  const total = totalResult[0]?.count ?? 0;

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

export async function getAvailableUsersByProjectId(projectId: string) {
  const [currentProject] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId));

  if (!currentProject) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }

  const availableUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      position: users.position,
      avatar: users.avatar,
      createdAt: users.createdAt,
    })
    .from(users)
    .leftJoin(
      projectMembers,
      and(
        eq(projectMembers.userId, users.id),
        eq(projectMembers.projectId, projectId),
      ),
    )
    .where(isNull(projectMembers.id));

  return availableUsers;
}
