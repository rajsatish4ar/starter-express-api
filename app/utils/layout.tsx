
import * as StaticMappingJSON from '../layout/staticComponentsMap.json'
import * as DynamicMappingJSON from '../layout/dynamicComponentsMap.json'
import get from 'lodash/get'
import set from 'lodash/set'
const getStaticMappingJSON = (): any => {
  return StaticMappingJSON
}
const getDynamicMappingJSON = (): any => {
  return DynamicMappingJSON
}
export const layoutParser = (layoutJSON: any, response: any) => {
  console.log("🚀 ~ file: layout.tsx:13 ~ layoutParser ~ layoutJSON:", layoutJSON)
  if (!layoutJSON || !layoutJSON.pageName || !response) {
    return
  }
  const mappingJSON = getStaticMappingJSON()
  const pageJSONMap = mappingJSON[layoutJSON.pageName || layoutJSON.componentId]
  if (!pageJSONMap) {
    return
  }
  const layout = { ...layoutJSON }
  layout.components = []
  const components = layoutJSON.components ?? layoutJSON.subComponents ?? []
  console.log("🚀 ~ file: layout.tsx:24 ~ layoutParser ~ components:", components)
  layoutJSON.components = components
  components.forEach((item:any, index:number) => {
    if (item.attributes.isNestedComponents) { 
      const parsedItem :any= layoutParser(item, response)
      delete parsedItem.components
      layoutJSON.components[index] = parsedItem
      layout.components[index] = parsedItem
      return
    }
   
    if (item.dataFetchType === "DYNAMIC") {
      const parsedComponents = dynamicComponentParser(item, { data: get(response, pageJSONMap?.[item?.componentId?.[0]], undefined) })
      if (parsedComponents) {
          item.subComponents = parsedComponents
      }
    }
    console.log("🚀 ~ file: layout.tsx:43 ~ components.forEach ~ pageJSONMap?.[item?.componentId?.[0]]:", pageJSONMap?.[item?.componentId?.[0]])
      const parsedComponents = staticComponentParser(item, { data: get(response, pageJSONMap?.[item?.componentId?.[0]], undefined) })
      if (parsedComponents) {
          item.subComponents = parsedComponents
      }
    layout.components.push(item)
  })
  return layout
}

export const staticComponentParser = (item:any, response:any):any[] => {
    const responseDataArray =  Array.isArray(response?.data) ? response?.data : [response?.data]
  const componentMapJSON = getStaticMappingJSON()[item.componentId]
  console.log("🚀 ~ file: layout.tsx:55 ~ staticComponentParser ~ componentMapJSON:", componentMapJSON)
  const subComponents:any[] = []
  responseDataArray?.forEach((data:any) => {
    const cloneItem = { ...item }
    depthParser(componentMapJSON, data, cloneItem)
    if (!item?.attributes?.attributesOnly) {
      subComponents.push(JSON.parse(JSON.stringify(cloneItem)))
    } else {
      item = cloneItem
    }
  })
  return subComponents
}
export const dynamicComponentParser = (item:any, response:any):any => {
  const cloneItem = { ...item }
  const componentMapJSON = getDynamicMappingJSON()[item?.componentId]
  depthParser(componentMapJSON, response, cloneItem)
  return cloneItem
}

export const genericComponentParser = (item:any, response:any) => {
  const component = item?.subComponentDetails ?? {}
  const componentMapJSON = getStaticMappingJSON()[component.componentId]
  const subComponents :any[]= []
  response?.forEach((data: any) => {
    const cloneItem = {
      ...component
    }
    depthParser(componentMapJSON, data, cloneItem)
    subComponents.push(JSON.parse(JSON.stringify(cloneItem)))
  })
  return subComponents
}

const depthParser = (itemJSON:any,responseData:any,finalItem:any, level='') => {
  for (const property in itemJSON) {
    if (typeof itemJSON[property] === 'object') {
      const newLavel = level ? `${level}.${property}` : `${property}`
      depthParser(itemJSON[property],responseData,finalItem,newLavel)
    } else {
      const value = get(responseData, itemJSON[property], undefined)
      // const lastLevelKey = level.split(".")[level.split(".").length - 1] ?? ''
      if (value!==undefined) {
          set(itemJSON, level, value)
      }
    }
  }
}