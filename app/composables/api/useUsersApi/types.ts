import type { ROLE } from "~/constants/roles";
export interface UserModel {
  id: string;
  name: string;
  email: string;
  role: ROLE;
  position: string | null;
  avatar: string | null;
  createdAt: string;
}
