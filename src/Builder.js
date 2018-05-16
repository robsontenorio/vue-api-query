/**
 * Prepare attributes to be parsed
 */

import Parser from './Parser';

export default class Builder {

  constructor(model) {
    this.model = model
    this.includes = []
    this.appends = []
    this.sorts = []
    this.fields = {
      fields: {}
    }
    this.filters = {
      filter: {}
    }
    this.pageSettings = {
	page: {}
    }

    this.parser = new Parser(this)
  }

  // query string parsed 
  query () {
    return this.parser.query()
  }

  /**
   * Query builder
   */

  include (...args) {
    this.includes = args

    return this
  }

  append (...args) {
    this.appends = args

    return this
  }

  select (...fields) {
    if (fields.length === 0) {
      throw new Error('You must specify the fields on select() method.')
    }

    // single entity .select(['age', 'firstname'])
    if (fields[0].constructor === String || fields[0].constructor === Array) {
      this.fields.fields[this.model.resource()] = fields.join(',')
    }

    // related entities .select({ posts: ['title', 'content'], user: ['age', 'firstname']} )
    if (fields[0].constructor === Object) {
      Object.entries(fields[0]).forEach(([key, value]) => {
        this.fields.fields[key] = value.join(',')
      })
    }

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

  page (key, value) {
    if (key === undefined || value === undefined)
      throw new Error('The KEY and VALUE are required on page() method.')

    if (Array.isArray(value) || value instanceof Object)
      throw new Error('The VALUE must be primitive on page() method.')

    if (key != "size" && key != "number" && key != "offset" && key != "limit" && key != "cursor")
      throw new Error('The KEY must be "size", "number", "offset", "limit" or "cursor"')

    this.pageSettings.page[key] = value

    return this
  }
}
