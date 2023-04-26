import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs, HomeDataSource, resolver } from './home'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

// const schemas = mergeTypeDefs([typeDefs]) as any;
// const resolvers = mergeResolvers([resolver]) as any;

export const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs([typeDefs]) ,
  resolvers: mergeResolvers([resolver]) 
})

export const dataSourcesAPIs = (context:any) => ({
  homeAPI:new HomeDataSource(context)
})
// export default buildSubgraphSchema({
//   typeDefs,
//   resolvers,
// })