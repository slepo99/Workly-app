export const openapi = {
  openapi: '3.0.0',

  info: {
    title: 'Workly API',
    version: '1.0.0',
  },

  servers: [
    {
      url: 'http://localhost:3000/api',
    },
  ],

  paths: {
    // =========================
    // USERS
    // =========================

    '/users': {
      get: {
        summary: 'Get all users',

        responses: {
          200: {
            description: 'List of users',
          },
        },
      },

      post: {
        summary: 'Create a user',

        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: {
                    type: 'string',
                    maxLength: 100,
                    example: 'John Doe',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'john@example.com',
                  },
                  position: {
                    type: 'string',
                    maxLength: 100,
                    example: 'Frontend Developer',
                  },
                  avatar: {
                    type: 'string',
                    format: 'uri',
                    maxLength: 500,
                    example: 'https://example.com/avatar.jpg',
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: 'Created user',
          },
        },
      },
    },

    '/users/{id}': {
      get: {
        summary: 'Get user by ID',

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],

        responses: {
          200: {
            description: 'User',
          },
        },
      },

      patch: {
        summary: 'Update user',

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],

        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    maxLength: 100,
                    example: 'John Doe',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'john@example.com',
                  },
                  position: {
                    type: 'string',
                    maxLength: 100,
                    example: 'Senior Frontend Developer',
                  },
                  avatar: {
                    type: 'string',
                    format: 'uri',
                    maxLength: 500,
                    example: 'https://example.com/avatar.jpg',
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: 'Updated user',
          },
        },
      },

      delete: {
        summary: 'Delete user',

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],

        responses: {
          200: {
            description: 'Deleted user',
          },
        },
      },
    },

    // =========================
    // PROJECTS
    // =========================

    '/projects': {
      get: {
        summary: 'Get all projects',

        responses: {
          200: {
            description: 'List of projects',
          },
        },
      },

      post: {
        summary: 'Create a project',

        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: {
                    type: 'string',
                    maxLength: 150,
                    example: 'Workly SaaS',
                  },
                  description: {
                    type: 'string',
                    maxLength: 1000,
                    example: 'Project management platform',
                  },
                  status: {
                    type: 'string',
                    maxLength: 50,
                    example: 'active',
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: 'Created project',
          },
        },
      },
    },

    '/projects/{id}': {
      get: {
        summary: 'Get project by ID',

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],

        responses: {
          200: {
            description: 'Project',
          },
        },
      },

      patch: {
        summary: 'Update project',

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],

        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    maxLength: 150,
                    example: 'Workly SaaS',
                  },
                  description: {
                    type: 'string',
                    maxLength: 1000,
                    example: 'Project management platform',
                  },
                  status: {
                    type: 'string',
                    maxLength: 50,
                    example: 'active',
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: 'Updated project',
          },
        },
      },

      delete: {
        summary: 'Delete project',

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],

        responses: {
          200: {
            description: 'Deleted project',
          },
        },
      },
    },

    // =========================
    // PROJECT MEMBERS
    // =========================

    '/project-members': {
      get: {
        summary: 'Get all project memberships',

        responses: {
          200: {
            description: 'List of project memberships',
          },
        },
      },

      post: {
        summary: 'Add a user to a project',

        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId', 'projectId', 'role'],
                properties: {
                  userId: {
                    type: 'string',
                    format: 'uuid',
                    example: '9e47eb80-a52c-4278-9da2-9fe0ddc90883',
                  },
                  projectId: {
                    type: 'string',
                    format: 'uuid',
                    example: '448f98a7-0bb2-4025-9eb2-1790384c0c61',
                  },
                  role: {
                    type: 'string',
                    maxLength: 50,
                    example: 'developer',
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: 'Created project membership',
          },
        },
      },
    },

    '/projects/{projectId}/members': {
      get: {
        summary: 'Get project members',

        parameters: [
          {
            name: 'projectId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],

        responses: {
          200: {
            description: 'List of project members',
          },
        },
      },
    },

    // =========================
    // TASKS
    // =========================

    '/tasks': {
      get: {
        summary: 'Get all tasks',

        responses: {
          200: {
            description: 'List of tasks',
          },
        },
      },

      post: {
        summary: 'Create a task',

        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['projectId', 'title'],
                properties: {
                  projectId: {
                    type: 'string',
                    format: 'uuid',
                    example: '448f98a7-0bb2-4025-9eb2-1790384c0c61',
                  },
                  assigneeId: {
                    type: 'string',
                    format: 'uuid',
                    example: '9e47eb80-a52c-4278-9da2-9fe0ddc90883',
                  },
                  title: {
                    type: 'string',
                    maxLength: 150,
                    example: 'Implement authentication',
                  },
                  description: {
                    type: 'string',
                    maxLength: 1000,
                    example: 'Add login and registration',
                  },
                  status: {
                    type: 'string',
                    maxLength: 50,
                    default: 'pending',
                    example: 'pending',
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: 'Created task',
          },
        },
      },
    },

    '/tasks/{id}': {
      get: {
        summary: 'Get task by ID',

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],

        responses: {
          200: {
            description: 'Task',
          },
        },
      },

      patch: {
        summary: 'Update task',

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],

        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  projectId: {
                    type: 'string',
                    format: 'uuid',
                  },
                  assigneeId: {
                    type: 'string',
                    format: 'uuid',
                  },
                  title: {
                    type: 'string',
                    maxLength: 150,
                  },
                  description: {
                    type: 'string',
                    maxLength: 1000,
                  },
                  status: {
                    type: 'string',
                    maxLength: 50,
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: 'Updated task',
          },
        },
      },

      delete: {
        summary: 'Delete task',

        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],

        responses: {
          200: {
            description: 'Deleted task',
          },
        },
      },
    },

    '/projects/{projectId}/tasks': {
      get: {
        summary: 'Get project tasks',

        parameters: [
          {
            name: 'projectId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],

        responses: {
          200: {
            description: 'List of project tasks',
          },
        },
      },
    },
  },
}