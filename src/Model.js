import axios from 'axios'
import Builder from './Builder';
import StaticModel from './StaticModel';

export default class Model extends StaticModel {

  constructor(...atributtes) {
    super()
    this.builder = new Builder()
    Object.assign(this, ...atributtes)

    if (this.baseURL === undefined) {
      throw new Error('You must declare baseURL() method (ex: http://site.com/api)')
    }

    if (this.resource === undefined) {
      throw new Error('You must declare resource() method .')
    }
  }

  request (config) {
    // to be implemented on base model
  }

  with (...args) {
    this.builder.with(args)
    return this
  }

  where (field, value) {
    this.builder.where(field, value)
    return this
  }

  whereIn (field, array) {
    this.builder.whereIn(field, array)
    return this
  }

  append (...args) {
    this.builder.append(args)
    return this
  }

  orderBy (...args) {
    this.builder.orderBy(args)
    return this
  }


  find (id) {
    if (id === undefined) {
      throw new Error('The "id" is required on find() method')
    }

    let url = `${this.baseURL()}/${this.resource()}/${id}${this.builder.query()}`

    return this.request({
      url,
      method: 'GET'
    }).then(response => {
      let item = new this.constructor(response.data)
      delete item.builder
      return item
    })
  }

  get () {
    let url = `${this.baseURL()}/${this.resource()}${this.builder.query()}`

    return this.request({
      url,
      method: 'GET'
    }).then(response => {
      let collection = response.data.data || response.data

      collection = collection.map(c => {
        let item = new this.constructor(c)
        delete item.builder
        return item
      })

      if (response.data.data !== undefined) {
        response.data.data = collection
      } else {
        response.data = collection
      }

      return response.data
    })
  }

  hasId () {
    return this.id === undefined || this.id === 0 || this.id === ''
  }

  endpoint () {
    if (this.hasId()) {
      return `${this.baseURL()}/${this.resource()}/${this.id}`
    } else {
      return `${this.baseURL()}/${this.resource()}`
    }
  }

  save () {
    return this.hasId() ? this.update() : this.create()
  }

  create () {
    return axios.post(this.endpoint(), this).then(response => {
      let self = Object.assign(this, response.data)
      return self
    })
  }

  update () {
    return axios.put(this.endpoint(), this).then(response => {
      let self = Object.assign(this, response.data)
      return self
    })
  }
}