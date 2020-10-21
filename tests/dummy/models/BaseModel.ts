import { AxiosRequestConfig } from 'axios'

import StaticModel from '../../../src/StaticModel'

export default function BaseModel<
  isWrappedCollection extends boolean = false,
  isWrappedModel extends boolean = false
>() {
  return class BaseModel extends StaticModel<
    isWrappedCollection,
    isWrappedModel
  >() {
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
