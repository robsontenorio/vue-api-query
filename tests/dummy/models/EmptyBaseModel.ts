import { Model } from '../../../src'

// @ts-ignore
export default class EmptyBaseModel extends Model<false, false> {
  static withBaseURL() {
    EmptyBaseModel.prototype['baseURL'] = () => {
      return 'foo'
    }

    return this
  }

  static withRequest() {
    // @ts-ignore
    EmptyBaseModel.prototype['request'] = () => {
      return 'foo'
    }

    return this
  }

  static withHttp() {
    // @ts-ignore
    Model.$http = 'foo'

    return this
  }

  static reset() {
    // @ts-ignore
    delete EmptyBaseModel.prototype['baseURL']
    // @ts-ignore
    delete EmptyBaseModel.prototype['request']
    // @ts-ignore
    Model.$http = undefined

    return this
  }
}
