import { getProjects } from '~~/server/services/projects.service'

export default defineEventHandler(async () => {
  return await getProjects()
})