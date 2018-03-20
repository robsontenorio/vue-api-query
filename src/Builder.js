import axios from 'axios'
import Parser from './Parser';

export default class Builder {

  constructor(model) {
    this.model = new (model)
    this.includes = []
    this.appends = []
    this.sorts = []
    this.filters = {
      filter: {}
    }

    this.parser = new Parser(this)

    if (this.model.baseURL === undefined) {
      throw new Error('You must declare baseURL() method (ex: http://site.com/api)')
    }

    if (this.model.resource === undefined) {
      throw new Error('You must declare resource() method .')
    }
  }

  query () {
    return this.parser.query()
  }

  find (id) {
    if (id === undefined) {
      throw new Error('The "id" is required on find() method')
    }

    let url = `${this.model.baseURL()}/${this.model.resource()}/${id}${this.query()}`

    return this.model.request({
      url,
      method: 'GET'
    }).then(response => {
      this.model = Object.assign(this.model, response.data)
      return this.model
    })
  }

  get () {
    let url = `${this.model.baseURL()}/${this.model.resource()}${this.query()}`

    return this.model.request({
      url,
      method: 'GET'
    }).then(response => {
      return response
    })
  }

  with (...args) {
    this.includes = args

    return this
  }

  where (key, value) {
    if (key === undefined || value === undefined)
      throw new Error('The "key" and "value" are required on where() method')

    if (Array.isArray(value) || value instanceof Object)
      throw new Error('The "value" must be primitive on where() method')

    this.filters.filter[key] = value

    return this
  }

  whereIn (key, array) {
    if (!Array.isArray(array))
      throw new Error('The second argument on whereIn() method must be an array')

    this.filters.filter[key] = array.join(',')

    return this
  }

  append (...args) {
    this.appends = args

    return this
  }

  orderBy (...args) {
    this.sorts = args

    return this
  }
}