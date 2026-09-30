export interface CreateProjectInput {
    name: string;
    description?: string;
    status?: string;
}
export interface UpdateProjectInput extends Partial<CreateProjectInput> {}
export interface ProjectModel {
    id: string,
    name: string,
    description: string,
    status: string,
    createdAt: string
}