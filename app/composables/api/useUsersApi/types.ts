export interface UserModel {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "manager" | "worker";
  position: string | null;
  avatar: string | null;
  createdAt: string;
}
