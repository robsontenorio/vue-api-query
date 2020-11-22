import { Collection } from '@eloqjs/collection'

/**
 *  Provide static calls for all methods.
 *
 *  Instead this: let users = new User().with('country').get()
 *  We can do this: let users = User.with('conutry').get()
 *
 */

export default class StaticModel {
  static instance() {
    return new this
  }

  static include(...args) {
    let self = this.instance()
    self.include(...args)

    return self
  }

  static with(...args) {
    let self = this.instance()
    self.with(...args)

    return self
  }

  static append(...args) {
    let self = this.instance()
    self.append(...args)

    return self
  }

  static select(...fields) {
    let self = this.instance()
    self.select(...fields)

    return self
  }

  static where(field, value) {
    let self = this.instance()
    self.where(field, value)

    return self
  }

  static whereIn(field, array) {
    let self = this.instance()
    self.whereIn(field, array)

    return self
  }

  static orderBy(...args) {
    let self = this.instance()
    self.orderBy(...args)

    return self
  }

  static page(value) {
    let self = this.instance()
    self.page(value)

    return self
  }

  static limit(value) {
    let self = this.instance()
    self.limit(value)

    return self
  }

  static custom(...args) {
    let self = this.instance()
    self.custom(...args)

    return self
  }

  static params(payload) {
    let self = this.instance()
    self.params(payload)

    return self
  }

  static first() {
    let self = this.instance()

    return self.first()
  }

  static $first() {
    let self = this.instance()

    return self.$first()
  }

  static find(id) {
    let self = this.instance()

    return self.find(id)
  }

  static $find(id) {
    let self = this.instance()

    return self.$find(id)
  }

  /**
   * @typedef {Object} WrappedResponse
   * @property {Collection} data
   */

  /**
   * @return {Promise<Collection|WrappedResponse>}
   */
  static get() {
    let self = this.instance()

    return self.get()
  }

  static all() {
    let self = this.instance()

    return self.all()
  }

  /**
   * @return {Promise<Collection>}
   */
  static $get() {
    let self = this.instance()

    return self.$get()
  }

  static $all() {
    let self = this.instance()

    return self.$all()
  }
}
