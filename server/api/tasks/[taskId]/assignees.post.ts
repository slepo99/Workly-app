import { z } from 'zod'
import { addTaskAssignee } from '~~/server/services/task-assignees.service'
const bodySchema = z.object({
  userId: z.string().uuid(),
})

export default defineEventHandler(async (event) => {
  const taskId = getRouterParam(event, 'taskId')

  if (!taskId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Task ID is required',
    })
  }

  const body = bodySchema.parse(await readBody(event))

  return addTaskAssignee(taskId, body.userId)
})
