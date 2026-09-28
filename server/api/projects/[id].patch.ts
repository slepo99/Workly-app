import { updateProjectById } from "~~/server/services/projects.service";
import { updateProjectSchema } from "~~/server/validation/projects.schema";
import { ROLE_GROUPS } from "~~/server/constants/roles"
import { requireRole } from "~~/server/utils/requireRole"

export default defineEventHandler(async (event) => {
  await requireRole(event, ROLE_GROUPS.MANAGEMENT)
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Project ID is required",
    });
  }

  const body = await readBody(event);
  const data = updateProjectSchema.parse(body);

  const project = await updateProjectById(id, data);

  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: "Project not found",
    });
  }

  return project;
});
