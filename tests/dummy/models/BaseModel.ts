import { AxiosRequestConfig } from 'axios'
import { Model } from '../../../src'

type ModelInstance = InstanceType<ReturnType<typeof BaseModel>>
export type ModelData<T> = Required<Omit<T, keyof ModelInstance>>

export default function BaseModel<
  isWrappedCollection extends boolean = false,
  isWrappedModel extends boolean = false
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
