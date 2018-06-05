import Builder from './Builder';
import StaticModel from './StaticModel';

export default class Model extends StaticModel {

  constructor(...atributtes) {
    super()

    // Keep clean object if it is a manual instance
    if (atributtes.length === 0) {
      this._builder = new Builder(this)
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

  /**
   *  Setup
   */

  get $http () {
    return Model.$http
  }

  resource () {
    return `${this.constructor.name.toLowerCase()}s`
  }

  primaryKey () {
    return 'id'
  }

  getPrimaryKey () {
    return this[this.primaryKey()]
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
    let url = `${this.baseURL()}/${this.resource()}/${this.getPrimaryKey()}/${instance.resource()}`

    instance._from(url)

    return instance
  }

  /**
   * Helpers
   */

  hasId () {
    const pk = this.getPrimaryKey()
    return pk !== undefined && pk !== 0 && pk !== ''
  }

  endpoint () {
    if (this._fromResource) {
      if (this.hasId()) {
        return `${this._fromResource}/${this.getPrimaryKey()}`
      } else {
        return this._fromResource
      }
    }

    if (this.hasId()) {
      return `${this.baseURL()}/${this.resource()}/${this.getPrimaryKey()}`
    } else {
      return `${this.baseURL()}/${this.resource()}`
    }
  }

  /**
   *  Query
   */

  include (...args) {
    this._builder.include(...args)

    return this
  }

  append (...args) {
    this._builder.append(...args)

    return this
  }

  select (...fields) {
    this._builder.select(...fields)

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

  orderBy (...args) {
    this._builder.orderBy(...args)

    return this
  }

  page (value) {
    this._builder.page(value)

    return this
  }

  limit (value) {
    this._builder.limit(value)

    return this
  }

  params (payload) {
    this._builder.params(payload)

    return this
  }

  /** 
   * Result
   */

  first () {
    return this.get().then(response => {
      let item

      if (response.data) {
        item = response.data[0]
      } else {
        item = response[0]
      }

      return item || {}
    })
  }

  find (identifier) {
    if (identifier === undefined) {
      throw new Error('You must specify the param on find() method.')
    }

    let url = `${this.baseURL()}/${this.resource()}/${identifier}${this._builder.query()}`

    return this.request({
      url,
      method: 'GET'
    }).then(response => {
      return new this.constructor(response.data)
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
        Object.defineProperty(item, '_fromResource',
          { get: () => this._fromResource })

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

  $get () {
    return this.get().then(response => {
      return response.data || response
    })
  }

  /**
   * Common CRUD operations
   */

  delete () {
    if (!this.hasId()) {
      throw new Error('This model has a empty ID.')
    }

    return this.request({
      url: this.endpoint(),
      method: 'DELETE'
    }).then(response => {
      return response
    })
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

  /**
   * Relationship operations
   */

  attach (params) {
    return this.request({
      method: 'POST',
      url: this.endpoint(),
      data: params
    }).then(response => {
      return response
    })
  }

  sync (params) {
    return this.request({
      method: 'PUT',
      url: this.endpoint(),
      data: params
    }).then(response => {
      return response
    })
  }

}