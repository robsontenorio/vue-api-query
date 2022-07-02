/**
 * Prepare attributes to be parsed
 */

import { dset as setProp } from 'dset'

import Parser from './Parser'

export default class Builder {
  constructor(model) {
    this.model = model
    this.includes = []
    this.appends = []
    this.sorts = []
    this.pageValue = null
    this.limitValue = null
    this.payload = null

    this.fields = {}
    this.filters = {}

    this.parser = new Parser(this)
  }

  // query string parsed
  query() {
    return this.parser.query()
  }

  /**
   * Helpers
   */

  /**
   * Nested filter via array-type keys.
   *
   * @example
   * const [_key, _value] = this._nestedFilter(keys, value)
   * this.filters[_key] = _value
   *
   * @param {string[]} keys - Array-type keys, like `['a', 'b', 'c']`.
   * @param {*} value - The value to be set.
   *
   * @return {[]} - An array containing the first key, which is the index to be used in `filters`
   * object, and a value, which is the nested filter.
   *
   */
  _nestedFilter(keys, value) {
    // Get first key from `keys` array, then remove it from array
    const _key = keys.shift()
    // Initialize an empty object
    const _value = {}

    // Convert the keys into a deeply nested object, which the value of the deepest key is
    // the `value` property.
    // Then assign the object to `_value` property.
    setProp(_value, keys, value)

    return [_key, _value]
  }

  /**
   * Query builder
   */

  include(...relationships) {
    relationships = Array.isArray(relationships[0])
      ? relationships[0]
      : relationships
    this.includes = relationships

    return this
  }

  append(...attributes) {
    attributes = Array.isArray(attributes[0]) ? attributes[0] : attributes
    this.appends = attributes

    return this
  }

  select(...fields) {
    if (fields.length === 0) {
      throw new Error('You must specify the fields on select() method.')
    }

    // single entity .select(['age', 'firstname'])
    if (typeof fields[0] === 'string' || Array.isArray(fields[0])) {
      this.fields[this.model.resource()] = fields
    }

    // related entities .select({ posts: ['title', 'content'], user: ['age', 'firstname']} )
    if (typeof fields[0] === 'object') {
      Object.entries(fields[0]).forEach(([key, value]) => {
        this.fields[key] = value
      })
    }

    return this
  }

  where(key, value) {
    if (key === undefined || value === undefined) {
      throw new Error('The KEY and VALUE are required on where() method.')
    }

    if (Array.isArray(value) || value instanceof Object) {
      throw new Error('The VALUE must be primitive on where() method.')
    }

    if (Array.isArray(key)) {
      const [_key, _value] = this._nestedFilter(key, value)

      this.filters[_key] = { ...this.filters[_key], ..._value }
    } else {
      this.filters[key] = value
    }

    return this
  }

  whereIn(key, array) {
    if (!Array.isArray(array)) {
      throw new Error(
        'The second argument on whereIn() method must be an array.'
      )
    }

    if (Array.isArray(key)) {
      const [_key, _value] = this._nestedFilter(key, array)

      this.filters[_key] = { ...this.filters[_key], ..._value }
    } else {
      this.filters[key] = array
    }

    return this
  }

  orderBy(...fields) {
    fields = Array.isArray(fields[0]) ? fields[0] : fields
    this.sorts = fields

    return this
  }

  page(value) {
    if (!Number.isInteger(value)) {
      throw new Error('The VALUE must be an integer on page() method.')
    }

    this.pageValue = value

    return this
  }

  limit(value) {
    if (!Number.isInteger(value)) {
      throw new Error('The VALUE must be an integer on limit() method.')
    }

    this.limitValue = value

    return this
  }

  params(payload) {
    if (payload === undefined || typeof payload !== 'object') {
      throw new Error('You must pass a payload/object as param.')
    }

    this.payload = payload

    return this
  }
}
