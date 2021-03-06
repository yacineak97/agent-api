"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const apollo_server_1 = require("apollo-server");
const index_1 = require("@graphDefinition/index");
const index_2 = require("@resolvers/index");
const server = new apollo_server_1.ApolloServer({
    resolvers: index_2.resolvers,
    typeDefs: index_1.agentAPIDef,
});
server
    .listen({
    port: 8001,
})
    .then((server) => console.log(`Server is running on ${server.url}`))
    .catch((error) => console.error(`Faild to run the server, error: ${error}`));
//# sourceMappingURL=index.js.map