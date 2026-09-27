import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { db } from "~~/server/db"
import { users } from "~~/server/db/schema"

export async function registerUser(data: {
  name: string
  email: string
  password: string
}) {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: "User with this email already exists",
    })
  }

  const passwordHash = await bcrypt.hash(data.password, 12)

  const [user] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      passwordHash,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      position: users.position,
      avatar: users.avatar,
      createdAt: users.createdAt,
    })

  if (!user) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create user",
    })
  }

  return user
}

export async function loginUser(data: {
  email: string
  password: string
}) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))

  if (!user || !user.passwordHash) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password",
    })
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.passwordHash,
  )

  if (!passwordMatches) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password",
    })
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    position: user.position,
    avatar: user.avatar,
    createdAt: user.createdAt,
  }
}
