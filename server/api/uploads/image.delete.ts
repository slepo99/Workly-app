import { deleteImage } from "~~/server/services/uploads.service"
import { ROLE_GROUPS } from "~~/server/constants/roles"
import { requireRole } from "~~/server/utils/requireRole"

export default defineEventHandler(async (event) => {
  await requireRole(
    event,
    ROLE_GROUPS.ALL,
  )

  const body = await readBody(event)

  if (!body?.path) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image path is required",
    })
  }

  return await deleteImage(body.path)
})