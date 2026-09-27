import { removeTaskAssignee } from "~~/server/services/task-assignees.service"
export default defineEventHandler(async (event) => {
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