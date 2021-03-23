import 'module-alias/register';
import { ApolloServer } from "apollo-server";
import { agentAPIDef } from "@graphDefinition/index";
import { resolvers } from "@resolvers/index";

const server = new ApolloServer({
  resolvers: resolvers,
  typeDefs: agentAPIDef,
});

server
  .listen({
    port: 8001,
  })
  .then((server) => console.log(`Server is running on ${server.url}`))
  .catch((error) => console.error(`Faild to run the server, error: ${error}`));