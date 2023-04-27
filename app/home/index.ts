import gql from 'graphql-tag'
import HomeDataSource from './datasource';
import * as Demo from '../layout/demo.json'
const typeDefs = gql`
 type  Query {
  getLayout(page:String): JSON
}
`
const resolver = {
  Query: {
    getLayout: async (_:any, __:any, { dataSources }:any) => {
      // return dataSources.homeAPI.getData();
      return Demo
    },
  }
}

export {typeDefs, resolver,HomeDataSource}