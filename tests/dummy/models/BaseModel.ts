import { Model } from '../../../src'

export default class BaseModel extends Model {
  baseURL() {
    return 'http://localhost'
  }

  request(config) {
    // this.testApiRequest = config
    return this.$http.request(config)

    // return Promise.resolve(config)
  }
}
