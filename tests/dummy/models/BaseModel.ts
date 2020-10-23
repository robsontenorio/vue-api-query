/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { AxiosInstance, AxiosRequestConfig } from 'axios'

import { Model } from '../../../src'

export default class BaseModel<
  isWrappedCollection extends boolean = false,
  isWrappedModel extends boolean = false
> extends Model<isWrappedCollection, isWrappedModel> {
  constructor(...attributes: unknown[]) {
    super(...attributes)
  }

  baseURL() {
    return 'http://localhost'
  }

  request(config: AxiosRequestConfig) {
    // this.testApiRequest = config
    return (this.$http as AxiosInstance).request(config)

    // return Promise.resolve(config)
  }
}
