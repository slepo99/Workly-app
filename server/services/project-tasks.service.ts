import { and, asc, inArray } from "drizzle-orm";
import { db } from "~~/server/db";
import { tasks } from "~~/server/db/schema";
import type { Role } from "~~/server/constants/roles";
import type { ProjectStatus } from "~~/server/constants/projectStatuses";
import { getProjects } from "~~/server/services/projects.service";
import { getTaskAccessCondition } from "~~/server/policies/task.policy";
import { getTaskAssigneesByTaskIds } from "~~/server/services/task-assignees.service";

export async function getProjectsWithTasks(
  userId: string,
  role: Role,
  page: number,
  limit: number,
  search: string,
  statuses: ProjectStatus[],
) {
  const projectsResponse = await getProjects(
    userId,
    role,
    page,
    limit,
    search,
    statuses,
  );

  const projectIds = projectsResponse.projects.map((project) => project.id);

  if (!projectIds.length) {
    return projectsResponse;
  }

  const taskAccessCondition = getTaskAccessCondition(userId, role);

  const taskList = await db
    .select()
    .from(tasks)
    .where(
      and(
        inArray(tasks.projectId, projectIds),
        taskAccessCondition,
      ),
    )
    .orderBy(asc(tasks.createdAt), asc(tasks.id));

  const taskIds = taskList.map((task) => task.id);

  const assigneesByTaskId =
    await getTaskAssigneesByTaskIds(taskIds);

  const tasksWithAssignees = taskList.map((task) => ({
    ...task,
    assignees: assigneesByTaskId.get(task.id) ?? [],
  }));

  const tasksByProjectId = new Map<
    string,
    typeof tasksWithAssignees
  >();

  for (const task of tasksWithAssignees) {
    const projectTasks = tasksByProjectId.get(task.projectId) ?? [];

    projectTasks.push(task);
    tasksByProjectId.set(task.projectId, projectTasks);
  }

  return {
    ...projectsResponse,

    projects: projectsResponse.projects.map((project) => ({
      ...project,
      tasks: tasksByProjectId.get(project.id) ?? [],
    })),
  };
}