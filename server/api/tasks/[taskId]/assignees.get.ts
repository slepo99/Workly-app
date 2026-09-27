import { getTaskAssignees } from "~~/server/services/task-assignees.service"
export default defineEventHandler(async (event) => {
  const taskId = getRouterParam(event, 'taskId')

  if (!taskId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Task ID is required',
    })
  }

  return getTaskAssignees(taskId)
})