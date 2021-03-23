import { Agent } from "./Agent";

export type AgentAdd = Omit<Agent, "id" | "role" > & {
  roleID: string;  
};