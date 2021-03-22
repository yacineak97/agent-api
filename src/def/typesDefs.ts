import { gql } from "apollo-server";

export const agentAPIDef = gql`
  type Query {
    agents(accountID: String!): [Agent!]!
    agent(accountID: String!, agentID: String!): Agent
  }

  type Mutation {
    # Agents mutations
    deleteAgent(accountID: String!, agentID: String!): OperationStatus!
    deleteAgents(accountID: String!, agentsID: [String!]!): OperationStatus!
    alterAgent(accountID: String!, agent: AgentUpdate!): OperationStatus!
    addAgent(accountID: String!, agent: AddAgent!): Agent!
  }

  type Agent {
    id: String!
    username: String!
    firstname: String!
    lastname: String!
    email: String!
    avatar: String!
    phone: String!
    password: String!
    brief: String!
    role: Role
  }

  type Role {
    id: String!
    name: String!
    permissions: [Permission!]!
  }

  type Permission {
    id: String!
    name: String!
    description: String!
  }

  type OperationStatus {
    completed: Boolean!
    faildItems: [String!]
  }

  input AgentUpdate {
    id: String!
    username: String!
    firstname: String!
    lastname: String!
    email: String!
    avatar: String!
    phone: String!
    password: String!
    brief: String!
    roleID: String!
  }

  input AddAgent {
    username: String!
    firstname: String!
    lastname: String!
    email: String!
    avatar: String!
    phone: String!
    password: String!
    brief: String!
    roleID: String!
  }

`;