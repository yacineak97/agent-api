import { Role } from "./Role";

export interface Agent {
  id: String
  username: String
  first_name: String
  last_name: String
  email: String
  avatar: String
  phone: String
  password: String
  brief: String
  role_type?: Role
}
