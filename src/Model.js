import Builder from './Builder';
import StaticModel from './StaticModel';

export default class Model extends StaticModel {

  constructor(...atributtes) {
    super()

    // Keep clean object if is a manual instance
    if (atributtes.length === 0) {
      this._builder = new Builder()
      this._fromResource = null
      this._customResource = null
    } else {
      Object.assign(this, ...atributtes)
    }

    if (this.baseURL === undefined) {
      throw new Error('You must declare baseURL() method.')
    }

    if (this.request === undefined) {
      throw new Error('You must declare request() method.')
    }

    if (this.$http === undefined) {
      throw new Error('You must set $http property')
    }
  }

  get $http () {
    return Model.$http
  }

  resource () {
    return `${this.constructor.name.toLowerCase()}s`
  }

  custom (resource) {
    this._customResource = resource

    return this
  }

  _from (url) {
    this._fromResource = url
  }

  hasMany (model) {

    let instance = new model
    let url = `${this.baseURL()}/${this.resource()}/${this.id}/${instance.resource()}`

    instance._from(url)

    return instance
  }

  include (...args) {
    this._builder.include(args)
    return this
  }

  where (field, value) {
    this._builder.where(field, value)
    return this
  }

  whereIn (field, array) {
    this._builder.whereIn(field, array)
    return this
  }

  append (...args) {
    this._builder.append(args)
    return this
  }

  orderBy (...args) {
    this._builder.orderBy(args)
    return this
  }

  first () {
    return this.get().then(response => {
      let item

      if (response.data) {
        item = response.data[0]
      } else {
        item = response[0]
      }

      if (item)
        return item
      else
        throw new Error('No item found for specified params')
    })
  }

  find (id) {
    if (!Number.isInteger(id)) {
      throw new Error('The "id" must be a integer on find() method.')
    }

    let url = `${this.baseURL()}/${this.resource()}/${id}${this._builder.query()}`

    return this.request({
      url,
      method: 'GET'
    }).then(response => {
      let item = new this.constructor(response.data)
      delete item._builder
      delete item.from
      delete item._customResource
      delete item.$http

      return item
    })
  }

  get () {
    let base = this._fromResource || `${this.baseURL()}/${this.resource()}`
    base = this._customResource || base
    let url = `${base}${this._builder.query()}`

    return this.request({
      url,
      method: 'GET'
    }).then(response => {
      let collection = response.data.data || response.data
      collection = Array.isArray(collection) ? collection : [collection]

      collection = collection.map(c => {
        let item = new this.constructor(c)
        delete item._builder
        delete item.from
        delete item._customResource
        delete item.$http

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