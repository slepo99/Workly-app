export interface CreateProjectInput {
    name: string;
    description?: string;
    status?: string;
}
export interface UpdateProjectInput extends Partial<CreateProjectInput> {}
