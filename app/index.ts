import { ApolloServer } from "apollo-server-express";
import express from "express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import { schema, dataSourcesAPIs } from './sources';
const port = process.env.PORT || 4000;
(async()=>{
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    dataSources: ():any =>dataSourcesAPIs(undefined),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  }) as any;
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})()

