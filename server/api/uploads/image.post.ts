import { uploadImage } from "~~/server/services/uploads.service"
import { ROLE_GROUPS } from "~~/server/constants/roles"
import { requireRole } from "~~/server/utils/requireRole"

export default defineEventHandler(async (event) => {
  await requireRole(
    event,
    ROLE_GROUPS.ALL,
  )

  const formData = await readMultipartFormData(event)

  const file = formData?.find(
    (item) => item.name === "file",
  )

  if (!file || !file.data || !file.filename || !file.type) {
    throw createError({
      statusCode: 400,
      statusMessage: "File is required",
    })
  }

  return await uploadImage({
    data: file.data,
    filename: file.filename,
    type: file.type,
  })
})