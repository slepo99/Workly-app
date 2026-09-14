import { updateTaskById } from "~~/server/services/tasks.service";
import { updateTaskSchema } from "~~/server/validation/tasks.schema";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Task ID is required'
        })
    }
    const body = await readBody(event)
    const data = updateTaskSchema.parse(body)

    const task = await updateTaskById(id, data)

    if (!task) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Task not found'
        })
    }
    
    return task
})