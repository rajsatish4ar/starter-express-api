import gql from 'graphql-tag'
import HomeDataSource from './datasource';
import * as Demo from '../layout/demo.json'
const typeDefs = gql`
 type  Query {
  getLayout(page:String): JSON
  getDynamicAttributes(params:JSON!): JSON
  getDynamicComponents(params:JSON!): JSON
}
`
const resolver = {
  Query: {
    getLayout: async (_:any, __:any, { dataSources }:any) => {
      return Demo
    },
    getDynamicAttributes: async (_: any, { params}:any, { dataSources }:any) => {
      return {
        ...params ?? {},
        style: {
          ...params?.style ?? {},
          color:"green"          
        },
      }
    },
    getDynamicComponents: async (_: any, __: any, { dataSources }: any) => {
      await dataSources.homeAPI.getData()
      return [
        {
          "type":"Text",
          "attributes":{
            "style":{
            },
            "children":"item 1"
          }
        },
        {
          "type":"Text",
          "attributes":{
            "style":{
            },
            "children":"item 2"
          }
        } 
      ]
    },
  }
}

export {typeDefs, resolver,HomeDataSource}