import Builder from './Builder';
import StaticModel from './StaticModel';

export default class Model extends StaticModel {

  constructor(...attributes) {
    super()

    if (attributes.length === 0) {
      this._builder = new Builder(this)
    } else {
      Object.assign(this, ...attributes)
      this._applyRelations(this)
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

  get $http() {
    return Model.$http
  }

  resource() {
    return `${this.constructor.name.toLowerCase()}s`
  }

  primaryKey() {
    return 'id'
  }

  getPrimaryKey() {
    return this[this.primaryKey()]
  }

  custom(...args) {

    if (args.length === 0) {
      throw new Error('The custom() method takes a minimum of one argument.')
    }

    // It would be unintuitive for users to manage where the '/' has to be for
    // multiple arguments. We don't need it for the first argument if it's
    // a string, but subsequent string arguments need the '/' at the beginning.
    // We handle this implementation detail here to simplify the readme.
    let slash = '';
    let resource = '';

    args.forEach(value => {
      switch (true) {
        case (typeof value === 'string'):
          resource += slash + value.replace(/^\/+/, '');
          break;
        case (value instanceof Model):
          resource += slash + value.resource();

          if (value.isValidId(value.getPrimaryKey())) {
            resource += '/' + value.getPrimaryKey();
          }
          break;
        default:
          throw new Error('Arguments to custom() must be strings or instances of Model.')
      }

      if (!slash.length) {
        slash = '/';
      }
    });

    this._customResource = resource

    return this
  }

  hasMany(model) {
    let instance = new model
    let url = `${this.baseURL()}/${this.resource()}/${this.getPrimaryKey()}/${instance.resource()}`

    instance._from(url)

    return instance
  }

  _from(url) {
    Object.defineProperty(this, '_fromResource', { get: () => url })
  }

  for(...args) {
    if (args.length === 0) {
      throw new Error('The for() method takes a minimum of one argument.')
    }

    let url = `${this.baseURL()}`;

    args.forEach(object => {
      if (object instanceof Model === false) {
        throw new Error('The object referenced on for() method is not a valid Model.')
      }

      if (!this.isValidId(object.getPrimaryKey())) {
        throw new Error('The object referenced on for() method has a invalid id.')
      }

      url += `/${object.resource()}/${object.getPrimaryKey()}`
    })

    url += `/${this.resource()}`

    this._from(url)

    return this
  }

  relations () {
    return {}
  }

  /**
   * Helpers
   */

  hasId() {
    const id = this.getPrimaryKey()
    return this.isValidId(id)
  }

  isValidId(id) {
    return id !== undefined && id !== 0 && id !== ''
  }

  endpoint() {
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

  parameterNames() {
    return {
      include: 'include',
      filter: 'filter',
      sort: 'sort',
      fields: 'fields',
      append: 'append',
      page: 'page',
      limit: 'limit'
    }
  }

  /**
   *  Query
   */

  include(...args) {
    this._builder.include(...args)

    return this
  }

  append(...args) {
    this._builder.append(...args)

    return this
  }

  select(...fields) {
    this._builder.select(...fields)

    return this
  }

  where(field, value) {
    this._builder.where(field, value)

    return this
  }

  whereIn(field, array) {
    this._builder.whereIn(field, array)

    return this
  }

  orderBy(...args) {
    this._builder.orderBy(...args)

    return this
  }

  page(value) {
    this._builder.page(value)

    return this
  }

  limit(value) {
    this._builder.limit(value)

    return this
  }

  params(payload) {
    this._builder.params(payload)

    return this
  }

  /**
   * Result
   */

  _applyInstance(data, model = this.constructor) {
    const item = new model(data)

    if(this._fromResource) {
      item._from(this._fromResource)
    }

    return item
  }

  _applyInstanceCollection(data, model = this.constructor) {
    let collection = data.data || data
    collection = Array.isArray(collection) ? collection : [collection]

    collection = collection.map(c => {
      return this._applyInstance(c, model)
    })
    return collection
  }

  _applyRelations(model) {
    const relations = model.relations()

    for(const relation of Object.keys(relations)) {
      if (!model[relation]) {
        return;
      }

      if (Array.isArray(model[relation].data) || Array.isArray(model[relation])) {
        const collection = this._applyInstanceCollection(model[relation], relations[relation])

        if (model[relation].data !== undefined) {
          model[relation].data = collection
        } else {
          model[relation] = collection
        }
      } else {
        model[relation] = this._applyInstance(model[relation], relations[relation])
      }
    }
  }

  first() {
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

  $first() {
    return this
      .first()
      .then(response => response.data || response)
  }

  find(identifier) {
    if (identifier === undefined) {
      throw new Error('You must specify the param on find() method.')
    }
    let base = this._fromResource || `${this.baseURL()}/${this.resource()}`
    let url = `${base}/${identifier}${this._builder.query()}`

    return this.request({
      url,
      method: 'GET'
    }).then(response => {
      return this._applyInstance(response.data)
    })
  }

  $find(identifier) {
    if (identifier === undefined) {
      throw new Error('You must specify the param on $find() method.')
    }

    return this
      .find(identifier)
      .then(response => this._applyInstance(response.data || response))
  }

  get() {
    let base = this._fromResource || `${this.baseURL()}/${this.resource()}`
    base = this._customResource ? `${this.baseURL()}/${this._customResource}` : base
    let url = `${base}${this._builder.query()}`

    return this.request({
      url,
      method: 'GET'
    }).then(response => {
      let collection = this._applyInstanceCollection(response.data)

      if (response.data.data !== undefined) {
        response.data.data = collection
      } else {
        response.data = collection
      }

      return response.data
    })
  }

  $get() {
    return this
      .get()
      .then(response => response.data || response)
  }

  /**
   * Common CRUD operations
   */

  delete() {
    if (!this.hasId()) {
      throw new Error('This model has a empty ID.')
    }

    return this.request({
      url: this.endpoint(),
      method: 'DELETE'
    }).then(response => response)
  }

  save() {
    return this.hasId() ? this._update() : this._create()
  }

  _create() {
    return this.request({
      method: 'POST',
      url: this.endpoint(),
      data: this
    }).then(response => {
      return this._applyInstance(response.data.data || response.data)
    })
  }

  _update() {
    return this.request({
      method: 'PUT',
      url: this.endpoint(),
      data: this
    }).then(response => {
      return this._applyInstance(response.data.data || response.data)
    })
  }

  /**
   * Relationship operations
   */

  attach(params) {
    return this.request({
      method: 'POST',
      url: this.endpoint(),
      data: params
    }).then(response => response)
  }

  sync(params) {
    return this.request({
      method: 'PUT',
      url: this.endpoint(),
      data: params
    }).then(response => response)
  }
}
