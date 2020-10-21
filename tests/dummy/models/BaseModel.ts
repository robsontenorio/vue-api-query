import { AxiosRequestConfig } from 'axios'

import BaseModel from '../../../src/BaseModel'

export default function BaseModel<
  isWrappedCollection extends boolean = false,
  isWrappedModel extends boolean = false
>() {
  return class BaseModel extends BaseModel<
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
