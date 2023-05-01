import * as StaticMappingJSON from "../layout/staticComponentsMap.json";
import * as DynamicMappingJSON from "../layout/dynamicComponentsMap.json";
import get from "lodash/get";
import set from "lodash/set";
const getStaticMappingJSON = (): any => {
  return StaticMappingJSON;
};
const getDynamicMappingJSON = (): any => {
  return DynamicMappingJSON;
};
export const layoutParser = (page_json: any, response: any) => {
  const layoutJSON = JSON.parse(JSON.stringify(page_json));
  if (!layoutJSON || !response) {
    return;
  }
  const layout = { ...layoutJSON };
  layout.components = [];
    const mappingJSON = getStaticMappingJSON();

  if (layoutJSON.isNestedComponents || (layoutJSON.pageName && mappingJSON[layoutJSON.pageName])) {
    const pageJSONMap =
      mappingJSON[layoutJSON.pageName || layoutJSON.componentId];
    const components = layoutJSON.components ?? layoutJSON.subComponents ?? [];
    layoutJSON.components = components;
    components.forEach((item: any, index: number) => {
      if (item.isNestedComponents) {
        const parsedItem: any = layoutParser(item, response);
        if (parsedItem) {
          delete parsedItem.components;
          layoutJSON.components[index] = parsedItem;
          return (layout.components[index] = parsedItem)
        }
      }

      if (item.dataFetchType === "DYNAMIC") {
        const parsedComponents = dynamicComponentParser(item, {
          data: get(response, pageJSONMap?.[item?.componentId?.[0]], undefined),
        });
        if (parsedComponents) {
          item.subComponents = parsedComponents;
        }
      }
      console.log("🚀 ~ file: layout.ts:46 ~:",  item?.componentId,pageJSONMap?.[item?.componentId]?.[0])

      const parsedComponents = staticComponentParser(item, {
        data: get(response, pageJSONMap?.[item?.componentId]?.[0], undefined),
      });
      if (parsedComponents) {
        item.subComponents = parsedComponents;
      }
      layout.components.push(item);
    });
    return layout;
  }

  return;
};

export const staticComponentParser = (item: any, response: any): any[] => {
  console.log("🚀 ~ file: layout.ts:58 ~ staticComponentParser ~ response:", response)
  const responseDataArray = Array.isArray(response?.data)
    ? response?.data
    : [response?.data];
  const componentObject =
    item.attributes?.subComponentDetails && !item?.attributesOnly
      ? item.attributes.subComponentDetails
      : item;
  const componentMapJSON = getStaticMappingJSON()[componentObject.componentId];
  const subComponents: any[] = [];
  responseDataArray?.forEach((data: any) => {
    console.log("🚀 ~ file: layout.ts:68 ~ responseDataArray?.forEach ~ data:", data)
    const cloneItem = { ...componentObject };
    depthParser(componentMapJSON, data, cloneItem);
    if (item?.attributesOnly) {
      item = cloneItem;
    } else {
      subComponents.push(JSON.parse(JSON.stringify(cloneItem)));
    }
  });
  return subComponents;
};
export const dynamicComponentParser = (item: any, response: any): any => {
  const cloneItem = { ...item };
  const componentMapJSON = getDynamicMappingJSON()[item?.componentId];
  depthParser(componentMapJSON, response, cloneItem);
  return cloneItem;
};

export const genericComponentParser = (item: any, response: any) => {
  const component = item?.subComponentDetails ?? {};
  const componentMapJSON = getStaticMappingJSON()[component.componentId];
  const subComponents: any[] = [];
  response?.forEach((data: any) => {
    const cloneItem = {
      ...component,
    };
    depthParser(componentMapJSON, data, cloneItem);
    subComponents.push(JSON.parse(JSON.stringify(cloneItem)));
  });
  return subComponents;
};

const depthParser = (
  itemJSON: any,
  responseData: any,
  finalItem: any,
  level = ""
) => {
  for (const property in itemJSON) {
    if (typeof itemJSON[property] === "object") {
      const newLavel = level ? `${level}.${property}` : `${property}`;
      depthParser(itemJSON[property], responseData, finalItem, newLavel);
    } else {
      const value = get(responseData, itemJSON[property], undefined);
      console.log("🚀 ~ file: layout.ts:111 ~ itemJSON[property]:", itemJSON[property])
      if (value !== undefined) {
        set(finalItem, level, value);
      }
    }
  }
};
