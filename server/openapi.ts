export const openapi = {
  openapi: "3.0.0",

  info: {
    title: "Workly API",

    version: "1.0.0",
  },

  servers: [
    {
      url: "http://localhost:3000/api",
    },
  ],

  paths: {
    // =========================

    // AUTH

    // =========================

    "/auth/register": {
      post: {
        summary: "Register a new user",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["name", "email", "password"],

                properties: {
                  name: {
                    type: "string",

                    minLength: 2,

                    maxLength: 100,

                    example: "John Doe",
                  },

                  email: {
                    type: "string",

                    format: "email",

                    example: "john\\@example.com",
                  },

                  password: {
                    type: "string",

                    minLength: 6,

                    example: "password123",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: { description: "Registered user" },

          409: { description: "User with this email already exists" },
        },
      },
    },

    "/auth/login": {
      post: {
        summary: "Log in",

        description:
          "Validates credentials and stores the JWT in the auth_token HttpOnly cookie.",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["email", "password"],

                properties: {
                  email: {
                    type: "string",

                    format: "email",

                    example: "john\\@example.com",
                  },

                  password: {
                    type: "string",

                    minLength: 6,

                    example: "password123",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: { description: "Logged in user" },

          401: { description: "Invalid email or password" },
        },
      },
    },

    "/auth/me": {
      get: {
        summary: "Get current authenticated user",

        security: [{ cookieAuth: [] }],

        responses: {
          200: { description: "Current user" },

          401: { description: "Unauthorized or invalid token" },
        },
      },
    },

    "/auth/logout": {
      post: {
        summary: "Log out",

        description: "Deletes the auth_token cookie.",

        security: [{ cookieAuth: [] }],

        responses: {
          200: { description: "Logged out successfully" },
        },
      },
    },

    // =========================

    // ROLES

    // =========================

    "/roles": {
      get: {
        summary: "Get available user roles",

        responses: {
          200: {
            description: "List of available user roles",

            content: {
              "application/json": {
                schema: {
                  type: "array",

                  items: {
                    type: "string",

                    enum: ["superadmin", "admin", "manager", "worker"],
                  },

                  example: ["superadmin", "admin", "manager", "worker"],
                },
              },
            },
          },
        },
      },
    }, // USERS

    // =========================

    // =========================

    "/users": {
      get: {
        summary: "Get all users",

        responses: {
          200: {
            description: "List of users",
          },
        },
      },

      post: {
        summary: "Create a user",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["name", "email"],

                properties: {
                  name: {
                    type: "string",

                    maxLength: 100,

                    example: "John Doe",
                  },

                  email: {
                    type: "string",

                    format: "email",

                    example: "john\\\\\\\\@example.com",
                  },

                  position: {
                    type: "string",

                    maxLength: 100,

                    example: "Frontend Developer",
                  },

                  avatar: {
                    type: "string",

                    format: "uri",

                    maxLength: 500,

                    example: "https\\\\\\\\://example.com/avatar.jpg",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: "Created user",
          },
        },
      },
    },

    "/users/{id}": {
      get: {
        summary: "Get user by ID",

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
          200: {
            description: "User",
          },
        },
      },

      patch: {
        summary: "Update user",

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

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  name: {
                    type: "string",

                    maxLength: 100,

                    example: "John Doe",
                  },

                  email: {
                    type: "string",

                    format: "email",

                    example: "john\\\\\\\\@example.com",
                  },

                  position: {
                    type: "string",

                    maxLength: 100,

                    example: "Senior Frontend Developer",
                  },

                  avatar: {
                    type: "string",

                    format: "uri",

                    maxLength: 500,

                    example: "https\\\\\\\\://example.com/avatar.jpg",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: "Updated user",
          },
        },
      },

      delete: {
        summary: "Delete user",

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
          200: {
            description: "Deleted user",
          },
        },
      },
    },

    "/users/{id}/role": {
      patch: {
        summary: "Update user role",

        description:
          "Only superadmin and admin can change user roles. Superadmin can manage admin, manager and worker roles. Admin can manage manager and worker roles.",

        security: [{ cookieAuth: [] }],

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

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["role"],

                properties: {
                  role: {
                    type: "string",

                    enum: ["admin", "manager", "worker"],

                    example: "manager",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: { description: "Updated user" },

          400: {
            description: "User ID is required or request body is invalid",
          },

          403: { description: "Forbidden" },

          404: { description: "User not found" },
        },
      },
    },
        // DASHBOARD

    // =========================

    // =========================
    "/dashboard/stats": {
      get: {
        summary: "Get dashboard statistics",

        security: [{ cookieAuth: [] }],

        responses: {
          200: {
            description: "Dashboard statistics for the current user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalTasks: {
                      type: "integer",
                      example: 120,
                    },

                    completedTasks: {
                      type: "integer",
                      example: 84,
                    },

                    totalProjects: {
                      type: "integer",
                      example: 12,
                    },

                    totalUsers: {
                      type: "integer",
                      example: 37,
                    },
                  },
                },
              },
            },
          },

          401: {
            description: "Unauthorized",
          },

          403: {
            description: "Forbidden",
          },
        },
      },
    },

    // PROJECTS

    // =========================

    // =========================

    "/projects": {
      get: {
        summary: "Get all projects",

        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 12,
            },
          },
        ],

        responses: {
          200: {
            description: "Paginated list of projects",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    page: { type: "integer", example: 1 },
                    limit: { type: "integer", example: 12 },
                    total: { type: "integer", example: 37 },
                    totalPages: { type: "integer", example: 4 },
                    projects: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", format: "uuid" },
                          name: { type: "string" },
                          description: { type: "string", nullable: true },
                          status: { type: "string" },
                          createdAt: { type: "string", format: "date-time" },
                          tasksCount: { type: "integer", example: 10000 },
                          completionPercent: { type: "integer", example: 63 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      post: {
        summary: "Create a project",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["name"],

                properties: {
                  name: {
                    type: "string",

                    maxLength: 150,

                    example: "Workly SaaS",
                  },

                  description: {
                    type: "string",

                    maxLength: 1000,

                    example: "Project management platform",
                  },

                  status: {
                    type: "string",

                    maxLength: 50,

                    example: "active",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: "Created project",
          },
        },
      },
    },

    "/projects/{id}": {
      get: {
        summary: "Get project by ID",

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
          200: {
            description: "Project",
          },
        },
      },

      patch: {
        summary: "Update project",

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

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  name: {
                    type: "string",

                    maxLength: 150,

                    example: "Workly SaaS",
                  },

                  description: {
                    type: "string",

                    maxLength: 1000,

                    example: "Project management platform",
                  },

                  status: {
                    type: "string",

                    maxLength: 50,

                    example: "active",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: "Updated project",
          },
        },
      },

      delete: {
        summary: "Delete project",

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
          200: {
            description: "Deleted project",
          },
        },
      },
    }, // =========================

    // PROJECT MEMBERS

    // =========================

    "/project-members": {
      get: {
        summary: "Get all project memberships",

        responses: {
          200: {
            description: "List of project memberships",
          },
        },
      },

      post: {
        summary: "Add a user to a project",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["userId", "projectId", "role"],

                properties: {
                  userId: {
                    type: "string",

                    format: "uuid",

                    example: "9e47eb80-a52c-4278-9da2-9fe0ddc90883",
                  },

                  projectId: {
                    type: "string",

                    format: "uuid",

                    example: "448f98a7-0bb2-4025-9eb2-1790384c0c61",
                  },

                  role: {
                    type: "string",

                    maxLength: 50,

                    example: "developer",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: "Created project membership",
          },
        },
      },
    },

    "/projects/{projectId}/members": {
      get: {
        summary: "Get project members",

        parameters: [
          {
            name: "projectId",

            in: "path",

            required: true,

            schema: {
              type: "string",

              format: "uuid",
            },
          },
        ],

        responses: {
          200: {
            description: "List of project members",
          },
        },
      },
    }, // =========================

    // TASKS

    // =========================

    "/tasks": {
      get: {
        summary: "Get all tasks",

        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 20,
            },
          },
        ],

        responses: {
          200: {
            description: "Paginated list of tasks with assignees",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    page: { type: "integer", example: 1 },
                    limit: { type: "integer", example: 20 },
                    total: { type: "integer", example: 137 },
                    totalPages: { type: "integer", example: 7 },
                    tasks: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", format: "uuid" },
                          projectId: { type: "string", format: "uuid" },
                          title: { type: "string" },
                          description: { type: "string", nullable: true },
                          status: { type: "string" },
                          startDate: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                          },
                          endDate: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                          },
                          createdAt: { type: "string", format: "date-time" },
                          assignees: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: { type: "string", format: "uuid" },
                                name: { type: "string" },
                                avatar: { type: "string", nullable: true },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      post: {
        summary: "Create a task",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["projectId", "title"],

                properties: {
                  projectId: {
                    type: "string",

                    format: "uuid",

                    example: "448f98a7-0bb2-4025-9eb2-1790384c0c61",
                  },

                  assigneeIds: {
                    type: "array",

                    items: {
                      type: "string",

                      format: "uuid",
                    },

                    example: ["9e47eb80-a52c-4278-9da2-9fe0ddc90883"],
                  },

                  title: {
                    type: "string",

                    maxLength: 150,

                    example: "Implement authentication",
                  },

                  description: {
                    type: "string",

                    maxLength: 1000,

                    example: "Add login and registration",
                  },

                  status: {
                    type: "string",

                    maxLength: 50,

                    default: "pending",

                    example: "pending",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: "Created task",
          },
        },
      },
    },

    "/tasks/{id}": {
      get: {
        summary: "Get task by ID",

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
          200: {
            description: "Task with assignees",
          },
        },
      },

      patch: {
        summary: "Update task",

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

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  projectId: {
                    type: "string",

                    format: "uuid",
                  },

                  assigneeIds: {
                    type: "array",

                    items: {
                      type: "string",

                      format: "uuid",
                    },
                  },

                  title: {
                    type: "string",

                    maxLength: 150,
                  },

                  description: {
                    type: "string",

                    maxLength: 1000,
                  },

                  status: {
                    type: "string",

                    maxLength: 50,
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: "Updated task",
          },
        },
      },

      delete: {
        summary: "Delete task",

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
          200: {
            description: "Deleted task",
          },
        },
      },
    },

    "/tasks/{id}/assignees": {
      get: {
        summary: "Get task assignees",

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
          200: {
            description: "List of task assignees",
          },
        },
      },

      post: {
        summary: "Add task assignee",

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

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["userId"],

                properties: {
                  userId: {
                    type: "string",

                    format: "uuid",

                    example: "9e47eb80-a52c-4278-9da2-9fe0ddc90883",
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: "Task assignee added",
          },
        },
      },
    },

    "/tasks/{id}/assignees/{userId}": {
      delete: {
        summary: "Remove task assignee",

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

          {
            name: "userId",

            in: "path",

            required: true,

            schema: {
              type: "string",

              format: "uuid",
            },
          },
        ],

        responses: {
          200: {
            description: "Task assignee removed",
          },
        },
      },
    },

    "/projects/{projectId}/tasks": {
      get: {
        summary: "Get project tasks",

        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 20,
            },
          },
        ],

        responses: {
          200: {
            description: "Paginated list of project tasks with assignees",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    page: { type: "integer", example: 1 },
                    limit: { type: "integer", example: 20 },
                    total: { type: "integer", example: 137 },
                    totalPages: { type: "integer", example: 7 },
                    tasks: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", format: "uuid" },
                          projectId: { type: "string", format: "uuid" },
                          title: { type: "string" },
                          description: { type: "string", nullable: true },
                          status: { type: "string" },
                          startDate: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                          },
                          endDate: {
                            type: "string",
                            format: "date-time",
                            nullable: true,
                          },
                          createdAt: { type: "string", format: "date-time" },
                          assignees: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: { type: "string", format: "uuid" },
                                name: { type: "string" },
                                avatar: { type: "string", nullable: true },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
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
      },
    },
  },
};
