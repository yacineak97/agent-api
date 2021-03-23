import { Agent } from "./Agent";

export type AgentUpdate = Omit<Agent, "role" > & {
  roleID: string;  
};