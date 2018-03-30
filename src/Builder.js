import Parser from './Parser';

export default class Builder {

  constructor() {
    this.includes = []
    this.appends = []
    this.sorts = []
    this.pageValue = null
    this.limitValue = null
    this.filters = {
      filter: {}
    }

    this.parser = new Parser(this)
  }

  query () {
    return this.parser.query()
  }

  include (...args) {
    this.includes = args

    return this
  }

  append (...args) {
    this.appends = args

    return this
  }

  page (value) {
    if (!Number.isInteger(value)) {
      throw new Error('The VALUE must be an integer on page() method.')
    }

    this.pageValue = value

    return this
  }

  limit (value) {
    if (!Number.isInteger(value)) {
      throw new Error('The VALUE must be an integer on limit() method.')
    }

    this.limitValue = value

    return this
  }

  where (key, value) {
    if (key === undefined || value === undefined)
      throw new Error('The KEY and VALUE are required on where() method.')

    if (Array.isArray(value) || value instanceof Object)
      throw new Error('The VALUE must be primitive on where() method.')

    this.filters.filter[key] = value

    return this
  }

  whereIn (key, array) {
    if (!Array.isArray(array))
      throw new Error('The second argument on whereIn() method must be an array.')

    this.filters.filter[key] = array.join(',')

    return this
  }

  orderBy (...args) {
    this.sorts = args

    return this
  }
}