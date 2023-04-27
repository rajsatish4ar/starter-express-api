import { ApolloServer } from "apollo-server-express";
import express from "express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import http from "http";
import { schema, dataSourcesAPIs } from './sources';
const port = process.env.PORT || 4000;
const ApolloDataSource = (options: any) => {
  return {
    requestDidStart: async (requestContext:any) => {
      const dataSources = options.dataSources(requestContext.contextValue)
      const initializers = Object.values(dataSources).map(async (dataSource:any) => {
        if (!dataSource.initialize) {
          dataSource.initialize({
            caches: requestContext.cache,
            context:requestContext.contextValue
            })
        }
       
      })
      await Promise.all(initializers)
      requestContext.contextValue.dataSources = dataSources
    }
  }
}

const context = async (req:any) => {
  return req
}
(async()=>{
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    context,
    dataSources: ():any =>dataSourcesAPIs(undefined),
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // ApolloDataSource({dataSources:dataSourcesAPIs})      
    ],
  }) as any;
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})()

