import { AxiosRequestConfig } from 'axios'
import { Model } from '../../../src'

export default class BaseModel<
  isWrappedCollection extends boolean,
  isWrappedModel extends boolean
> extends Model<isWrappedCollection, isWrappedModel> {
  constructor() {
    super()
  }

  baseURL() {
    return 'http://localhost'
  }

  request(config: AxiosRequestConfig) {
    // this.testApiRequest = config
    return this.$http.request(config)

    // return Promise.resolve(config)
  }
}
