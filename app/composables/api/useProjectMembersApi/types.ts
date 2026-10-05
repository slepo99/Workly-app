export interface UserModel {
  id: string
  name: string
  email: string
  role: string
  position: string | null
  avatar: string | null
  createdAt: string
}

export interface ProjectMemberModel {
  role: string
  user: UserModel
  projectId: string
}