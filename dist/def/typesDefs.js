"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentAPIDef = void 0;
const apollo_server_1 = require("apollo-server");
exports.agentAPIDef = apollo_server_1.gql `
  type Query {
    agents(accountID: String!): [Agent!]!
    agent(accountID: String!, agentID: String!): Agent
  }

  type Mutation {
    # Agents mutations
    deleteAgent(accountID: String!, agentID: String!): Boolean!
    deleteAgents(accountID: String!, agantsID: [String!]!): OperationStatus!
    alterAgent(accountID: String!, agent: AgentUpdate!): Boolean!
    addAgent(accountID: String!, agent: AddAgent!): Agent!
  }

  type Agent {
    id: String!
    username: String!
    first_name: String!
    last_name: String!
    email: String!
    avatar: String!
    phone: String!
    password: String!
    brief: String!
    role_type: Role
  }

  type Role {
    id: String!
    name: String!
    permission: [Int!]!
  }

  type OperationStatus {
    completed: Boolean!
    faildItems: [String!]
  }

  input AgentUpdate {
    id: String!
    username: String!
    first_name: String!
    last_name: String!
    email: String!
    avatar: String!
    phone: String!
    password: String!
    brief: String!
    roleID: String!
  }

  input AddAgent {
    username: String!
    first_name: String!
    last_name: String!
    email: String!
    avatar: String!
    phone: String!
    password: String!
    brief: String!
    roleID: String!
  }

`;
