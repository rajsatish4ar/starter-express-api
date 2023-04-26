import { RESTDataSource } from "@apollo/datasource-rest";

class HomeDataSource extends RESTDataSource{
  async getData() {
    return "124"
  }
}
export default HomeDataSource