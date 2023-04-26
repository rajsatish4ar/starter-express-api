import { ApolloServer } from "apollo-server-express";
// import Schema from "./Schema";
// import Resolvers from "./Resolvers";
import express from "express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import { schema, dataSourcesAPIs } from './sources';
import { startStandaloneServer } from '@apollo/server/standalone';
(async()=>{
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    // resolvers,
    dataSources: ():any =>dataSourcesAPIs(undefined),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  }) as any;
  // const { url } = await startStandaloneServer(server, {
  //   context: async (context) => {
  //     return {
  //       dataSources: dataSourcesAPIs(context),
  //     };
  //   },
  // });
  // console.log("🚀 ~ file: index.ts:25 ~ url:", url)
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})()

