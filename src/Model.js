import Builder from './Builder';
import StaticModel from './StaticModel';
import FormTools from './FormTools'

export default class Model extends StaticModel {

  constructor(...atributtes) {
    super()

    if (atributtes.length === 0) {
      this._builder = new Builder(this)
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

  hasMany (model) {
    let instance = new model
    let url = `${this.baseURL()}/${this.resource()}/${this.getPrimaryKey()}/${instance.resource()}`

    instance._from(url)

    return instance
  }

  _from (url) {
    Object.defineProperty(this, '_fromResource', { get: () => url })
  }

  for (object) {
    if (object instanceof Model === false) {
      throw new Error('The object referenced on for() method is not a valid Model.')
    }

    if (!this.isValidId(object.id)) {
      throw new Error('The object referenced on for() method has a invalid id.')
    }

    let url = `${this.baseURL()}/${object.resource()}/${object.getPrimaryKey()}/${this.resource()}`

    this._from(url)

    return this
  }

  /**
   * Helpers
   */

  hasId () {
    const id = this.getPrimaryKey()
    return this.isValidId(id)
  }

  isValidId (id) {
    return id !== undefined && id !== 0 && id !== ''
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
    let base = this._fromResource || `${this.baseURL()}/${this.resource()}`
    let url = `${base}/${identifier}${this._builder.query()}`

    return this.request({
      url,
      method: 'GET'
    }).then(response => new this.constructor(response.data))
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
        Object.defineProperty(item, '_fromResource', { get: () => this._fromResource })

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
    return this
      .get()
      .then(response => response.data || response)
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
    }).then(response => response)
  }

  /**
   * @param {FormTools} formTools object
   */
  save (formTools) {
    return this.hasId() ? this._update(formTools) : this._create(formTools)
  }

  /**
   * @param {FormTools} formTools object
   */
  _create (formTools) {
    return this._submit('POST', this.endpoint(), this, formTools)
      .then(response => {
        return Object.assign(this, response.data)
      });
  }

  /**
   * @param {FormTools} formTools object
   */
  _update (formTools) {
    return this._submit('PUT', this.endpoint(), this, formTools)
      .then(response => {
        return Object.assign(this, response.data)
      });
  }

  /**
   * @param {String} method
   * @param {String} url
   * @param {Object} data
   * @param {FormTools} formTools object
   */
  _submit(method, url, data, formTools) {
    if(formTools) {
      formTools.startProcessing();
    }
    return new Promise((resolve, reject) => {
        return this.request({
            method: method,
            url: url,
            data: data
        }).then(response => {
          resolve(response)
        }).catch(error => {
            if(formTools) {
                formTools.busy = false
                if (error.response && error.response.data.errors && (error.response.status === 422)) {
                    formTools.errors.record(error.response.data.errors)
                }
            }
            reject(error)
        })
    });
  }

  /**
   * Relationship operations
   */

  attach (params) {
    return this.request({
      method: 'POST',
      url: this.endpoint(),
      data: params
    }).then(response => response)
  }

  sync (params) {
    return this.request({
      method: 'PUT',
      url: this.endpoint(),
      data: params
    }).then(response => response)
  }

}