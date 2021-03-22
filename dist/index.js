"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const typesDefs_1 = require("./def/typesDefs");
const agent_1 = require("./resolvers/agent");
const server = new apollo_server_1.ApolloServer({
    resolvers: agent_1.resolvers,
    typeDefs: typesDefs_1.agentAPIDef,
});
server
    .listen({
    port: 8001,
})
    .then((server) => console.log(`Server is running on ${server.url}`))
    .catch((error) => console.error(`Faild to run the server, error: ${error}`));
