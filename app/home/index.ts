import gql from 'graphql-tag'
import HomeDataSource from './datasource';
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
 type  Query {
  getLayout(page:String): String
}
`
const resolver = {
  Query: {
    getLayout: async (_:any, __:any, { dataSources }:any) => {
      console.log("🚀 ~ file: index.ts:14 ~ getLayout: ~ dataSources:", dataSources)
      return dataSources.homeAPI.getData();
    },
  }
}

export {typeDefs, resolver,HomeDataSource}