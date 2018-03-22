/**
 *  Handle static calls for all methods.
 * 
 *  Instead `let users = new User().with('country').get()`
 *  You cand do `let users = User.with('conutry').get()` 
 *  
 * 
 * 
 */

export default class StaticModel {

  static with (...args) {
    let self = typeof this === 'object' ? this : new this

    self.with(...args)

    return self
  }

  static where (field, value) {
    let self = typeof this === 'object' ? this : new this

    self.where(field, value)

    return self
  }

  static whereIn (field, array) {
    let self = typeof this === 'object' ? this : new this

    self.whereIn(field, array)

    return self
  }

  static append (...args) {
    let self = typeof this === 'object' ? this : new this

    self.append(args)

    return self
  }

  static orderBy (...args) {
    let self = typeof this === 'object' ? this : new this

    self.orderBy(args)

    return self
  }

  static find (id) {
    let self = typeof this === 'object' ? this : new this

    return self.find(id)
  }

  static get () {
    let self = typeof this === 'object' ? this : new this

    return self.get()
  }
}