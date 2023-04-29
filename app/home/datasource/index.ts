import { RESTDataSource } from "@apollo/datasource-rest";

class HomeDataSource extends RESTDataSource{
  async getData() {
    await this.get("https://reqres.in/api/unknown")
    await this.get("https://reqres.in/api/unknown")
    await this.get("https://reqres.in/api/unknown")
    await this.get("https://reqres.in/api/unknown")
    await this.get("https://reqres.in/api/unknown")
    await this.get("https://reqres.in/api/unknown")
    await this.get("https://reqres.in/api/unknown")
    await this.get("https://reqres.in/api/unknown")
    await this.get("https://reqres.in/api/unknown")
    await this.get("https://reqres.in/api/unknown")
    await this.get("https://reqres.in/api/unknown")
    return "124"
  }
}
export default HomeDataSource