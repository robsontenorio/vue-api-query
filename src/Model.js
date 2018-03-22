import axios from 'axios'
import Builder from './Builder';
import StaticModel from './StaticModel';

export default class Model extends StaticModel {

  constructor() {
    super()
    this.builder = new Builder()

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
    console.log('find')
    console.log(this)
  }

  get () {
    let url = `${this.baseURL()}/${this.resource()}${this.builder.query()}`

    return this.request({
      url,
      method: 'GET'
    }).then(response => {
      // TODO array de model      
      return response
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