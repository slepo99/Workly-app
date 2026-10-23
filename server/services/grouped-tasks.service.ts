import {
  and,
  asc,
  desc,
  ilike,
  inArray,
  or,
  sql,
} from "drizzle-orm";
import { db } from "~~/server/db";
import { projects, tasks } from "~~/server/db/schema";
import type { Role } from "~~/server/constants/roles";
import type { TaskStatus } from "~~/server/constants/taskStatuses";
import type { TaskSort } from "~~/server/constants/taskSort";
import { getTaskAccessCondition } from "~~/server/policies/task.policy";
import { getTaskAssigneesByTaskIds } from "~~/server/services/task-assignees.service";

export async function getGroupedTasks(
  userId: string,
  role: Role,
  page: number,
  limit: number,
  search: string,
  statuses: TaskStatus[],
  sort: TaskSort,
  order: "asc" | "desc",
) {
  const offset = (page - 1) * limit;

  const accessCondition = getTaskAccessCondition(
    userId,
    role,
  );

  const searchCondition = search
    ? or(
        ilike(tasks.title, `%${search}%`),
        ilike(tasks.description, `%${search}%`),
      )
    : undefined;

  const statusCondition = statuses.length
    ? inArray(tasks.status, statuses)
    : undefined;

  const taskWhereCondition = and(
    accessCondition,
    searchCondition,
    statusCondition,
  );

  const matchingProjectIds = db
    .selectDistinct({
      projectId: tasks.projectId,
    })
    .from(tasks)
    .where(taskWhereCondition);

  const [totalResult, projectList] = await Promise.all([
    db
      .select({
        count: sql<number>`
          cast(
            count(distinct ${tasks.projectId})
            as integer
          )
        `,
      })
      .from(tasks)
      .where(taskWhereCondition),

    db
      .select()
      .from(projects)
      .where(inArray(projects.id, matchingProjectIds))
      .orderBy(
        desc(projects.updatedAt),
        asc(projects.id),
      )
      .limit(limit)
      .offset(offset),
  ]);

  const total = totalResult[0]?.count ?? 0;

  if (!projectList.length) {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      projects: [],
    };
  }

  const projectIds = projectList.map(
    (project) => project.id,
  );

  const sortColumn = {
    updatedAt: tasks.updatedAt,
    createdAt: tasks.createdAt,
    startDate: tasks.startDate,
    endDate: tasks.endDate,
    title: tasks.title,
    status: tasks.status,
  }[sort];

  const orderCondition =
    order === "asc"
      ? sql`${sortColumn} asc nulls last`
      : sql`${sortColumn} desc nulls last`;

  const taskList = await db
    .select()
    .from(tasks)
    .where(
      and(
        inArray(tasks.projectId, projectIds),
        taskWhereCondition,
      ),
    )
    .orderBy(orderCondition, asc(tasks.id));

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
    const projectTasks =
      tasksByProjectId.get(task.projectId) ?? [];

    projectTasks.push(task);
    tasksByProjectId.set(task.projectId, projectTasks);
  }

  const projectsWithTasks = projectList.map((project) => ({
    ...project,
    tasks: tasksByProjectId.get(project.id) ?? [],
  }));

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    projects: projectsWithTasks,
  };
}