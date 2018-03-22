import Builder from './Builder';
import StaticModel from './StaticModel';

export default class Model extends StaticModel {

  constructor(...atributtes) {
    super()
    this.builder = new Builder()
    this.from = null
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

  hasMany (model) {

    let instance = new model
    let url = `${this.baseURL()}/${this.resource()}/${this.id}/${instance.resource()}`

    instance._from(url)

    return instance
  }

  _from (url) {
    this.from = url
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
    return (id === undefined) ? this._first() : this._exact(id)
  }

  _exact (id) {
    if (!Number.isInteger(id)) {
      throw new Error('The "id" must be a integer')
    }

    let url = `${this.baseURL()}/${this.resource()}/${id}${this.builder.query()}`

    return this.request({
      url,
      method: 'GET'
    }).then(response => {
      let item = new this.constructor(response.data)
      delete item.builder
      delete item.from
      return item
    })
  }

  _first () {

    return this.get().then(response => {
      let item

      if (response.data.data) {
        item = response.data.data[0]
      } else {
        item = response.data[0]
      }
      if (item)
        return item
      else
        throw new Error('No item found for specified params')
    })
  }

  get () {
    let base = this.from || `${this.baseURL()}/${this.resource()}`
    let url = `${base}${this.builder.query()}`

    return this.request({
      url,
      method: 'GET'
    }).then(response => {
      let collection = response.data.data || response.data

      collection = collection.map(c => {
        let item = new this.constructor(c)
        delete item.builder
        delete item.from
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
    return this.id !== undefined && this.id !== 0 && this.id !== ''
  }

  endpoint () {
    if (this.hasId()) {
      return `${this.baseURL()}/${this.resource()}/${this.id}`
    } else {
      return `${this.baseURL()}/${this.resource()}`
    }
  }

  save () {
    return this.hasId() ? this._update() : this._create()
  }

  _create () {
    return this.request({
      method: 'POST',
      url: this.endpoint(),
      data: this
    }).then(response => {
      let self = Object.assign(this, response.data)
      return self
    })
  }

  _update () {
    return this.request({
      method: 'PUT',
      url: this.endpoint(),
      data: this
    }).then(response => {
      let self = Object.assign(this, response.data)
      return self
    })
  }
}