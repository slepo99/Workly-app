import { db } from "~~/server/db";
import {
  projectMembers,
  projects,
  users,
  tasks,
  taskAssignees,
} from "~~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { ROLES, type Role } from "~~/server/constants/roles";
import { getTaskAssignees } from "./task-assignees.service";
export async function createProject(data: {
  name: string;
  description?: string;
  status?: string;
}) {
  const result = await db.insert(projects).values(data).returning();

  return result[0];
}

export async function getProjects(userId: string, role: Role) {
  if (role === ROLES.SUPERADMIN || role === ROLES.ADMIN) {
    return await db.select().from(projects);
  }

  return await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .innerJoin(projectMembers, eq(projectMembers.projectId, projects.id))
    .where(eq(projectMembers.userId, userId));
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
) {
  if (ROLES.ADMIN === role || ROLES.SUPERADMIN === role) {
    const tasksList = await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId));

    return Promise.all(
      tasksList.map(async (task) => ({
        ...task,
        assignees: await getTaskAssignees(task.id),
      })),
    );
  }
  if (ROLES.MANAGER === role) {
    const tasksList = await db
      .select({
        id: tasks.id,
        projectId: tasks.projectId,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        createdAt: tasks.createdAt,
      })
      .from(tasks)
      .innerJoin(projectMembers, eq(projectMembers.projectId, tasks.projectId))
      .where(
        and(eq(tasks.projectId, projectId), eq(projectMembers.userId, userId)),
      );
    return Promise.all(
      tasksList.map(async (task) => ({
        ...task,
        assignees: await getTaskAssignees(task.id),
      })),
    );
  }
  if (ROLES.WORKER === role) {
    const tasksList = await db
      .select({
        id: tasks.id,
        projectId: tasks.projectId,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        createdAt: tasks.createdAt,
      })
      .from(tasks)
      .innerJoin(taskAssignees, eq(taskAssignees.taskId, tasks.id))
      .where(
        and(eq(taskAssignees.userId, userId), eq(tasks.projectId, projectId)),
      );
    return Promise.all(
      tasksList.map(async (task) => ({
        ...task,
        assignees: await getTaskAssignees(task.id),
      })),
    );
  }
}
