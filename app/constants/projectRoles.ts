export const PROJECT_ROLES = {
    MANAGER: "manager",
    DEVELOPER: "developer",
    DESIGNER: "designer",
    TESTER: "tester",
    ANALYST: "analyst",
} as const;

export type ProjectRole =
    (typeof PROJECT_ROLES)[keyof typeof PROJECT_ROLES];