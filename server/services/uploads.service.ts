import { randomUUID } from "node:crypto"
import { supabase } from "~~/server/utils/supabase"

export async function uploadImage(file: {
  data: Buffer
  filename: string
  type: string
}) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ]

  if (!allowedTypes.includes(file.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Unsupported image type",
    })
  }

  const maxSize = 5 * 1024 * 1024

  if (file.data.length > maxSize) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image is too large",
    })
  }

  const extension = file.filename
    .split(".")
    .pop()

  const fileName = `${randomUUID()}.${extension}`

  const bucket = process.env.SUPABASE_STORAGE_BUCKET

  if (!bucket) {
    throw new Error("SUPABASE_STORAGE_BUCKET is not defined")
  }

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file.data, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return {
    url: data.publicUrl,
    path: fileName,
  }
}
export async function deleteImage(path: string) {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET

  if (!bucket) {
    throw new Error("SUPABASE_STORAGE_BUCKET is not defined")
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return {
    success: true,
  }
}

export async function deleteImageByUrl(url: string) {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET

  if (!bucket) {
    throw new Error("SUPABASE_STORAGE_BUCKET is not defined")
  }

  const marker = `/storage/v1/object/public/${bucket}/`

  const path = url.split(marker)[1]

  if (!path) {
    return
  }

  await deleteImage(path)
}