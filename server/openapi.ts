type OpenApiSchema = Record<string, unknown>;

const cookieSecurity = [{ cookieAuth: [] }];

const jsonRequest = (schema: OpenApiSchema) => ({
  required: true,
  content: {
    "application/json": {
      schema,
    },
  },
});

const jsonResponse = (description: string, schema: OpenApiSchema) => ({
  description,
  content: {
    "application/json": {
      schema,
    },
  },
});

const ref = (name: string) => ({
  $ref: `#/components/schemas/${name}`,
});

const responseRef = (name: string) => ({
  $ref: `#/components/responses/${name}`,
});

export const openapi = {
  openapi: "3.0.3",

  info: {
    title: "Workly API",
    version: "1.0.0",
    description:
      "REST API for Workly project management. Authentication uses the auth_token HttpOnly cookie.",
  },

  servers: [
    {
      url: "/api",
      description: "Current Workly server",
    },
  ],

  tags: [
    { name: "Auth", description: "Authentication and current session" },
    { name: "Dashboard", description: "Dashboard statistics" },
    { name: "Roles", description: "Application roles" },
    { name: "Users", description: "Users and role management" },
    {
      name: "Projects",
      description: "Projects, project members and project tasks",
    },
    { name: "Project members", description: "Project membership records" },
    { name: "Tasks", description: "Tasks and task assignees" },
    { name: "Uploads", description: "Image upload and deletion" },
  ],

  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        operationId: "register",
        summary: "Register user",
        requestBody: jsonRequest(ref("RegisterRequest")),
        responses: {
          200: jsonResponse("Registered user", ref("User")),
          400: responseRef("ValidationError"),
          409: responseRef("Conflict"),
          500: responseRef("ServerError"),
        },
      },
    },

    "/auth/login": {
      post: {
        tags: ["Auth"],
        operationId: "login",
        summary: "Log in",
        description:
          "Validates credentials and sets the auth_token HttpOnly cookie for 7 days.",
        requestBody: jsonRequest(ref("LoginRequest")),
        responses: {
          200: jsonResponse("Logged in user", ref("User")),
          400: responseRef("ValidationError"),
          401: responseRef("Unauthorized"),
        },
      },
    },

    "/auth/me": {
      get: {
        tags: ["Auth"],
        operationId: "getCurrentUser",
        summary: "Get current user",
        security: cookieSecurity,
        responses: {
          200: jsonResponse("Current authenticated user", ref("User")),
          401: responseRef("Unauthorized"),
        },
      },
    },

    "/auth/logout": {
      post: {
        tags: ["Auth"],
        operationId: "logout",
        summary: "Log out",
        description: "Deletes the auth_token cookie.",
        responses: {
          200: jsonResponse("Logged out", ref("SuccessResponse")),
        },
      },
    },

    "/dashboard/stats": {
      get: {
        tags: ["Dashboard"],
        operationId: "getDashboardStats",
        summary: "Get dashboard statistics",
        description:
          "Statistics are scoped by the current user's global role and project/task membership.",
        security: cookieSecurity,
        responses: {
          200: jsonResponse("Dashboard statistics", ref("DashboardStats")),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
        },
      },
    },

    "/roles": {
      get: {
        tags: ["Roles"],
        operationId: "getRoles",
        summary: "Get application roles",
        security: cookieSecurity,
        responses: {
          200: jsonResponse("Role constants", ref("RolesResponse")),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
        },
      },
    },

    "/users": {
      get: {
        tags: ["Users"],
        operationId: "getUsers",
        summary: "Get all users",
        security: cookieSecurity,
        responses: {
          200: jsonResponse("Users", {
            type: "array",
            items: ref("User"),
          }),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
        },
      },

      post: {
        tags: ["Users"],
        operationId: "createUser",
        summary: "Create user",
        description: "Allowed for superadmin, admin and manager.",
        security: cookieSecurity,
        requestBody: jsonRequest(ref("CreateUserRequest")),
        responses: {
          200: jsonResponse("Created user", ref("User")),
          400: responseRef("ValidationError"),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          409: responseRef("Conflict"),
        },
      },
    },

    "/users/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "User ID",
          schema: { type: "string", format: "uuid" },
        },
      ],

      get: {
        tags: ["Users"],
        operationId: "getUserById",
        summary: "Get user by ID",
        security: cookieSecurity,
        responses: {
          200: jsonResponse("User", ref("User")),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },

      patch: {
        tags: ["Users"],
        operationId: "updateUser",
        summary: "Update user",
        description:
          "A user can update themselves. Admin and superadmin can update other users.",
        security: cookieSecurity,
        requestBody: jsonRequest(ref("UpdateUserRequest")),
        responses: {
          200: jsonResponse("Updated user", ref("User")),
          400: responseRef("ValidationError"),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },

      delete: {
        tags: ["Users"],
        operationId: "deleteUser",
        summary: "Delete user",
        description: "Allowed for superadmin, admin and manager.",
        security: cookieSecurity,
        responses: {
          200: jsonResponse("Deleted user", ref("User")),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },
    },

    "/users/{id}/role": {
      patch: {
        tags: ["Users"],
        operationId: "updateUserRole",
        summary: "Update user role",
        description:
          "Only superadmin/admin can use this endpoint. Assignable roles are additionally restricted by ROLE_ASSIGNMENTS.",
        security: cookieSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "User ID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: jsonRequest(ref("UpdateUserRoleRequest")),
        responses: {
          200: jsonResponse("Updated user", ref("User")),
          400: responseRef("ValidationError"),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },
    },

    "/projects": {
      get: {
        tags: ["Projects"],
        operationId: "getProjects",
        summary: "Get projects",
        description:
          "Admin/superadmin see all projects. Manager/worker see projects where they are members.",
        security: cookieSecurity,
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 12 },
          },
          {
            name: "search",
            in: "query",
            description: "Case-insensitive project name search",
            schema: { type: "string" },
          },
          {
            name: "status",
            in: "query",
            description:
              "Project status filter. The query can contain one status or repeated status parameters.",
            style: "form",
            explode: true,
            schema: {
              type: "array",
              items: ref("ProjectStatus"),
            },
          },
        ],
        responses: {
          200: jsonResponse("Paginated projects", ref("ProjectsPage")),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
        },
      },

      post: {
        tags: ["Projects"],
        operationId: "createProject",
        summary: "Create project",
        description:
          "Allowed for superadmin, admin and manager. The creator is automatically added to project_members.",
        security: cookieSecurity,
        requestBody: jsonRequest(ref("CreateProjectRequest")),
        responses: {
          200: jsonResponse("Created project", ref("Project")),
          400: responseRef("ValidationError"),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          500: responseRef("ServerError"),
        },
      },
    },

    "/projects/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Project ID",
          schema: { type: "string", format: "uuid" },
        },
      ],

      get: {
        tags: ["Projects"],
        operationId: "getProjectById",
        summary: "Get project by ID",
        description:
          "Admin/superadmin can read any project. Manager/worker can read only projects where they are members.",
        security: cookieSecurity,
        responses: {
          200: jsonResponse(
            "Project with task statistics",
            ref("ProjectWithStats"),
          ),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },

      patch: {
        tags: ["Projects"],
        operationId: "updateProject",
        summary: "Update project",
        description:
          "Allowed for superadmin, admin and manager. Replacing/removing image also removes the previous Storage object.",
        security: cookieSecurity,
        requestBody: jsonRequest(ref("UpdateProjectRequest")),
        responses: {
          200: jsonResponse("Updated project", ref("Project")),
          400: responseRef("ValidationError"),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },

      delete: {
        tags: ["Projects"],
        operationId: "deleteProject",
        summary: "Delete project",
        description:
          "Allowed for superadmin, admin and manager. Database cascades delete project_members, tasks and task_assignees. Project image is also removed from Storage.",
        security: cookieSecurity,
        responses: {
          200: jsonResponse("Deleted project", ref("Project")),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },
    },

    "/projects/{id}/members": {
      get: {
        tags: ["Projects"],
        operationId: "getProjectMembersByProjectId",
        summary: "Get project members",
        description:
          "Admin/superadmin can read any project members. Manager/worker must be a member of the project.",
        security: cookieSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Project ID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: jsonResponse("Project members", {
            type: "array",
            items: ref("ProjectMemberWithUser"),
          }),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },
    },

    "/projects/{id}/tasks": {
      get: {
        tags: ["Projects", "Tasks"],
        operationId: "getProjectTasks",
        summary: "Get tasks for project",
        description:
          "Admin/superadmin see all project tasks. Manager sees tasks for projects they belong to. Worker sees assigned tasks only.",
        security: cookieSecurity,
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Project ID",
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 20 },
          },
        ],
        responses: {
          200: jsonResponse("Paginated project tasks", ref("ProjectTasksPage")),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
        },
      },
    },

    "/project-members": {
      get: {
        tags: ["Project members"],
        operationId: "getProjectMemberships",
        summary: "Get all project membership records",
        description: "Allowed only for superadmin and admin.",
        security: cookieSecurity,
        responses: {
          200: jsonResponse("Project membership records", {
            type: "array",
            items: ref("ProjectMember"),
          }),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
        },
      },

      post: {
        tags: ["Project members"],
        operationId: "createProjectMembers",
        summary: "Add users to project",
        description:
          "Adds one or more users to a project. Existing memberships are skipped.",
        security: cookieSecurity,
        requestBody: jsonRequest(ref("CreateProjectMembersRequest")),
        responses: {
          200: jsonResponse("Created project memberships", {
            type: "array",
            items: ref("ProjectMemberRecord"),
          }),
          400: responseRef("ValidationError"),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },
    },
    "/projects/{id}/available-users": {
      get: {
        tags: ["Projects"],
        operationId: "getAvailableUsersByProjectId",
        summary: "Get users available to add to project",
        description:
          "Returns users who are not currently members of the specified project.",
        security: cookieSecurity,

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],

        responses: {
          200: jsonResponse("List of available users", {
            type: "array",
            items: ref("User"),
          }),

          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },
    },

    "/tasks": {
      get: {
        tags: ["Tasks"],
        operationId: "getTasks",
        summary: "Get tasks",
        description:
          "Admin/superadmin see all tasks. Manager sees tasks from their projects. Worker sees tasks assigned to them.",
        security: cookieSecurity,
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 20 },
          },
        ],
        responses: {
          200: jsonResponse("Paginated tasks", ref("TasksPage")),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
        },
      },

      post: {
        tags: ["Tasks"],
        operationId: "createTask",
        summary: "Create task",
        description:
          "Allowed for superadmin, admin and manager. assigneeIds must contain project members. Assignees are stored in task_assignees.",
        security: cookieSecurity,
        requestBody: jsonRequest(ref("CreateTaskRequest")),
        responses: {
          200: jsonResponse("Created task with assignees", ref("Task")),
          400: responseRef("ValidationError"),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
          500: responseRef("ServerError"),
        },
      },
    },

    "/tasks/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Task ID",
          schema: { type: "string", format: "uuid" },
        },
      ],

      get: {
        tags: ["Tasks"],
        operationId: "getTaskById",
        summary: "Get task by ID",
        description:
          "Admin/superadmin can read any task. Manager can read tasks from projects they belong to. Worker can read only tasks assigned to them.",
        security: cookieSecurity,
        responses: {
          200: jsonResponse("Task with assignees", ref("Task")),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },

      patch: {
        tags: ["Tasks"],
        operationId: "updateTask",
        summary: "Update task",
        description:
          "Allowed for superadmin, admin and manager. If assigneeIds is omitted, assignees stay unchanged. If assigneeIds is [], all assignees are removed. Otherwise the array fully replaces the current assignee list.",
        security: cookieSecurity,
        requestBody: jsonRequest(ref("UpdateTaskRequest")),
        responses: {
          200: jsonResponse("Updated task with assignees", ref("Task")),
          400: responseRef("ValidationError"),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },

      delete: {
        tags: ["Tasks"],
        operationId: "deleteTask",
        summary: "Delete task",
        description:
          "Allowed for superadmin, admin and manager. task_assignees rows are deleted by database cascade.",
        security: cookieSecurity,
        responses: {
          200: jsonResponse("Deleted task", ref("TaskRecord")),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },
    },

    "/tasks/{taskId}/assignees": {
      parameters: [
        {
          name: "taskId",
          in: "path",
          required: true,
          description: "Task ID",
          schema: { type: "string", format: "uuid" },
        },
      ],

      get: {
        tags: ["Tasks"],
        operationId: "getTaskAssignees",
        summary: "Get task assignees",
        description:
          "Uses the same resource-level access rules as GET /tasks/{id}.",
        security: cookieSecurity,
        responses: {
          200: jsonResponse("Task assignees", {
            type: "array",
            items: ref("TaskAssignee"),
          }),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },

      post: {
        tags: ["Tasks"],
        operationId: "addTaskAssignee",
        summary: "Add one task assignee",
        description:
          "Legacy granular assignee endpoint kept alongside PATCH /tasks/{id}. Allowed for superadmin, admin and manager. The caller must have access to the task and the added user must be a member of the task project.",
        security: cookieSecurity,
        requestBody: jsonRequest(ref("AddTaskAssigneeRequest")),
        responses: {
          200: jsonResponse(
            "Created task-assignee relation",
            ref("TaskAssigneeLink"),
          ),
          400: responseRef("ValidationError"),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          404: responseRef("NotFound"),
        },
      },
    },

    "/tasks/{taskId}/assignees/{userId}": {
      delete: {
        tags: ["Tasks"],
        operationId: "removeTaskAssignee",
        summary: "Remove one task assignee",
        description:
          "Legacy granular assignee endpoint kept alongside PATCH /tasks/{id}. Allowed for superadmin, admin and manager. The caller must have access to the task and the added user must be a member of the task project.",
        security: cookieSecurity,
        parameters: [
          {
            name: "taskId",
            in: "path",
            required: true,
            description: "Task ID",
            schema: { type: "string", format: "uuid" },
          },
          {
            name: "userId",
            in: "path",
            required: true,
            description: "User ID",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description:
              "Deleted task-assignee relation. If no matching relation exists, the current handler may return an empty response.",
            content: {
              "application/json": {
                schema: ref("TaskAssigneeLink"),
              },
            },
          },
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
        },
      },
    },

    "/uploads/image": {
      post: {
        tags: ["Uploads"],
        operationId: "uploadImage",
        summary: "Upload image",
        description:
          "Accepts JPEG, PNG or WebP up to 5 MB and stores it in the configured Supabase Storage bucket.",
        security: cookieSecurity,
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: jsonResponse("Uploaded image", ref("UploadImageResponse")),
          400: responseRef("ValidationError"),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          500: responseRef("ServerError"),
        },
      },

      delete: {
        tags: ["Uploads"],
        operationId: "deleteImage",
        summary: "Delete image",
        security: cookieSecurity,
        requestBody: jsonRequest(ref("DeleteImageRequest")),
        responses: {
          200: jsonResponse("Image deleted", ref("SuccessResponse")),
          400: responseRef("ValidationError"),
          401: responseRef("Unauthorized"),
          403: responseRef("Forbidden"),
          500: responseRef("ServerError"),
        },
      },
    },
  },

  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "auth_token",
        description: "JWT stored in the auth_token HttpOnly cookie.",
      },
    },

    responses: {
      ValidationError: {
        description: "Invalid request data",
        content: {
          "application/json": {
            schema: ref("ApiError"),
          },
        },
      },
      Unauthorized: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: ref("ApiError"),
          },
        },
      },
      Forbidden: {
        description: "Forbidden",
        content: {
          "application/json": {
            schema: ref("ApiError"),
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: ref("ApiError"),
          },
        },
      },
      Conflict: {
        description: "Resource conflict",
        content: {
          "application/json": {
            schema: ref("ApiError"),
          },
        },
      },
      ServerError: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: ref("ApiError"),
          },
        },
      },
    },

    schemas: {
      Role: {
        type: "string",
        enum: ["superadmin", "admin", "manager", "worker"],
      },

      AssignableRole: {
        type: "string",
        enum: ["admin", "manager", "worker"],
      },

      ProjectStatus: {
        type: "string",
        enum: ["active", "on_hold", "completed", "cancelled"],
      },

      TaskStatus: {
        type: "string",
        enum: ["pending", "in_progress", "completed", "cancelled"],
      },

      ApiError: {
        type: "object",
        properties: {
          statusCode: { type: "integer", example: 400 },
          statusMessage: { type: "string", example: "Invalid request" },
          message: { type: "string", example: "Invalid request" },
        },
      },

      SuccessResponse: {
        type: "object",
        required: ["success"],
        properties: {
          success: { type: "boolean", example: true },
        },
      },

      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            example: "Timur Developer",
          },
          email: {
            type: "string",
            format: "email",
            example: "timur@example.com",
          },
          password: {
            type: "string",
            minLength: 6,
            example: "password123",
          },
        },
      },

      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "timur@example.com",
          },
          password: {
            type: "string",
            minLength: 6,
            example: "password123",
          },
        },
      },

      User: {
        type: "object",
        required: ["id", "name", "email", "role", "createdAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", maxLength: 100 },
          email: { type: "string", format: "email" },
          role: ref("Role"),
          position: { type: "string", maxLength: 100, nullable: true },
          avatar: { type: "string", format: "uri", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      CreateUserRequest: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 100 },
          email: { type: "string", format: "email" },
          position: { type: "string", maxLength: 100 },
          avatar: { type: "string", format: "uri", maxLength: 500 },
        },
      },

      UpdateUserRequest: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1, maxLength: 100 },
          email: { type: "string", format: "email" },
          position: { type: "string", maxLength: 100 },
          avatar: { type: "string", format: "uri", maxLength: 500 },
        },
      },

      UpdateUserRoleRequest: {
        type: "object",
        required: ["role"],
        properties: {
          role: ref("AssignableRole"),
        },
      },

      RolesResponse: {
        type: "object",
        required: ["SUPERADMIN", "ADMIN", "MANAGER", "WORKER"],
        properties: {
          SUPERADMIN: { type: "string", enum: ["superadmin"] },
          ADMIN: { type: "string", enum: ["admin"] },
          MANAGER: { type: "string", enum: ["manager"] },
          WORKER: { type: "string", enum: ["worker"] },
        },
        example: {
          SUPERADMIN: "superadmin",
          ADMIN: "admin",
          MANAGER: "manager",
          WORKER: "worker",
        },
      },

      DashboardStats: {
        type: "object",
        required: [
          "totalTasks",
          "completedTasks",
          "totalProjects",
          "totalUsers",
        ],
        properties: {
          totalTasks: { type: "integer", minimum: 0, example: 42 },
          completedTasks: { type: "integer", minimum: 0, example: 17 },
          totalProjects: { type: "integer", minimum: 0, example: 8 },
          totalUsers: { type: "integer", minimum: 0, example: 24 },
        },
      },

      Project: {
        type: "object",
        required: ["id", "name", "status", "createdAt", "updatedAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", maxLength: 150 },
          description: { type: "string", maxLength: 1000, nullable: true },
          status: ref("ProjectStatus"),
          image: { type: "string", format: "uri", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      ProjectWithStats: {
        allOf: [
          ref("Project"),
          {
            type: "object",
            required: ["tasksCount", "completionPercent"],
            properties: {
              tasksCount: { type: "integer", minimum: 0, example: 12 },
              completionPercent: {
                type: "integer",
                minimum: 0,
                maximum: 100,
                example: 67,
              },
            },
          },
        ],
      },

      ProjectsPage: {
        type: "object",
        required: ["page", "limit", "total", "totalPages", "projects"],
        properties: {
          page: { type: "integer", minimum: 1, example: 1 },
          limit: { type: "integer", minimum: 1, example: 12 },
          total: { type: "integer", minimum: 0, example: 30 },
          totalPages: { type: "integer", minimum: 0, example: 3 },
          projects: {
            type: "array",
            items: ref("ProjectWithStats"),
          },
        },
      },

      CreateProjectRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 150 },
          description: { type: "string", maxLength: 1000 },
          status: ref("ProjectStatus"),
          image: { type: "string", format: "uri", nullable: true },
        },
      },

      UpdateProjectRequest: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1, maxLength: 150 },
          description: { type: "string", maxLength: 1000 },
          status: ref("ProjectStatus"),
          image: { type: "string", format: "uri", nullable: true },
        },
      },

      ProjectMember: {
        type: "object",
        required: ["id", "userId", "projectId", "role", "createdAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          projectId: { type: "string", format: "uuid" },
          role: { type: "string", minLength: 1, maxLength: 50 },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      ProjectMemberWithUser: {
        type: "object",
        required: ["role", "user", "projectId"],
        properties: {
          role: { type: "string", maxLength: 50 },
          user: ref("User"),
          projectId: { type: "string", format: "uuid" },
        },
      },

      CreateProjectMembersRequest: {
        type: "object",
        required: ["projectId", "members"],
        properties: {
          projectId: {
            type: "string",
            format: "uuid",
          },
          members: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["userId", "role"],
              properties: {
                userId: {
                  type: "string",
                  format: "uuid",
                },
                role: {
                  type: "string",
                  minLength: 1,
                  maxLength: 50,
                },
              },
            },
            example: [
              {
                userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                role: "developer",
              },
              {
                userId: "8fa85f64-5717-4562-b3fc-2c963f66afa7",
                role: "manager",
              },
            ],
          },
        },
      },

      TaskAssignee: {
        type: "object",
        required: ["id", "name"],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          avatar: { type: "string", format: "uri", nullable: true },
        },
      },

      TaskAssigneeLink: {
        type: "object",
        required: ["id", "taskId", "userId", "createdAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          taskId: { type: "string", format: "uuid" },
          userId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      TaskRecord: {
        type: "object",
        required: [
          "id",
          "projectId",
          "title",
          "status",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          id: { type: "string", format: "uuid" },
          projectId: { type: "string", format: "uuid" },
          title: { type: "string", maxLength: 150 },
          description: { type: "string", maxLength: 1000, nullable: true },
          status: ref("TaskStatus"),
          startDate: { type: "string", format: "date-time", nullable: true },
          endDate: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      Task: {
        allOf: [
          ref("TaskRecord"),
          {
            type: "object",
            required: ["assignees"],
            properties: {
              assignees: {
                type: "array",
                items: ref("TaskAssignee"),
              },
            },
          },
        ],
      },

      TasksPage: {
        type: "object",
        required: ["page", "limit", "total", "totalPages", "tasks"],
        properties: {
          page: { type: "integer", minimum: 1, example: 1 },
          limit: { type: "integer", minimum: 1, example: 20 },
          total: { type: "integer", minimum: 0, example: 137 },
          totalPages: { type: "integer", minimum: 0, example: 7 },
          tasks: {
            type: "array",
            items: ref("Task"),
          },
        },
      },

      ProjectTaskRecord: {
        type: "object",
        required: ["id", "projectId", "title", "status", "createdAt"],
        description:
          "Task shape returned by GET /projects/{id}/tasks. updatedAt is present for admin/superadmin responses but is currently omitted by manager/worker selects.",
        properties: {
          id: { type: "string", format: "uuid" },
          projectId: { type: "string", format: "uuid" },
          title: { type: "string", maxLength: 150 },
          description: { type: "string", maxLength: 1000, nullable: true },
          status: ref("TaskStatus"),
          startDate: { type: "string", format: "date-time", nullable: true },
          endDate: { type: "string", format: "date-time", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      ProjectTask: {
        allOf: [
          ref("ProjectTaskRecord"),
          {
            type: "object",
            required: ["assignees"],
            properties: {
              assignees: {
                type: "array",
                items: ref("TaskAssignee"),
              },
            },
          },
        ],
      },

      ProjectTasksPage: {
        type: "object",
        required: ["page", "limit", "total", "totalPages", "tasks"],
        properties: {
          page: { type: "integer", minimum: 1, example: 1 },
          limit: { type: "integer", minimum: 1, example: 20 },
          total: { type: "integer", minimum: 0, example: 42 },
          totalPages: { type: "integer", minimum: 0, example: 3 },
          tasks: {
            type: "array",
            items: ref("ProjectTask"),
          },
        },
      },

      CreateTaskRequest: {
        type: "object",
        required: ["projectId", "title"],
        properties: {
          projectId: { type: "string", format: "uuid" },
          assigneeIds: {
            type: "array",
            items: { type: "string", format: "uuid" },
            example: ["3fa85f64-5717-4562-b3fc-2c963f66afa6"],
          },
          title: { type: "string", minLength: 1, maxLength: 150 },
          description: { type: "string", maxLength: 1000 },
          status: ref("TaskStatus"),
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
        },
      },

      UpdateTaskRequest: {
        type: "object",
        properties: {
          projectId: { type: "string", format: "uuid" },
          assigneeIds: {
            type: "array",
            description:
              "Full assignee list. Omit to keep current assignees. Send [] to remove all assignees.",
            items: { type: "string", format: "uuid" },
            example: [],
          },
          title: { type: "string", minLength: 1, maxLength: 150 },
          description: { type: "string", maxLength: 1000 },
          status: ref("TaskStatus"),
          startDate: { type: "string", format: "date-time" },
          endDate: { type: "string", format: "date-time" },
        },
      },

      AddTaskAssigneeRequest: {
        type: "object",
        required: ["userId"],
        properties: {
          userId: { type: "string", format: "uuid" },
        },
      },

      UploadImageResponse: {
        type: "object",
        required: ["url", "path"],
        properties: {
          url: { type: "string", format: "uri" },
          path: {
            type: "string",
            example: "08e18f96-a9ab-45c8-8b9f-731d8272e573.webp",
          },
        },
      },

      DeleteImageRequest: {
        type: "object",
        required: ["path"],
        properties: {
          path: {
            type: "string",
            example: "08e18f96-a9ab-45c8-8b9f-731d8272e573.webp",
          },
        },
      },
    },
  },
};
