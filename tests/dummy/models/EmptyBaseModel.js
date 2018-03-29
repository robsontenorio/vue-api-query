import { Model } from '../../../src'

export default class EmptyBaseModel extends Model {

  static withBaseURL () {
    EmptyBaseModel.prototype['baseURL'] = () => {
      return 'foo'
    }

    return this
  }

  static withRequest () {
    EmptyBaseModel.prototype['request'] = () => {
      return 'foo'
    }

    return this
  }

  static withHttp () {
    Model.$http = 'foo'

    return this
  }

  static reset () {
    delete EmptyBaseModel.prototype['baseURL']
    delete EmptyBaseModel.prototype['request']
    Model.$http = undefined

    return this
  }
}
