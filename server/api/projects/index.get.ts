import { getProjects } from "~~/server/services/projects.service"
import { ROLE_GROUPS, type Role } from "~~/server/constants/roles"
import { requireRole } from "~~/server/utils/requireRole"
import {
  PROJECT_STATUSES,
  type ProjectStatus,
} from "~~/server/constants/projectStatuses"

export default defineEventHandler(async (event) => {
  const currentUser = await requireRole(
    event,
    ROLE_GROUPS.ALL,
  )

  const query = getQuery(event)

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 12

  const search =
    typeof query.search === "string"
      ? query.search.trim()
      : ""

  const rawStatus = query.status

  const statuses = (
    Array.isArray(rawStatus)
      ? rawStatus
      : rawStatus
        ? [rawStatus]
        : []
  ).filter((status): status is ProjectStatus =>
    Object.values(PROJECT_STATUSES).includes(
      status as ProjectStatus,
    ),
  )

  return await getProjects(
    currentUser.id,
    currentUser.role as Role,
    page,
    limit,
    search,
    statuses,
  )
})