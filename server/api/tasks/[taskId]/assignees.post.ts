import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { projectMembers } from "~~/server/db/schema";
import { addTaskAssignee } from "~~/server/services/task-assignees.service";
import { getTaskById } from "~~/server/services/tasks.service";
import {
  ROLE_GROUPS,
  type Role,
} from "~~/server/constants/roles";
import { requireRole } from "~~/server/utils/requireRole";

const bodySchema = z.object({
  userId: z.uuid(),
});

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(
    event,
    ROLE_GROUPS.MANAGEMENT,
  );

  const taskId = getRouterParam(event, "taskId");

  if (!taskId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Task ID is required",
    });
  }

  const task = await getTaskById(
    taskId,
    currentUser.id,
    currentUser.role as Role,
  );

  if (!task) {
    throw createError({
      statusCode: 404,
      statusMessage: "Task not found",
    });
  }

  const body = bodySchema.parse(await readBody(event));

  const [member] = await db
    .select()
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, task.projectId),
        eq(projectMembers.userId, body.userId),
      ),
    );

  if (!member) {
    throw createError({
      statusCode: 400,
      statusMessage: "User is not a member of this project",
    });
  }

  return addTaskAssignee(taskId, body.userId);
});