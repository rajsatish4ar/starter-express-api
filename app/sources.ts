import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs, HomeDataSource, resolver } from './home'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { gql } from 'apollo-server-core';

const commonTypes = gql`
  scalar JSON
  scalar Date
`
export const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs([commonTypes,typeDefs]) ,
  resolvers: mergeResolvers([resolver]) 
})

export const dataSourcesAPIs = (context:any) => ({
  homeAPI:new HomeDataSource(context)
})
