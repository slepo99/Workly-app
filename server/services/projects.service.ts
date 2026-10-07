import { db } from "~~/server/db";
import {
  projectMembers,
  projects,
  users,
  tasks,
  taskAssignees,
} from "~~/server/db/schema";
import { eq, and, count, desc, ilike, inArray } from "drizzle-orm";
import { ROLES, type Role } from "~~/server/constants/roles";
import { getTaskAssignees } from "./task-assignees.service";
import { TASK_STATUSES } from "~~/server/constants/taskStatuses";
import { deleteImageByUrl } from "~~/server/services/uploads.service";
import type { ProjectStatus } from "~~/server/constants/projectStatuses";
export async function createProject(
  userId: string,
  role: Role,
  data: {
    name: string;
    description?: string;
    status?: string;
    image?: string;
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

  let projectList;
  let total = 0;

  const searchCondition = search
    ? ilike(projects.name, `%${search}%`)
    : undefined;

  const statusCondition = statuses.length
    ? inArray(projects.status, statuses)
    : undefined;

  if (role === ROLES.SUPERADMIN || role === ROLES.ADMIN) {
    const totalResult = await db
      .select({
        count: count(),
      })
      .from(projects)
      .where(and(searchCondition, statusCondition));

    total = totalResult[0]?.count ?? 0;

    projectList = await db
      .select()
      .from(projects)
      .where(and(searchCondition, statusCondition))
      .orderBy(desc(projects.updatedAt))
      .limit(limit)
      .offset(offset);
  } else {
    const totalResult = await db
      .select({
        count: count(),
      })
      .from(projects)
      .innerJoin(projectMembers, eq(projectMembers.projectId, projects.id))
      .where(
        and(
          eq(projectMembers.userId, userId),
          searchCondition,
          statusCondition,
        ),
      );

    total = totalResult[0]?.count ?? 0;

    projectList = await db
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
      .innerJoin(projectMembers, eq(projectMembers.projectId, projects.id))
      .where(
        and(
          eq(projectMembers.userId, userId),
          searchCondition,
          statusCondition,
        ),
      )
      .orderBy(desc(projects.updatedAt))
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
export async function getProjectById(id: string, userId: string, role: Role) {
  let project;

  if (role === ROLES.SUPERADMIN || role === ROLES.ADMIN) {
    const result = await db.select().from(projects).where(eq(projects.id, id));

    project = result[0];
  } else {
    const result = await db
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
      .innerJoin(projectMembers, eq(projectMembers.projectId, projects.id))
      .where(and(eq(projects.id, id), eq(projectMembers.userId, userId)));

    project = result[0];
  }

  if (!project) {
    return undefined;
  }

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
  if (ROLES.ADMIN === role || ROLES.SUPERADMIN === role) {
    const rows = await db
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
      })
      .from(projectMembers)
      .innerJoin(users, eq(users.id, projectMembers.userId))
      .where(eq(projectMembers.projectId, projectId));

    return rows;
  }
  return null;
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
