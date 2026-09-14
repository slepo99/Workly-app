import { getTasks } from "~~/server/services/tasks.service";

export default defineEventHandler(async () => {
    return await getTasks()
})