import { db } from "~~/server/db";
import { users } from "~~/server/db/schema";
import { eq, ilike, count, asc, or } from "drizzle-orm";
import type { Role } from "~~/server/constants/roles";
import { deleteImageByUrl } from "~~/server/services/uploads.service";

const publicUserFields = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  position: users.position,
  avatar: users.avatar,
  createdAt: users.createdAt,
};
export async function getUsers(page: number, limit: number, search: string) {
  const offset = (page - 1) * limit;

  const searchCondition = search
    ? or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`))
    : undefined;

  const [totalResult, usersList] = await Promise.all([
    db
      .select({
        count: count(),
      })
      .from(users)
      .where(searchCondition),

    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        position: users.position,
        avatar: users.avatar,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(searchCondition)
      .orderBy(asc(users.createdAt), asc(users.id))
      .limit(limit)
      .offset(offset),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    users: usersList,
  };
}
export async function createUser(data: {
  name: string;
  email: string;
  position?: string;
  avatar?: string;
}) {
  const [user] = await db
    .insert(users)
    .values(data)
    .returning(publicUserFields);

  return user;
}

export async function getUserById(id: string) {
  const [user] = await db
    .select(publicUserFields)
    .from(users)
    .where(eq(users.id, id));

  return user;
}

export async function deleteUserById(id: string) {
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning(publicUserFields);

  if (!deletedUser) {
    return undefined;
  }

  if (deletedUser.avatar) {
    await deleteImageByUrl(deletedUser.avatar);
  }

  return deletedUser;
}

export async function updateUserById(
  id: string,
  data: {
    name?: string;
    email?: string;
    position?: string;
    avatar?: string;
  },
) {
  const [oldUser] = await db.select().from(users).where(eq(users.id, id));

  if (!oldUser) {
    return undefined;
  }

  const [updatedUser] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning(publicUserFields);

  if ("avatar" in data && oldUser.avatar && data.avatar !== oldUser.avatar) {
    await deleteImageByUrl(oldUser.avatar);
  }

  return updatedUser;
}

export async function updateUserRole(userId: string, role: Role) {
  const [user] = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, userId))
    .returning(publicUserFields);

  return user;
}
