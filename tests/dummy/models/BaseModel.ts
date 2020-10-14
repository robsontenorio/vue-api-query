import { AxiosRequestConfig } from 'axios'
import { Model } from '../../../src'

export default function BaseModel<
  isWrappedCollection extends boolean,
  isWrappedModel extends boolean
>() {
  return class BaseModel extends Model<isWrappedCollection, isWrappedModel>() {
    constructor(...attributes: unknown[]) {
      super(...attributes)
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
}
