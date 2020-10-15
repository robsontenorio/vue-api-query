import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios'

export default abstract class Config {
  public static $http: AxiosInstance

  protected constructor() {
    if (this.baseURL === undefined) {
      throw new Error('You must declare baseURL() method.')
    }

    if (this.request === undefined) {
      throw new Error('You must declare request() method.')
    }

    if (this.$http === undefined) {
      throw new Error('You must set $http property')
    }
  }

  abstract baseURL(): string

  abstract request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  get $http(): AxiosInstance {
    return Config.$http
  }
}
