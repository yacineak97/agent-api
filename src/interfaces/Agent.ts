import { Role } from "./Role";

export interface Agent {
  id: string
  username: string
  firstname: string
  lastname: string
  email: string
  avatar: string
  phone: string
  password?: string
  brief: string
  role?: Role
}