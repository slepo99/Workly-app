import { eq, inArray } from "drizzle-orm";
import { db } from "~~/server/db";
import {
  tasks,
  projectMembers,
  taskAssignees,
} from "~~/server/db/schema";
import { ROLES, type Role } from "~~/server/constants/roles";

export function getTaskAccessCondition(
  userId: string,
  role: Role,
) {
  if (role === ROLES.SUPERADMIN || role === ROLES.ADMIN) {
    return undefined;
  }

  if (role === ROLES.MANAGER) {
    const availableProjects = db
      .select({
        projectId: projectMembers.projectId,
      })
      .from(projectMembers)
      .where(eq(projectMembers.userId, userId));

    return inArray(tasks.projectId, availableProjects);
  }

  const assignedTasks = db
    .select({
      taskId: taskAssignees.taskId,
    })
    .from(taskAssignees)
    .where(eq(taskAssignees.userId, userId));

  return inArray(tasks.id, assignedTasks);
}