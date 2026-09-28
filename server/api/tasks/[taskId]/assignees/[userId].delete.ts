import { removeTaskAssignee } from "~~/server/services/task-assignees.service"
import { ROLE_GROUPS } from "~~/server/constants/roles"
import { requireRole } from "~~/server/utils/requireRole"

export default defineEventHandler(async (event) => {
  await requireRole(event, ROLE_GROUPS.MANAGEMENT)
  const taskId = getRouterParam(event, 'taskId')
  const userId = getRouterParam(event, 'userId')

  if (!taskId || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Task ID and User ID are required',
    })
  }

  return removeTaskAssignee(taskId, userId)
})