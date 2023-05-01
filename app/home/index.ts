import gql from 'graphql-tag'
import HomeDataSource from './datasource';
import  Demo from '../layout/itemMaparray.json'
import { layoutParser } from '../utils/layout';
const typeDefs = gql`
 type  Query {
  getLayout(page:String): JSON
  getDynamicAttributes(params:JSON!): JSON
  getDynamicComponents(params:JSON!): JSON
}
`
const arrayData = [
  { text: "hello parser 1", fontSize: 38 },
  {text:"hello parser 2",fontSize:28},
  {text:"hello parser 3",fontSize:28}
]
const data =  { text: "hello parser single", fontSize: 38 }
const resolver = {
  Query: {
    getLayout: async (_:any, __:any, { dataSources }:any) => {
      const layout = layoutParser(Demo, {data})
      return layout
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