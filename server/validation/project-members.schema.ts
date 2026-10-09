import { z } from "zod";

export const createProjectMemberSchema = z.object({
  projectId: z.uuid(),

  members: z
    .array(
      z.object({
        userId: z.uuid(),
        role: z.string().min(1).max(50),
      }),
    )
    .min(1)
    .refine(
      (members) => {
        const userIds = members.map((member) => member.userId);

        return new Set(userIds).size === userIds.length;
      },
      {
        message: "Duplicate users are not allowed",
      },
    ),
});
export const updateProjectMemberRoleSchema = z.object({
  projectId: z.uuid(),
  userId: z.uuid(),
  role: z.string().min(1).max(50),
});