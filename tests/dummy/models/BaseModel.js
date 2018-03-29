import { Model } from '../../../src'

Model.$http = 'foo'

export default class BaseModel extends Model {
  baseURL () {
    return 'http://localhost'
  }

  request (config) {
    return this.$http.request(config)
  }
}
