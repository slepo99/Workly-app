//todo: change intrfaces name to model and word => example Login -> LoginModel
export interface Login {
  email: string;
  password: string;
}
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "manager" | "worker";
  position: string | null;
  avatar: string | null;
  createdAt: string;
}
export interface Register {
  email: string;
  password: string;
  name: string;
}
