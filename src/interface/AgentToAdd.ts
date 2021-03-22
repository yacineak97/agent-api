import { Agent } from "./Agent";

export type AgentAdd = Omit<Agent, "id" | "role_type" > & {
  roleID: string;  
};