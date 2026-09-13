import { getProjectMembers } from '~~/server/services/project-members.service'

export default defineEventHandler(async () => {
  return await getProjectMembers()
})