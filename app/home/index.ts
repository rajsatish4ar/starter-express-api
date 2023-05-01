import gql from 'graphql-tag'
import HomeDataSource from './datasource';
import * as Demo from '../layout/demo.json'
import { layoutParser } from '../utils/layout';
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
      console.log("🚀 ~ file: index.ts:15 ~ getLayout: ~ __:", __)
      // return Demo
      return layoutParser(Demo, {data:{text:"hello parser"}})
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