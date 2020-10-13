import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

import Builder from './Builder'

type Constructor<T> = new (...args: any[]) => T

type ThisClass<InstanceType extends Model> = {
  instance<T extends Model>(this: ThisClass<T>): T
  new (...args: unknown[]): InstanceType
}

type UnknownObject = {
  [name: string]: any
}

type WrappedCollection<T> = {
  data: T[] | WrappedModel<T>[]
}

type WrappedModel<T> = {
  data: T
}

export default abstract class Model {
  private readonly _builder: Builder | undefined
  public static $http: AxiosInstance
  private _fromResource: string | undefined
  private _customResource: string | undefined;

  [name: string]: any

  protected constructor(...attributes: unknown[]) {
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

  abstract baseURL(): string

  abstract request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig
  ): Promise<R>

  get $http(): AxiosInstance {
    return Model.$http
  }

  resource(): string {
    return `${this.constructor.name.toLowerCase()}s`
  }

  primaryKey(): string {
    return 'id'
  }

  getPrimaryKey(): string | number {
    return this[this.primaryKey()]
  }

  custom(...args: unknown[]): this {
    if (args.length === 0) {
      throw new Error('The custom() method takes a minimum of one argument.')
    }

    // It would be unintuitive for users to manage where the '/' has to be for
    // multiple arguments. We don't need it for the first argument if it's
    // a string, but subsequent string arguments need the '/' at the beginning.
    // We handle this implementation detail here to simplify the readme.
    let slash = ''
    let resource = ''

    args.forEach((value) => {
      if (typeof value === 'string') {
        resource += slash + value.replace(/^\/+/, '')
      } else if (value instanceof Model) {
        resource += slash + value.resource()

        if (value.isValidId(value.getPrimaryKey())) {
          resource += '/' + value.getPrimaryKey()
        }
      } else {
        throw new Error(
          'Arguments to custom() must be strings or instances of Model.'
        )
      }

      if (!slash.length) {
        slash = '/'
      }
    })

    this._customResource = resource

    return this
  }

  hasMany<T extends Model>(model: Constructor<T>): T {
    const instance = new model()
    const url = `${this.baseURL()}/${this.resource()}/${this.getPrimaryKey()}/${instance.resource()}`

    instance._from(url)

    return instance
  }

  _from(url: string): void {
    Object.defineProperty(this, '_fromResource', { get: () => url })
  }

  for(...args: unknown[]): this {
    if (args.length === 0) {
      throw new Error('The for() method takes a minimum of one argument.')
    }

    let url = `${this.baseURL()}`

    args.forEach((object) => {
      if (!(object instanceof Model)) {
        throw new Error(
          'The object referenced on for() method is not a valid Model.'
        )
      }

      if (!this.isValidId(object.getPrimaryKey())) {
        throw new Error(
          'The object referenced on for() method has a invalid id.'
        )
      }

      url += `/${object.resource()}/${object.getPrimaryKey()}`
    })

    url += `/${this.resource()}`

    this._from(url)

    return this
  }

  relations(): {
    [relation: string]: Constructor<Model>
  } {
    return {}
  }

  /**
   * Helpers
   */

  hasId(): boolean {
    const id = this.getPrimaryKey()
    return this.isValidId(id)
  }

  isValidId(id: number | string): boolean {
    return id !== undefined && id !== 0 && id !== ''
  }

  endpoint(): string {
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

  parameterNames(): {
    include: string
    filter: string
    sort: string
    fields: string
    append: string
    page: string
    limit: string
  } {
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

  include(...args: unknown[]): this {
    if (!this._builder) {
      throw new Error('Builder methods are not available after fetching data.')
    }

    this._builder.include(...args)

    return this
  }

  append(...args: unknown[]): this {
    if (!this._builder) {
      throw new Error('Builder methods are not available after fetching data.')
    }

    this._builder.append(...args)

    return this
  }

  select(...fields: (string[] | { [p: string]: string[] })[]): this {
    if (!this._builder) {
      throw new Error('Builder methods are not available after fetching data.')
    }

    this._builder.select(...fields)

    return this
  }

  where(field: string, value: unknown): this {
    if (!this._builder) {
      throw new Error('Builder methods are not available after fetching data.')
    }

    this._builder.where(field, value)

    return this
  }

  whereIn(field: string, array: unknown[]): this {
    if (!this._builder) {
      throw new Error('Builder methods are not available after fetching data.')
    }

    this._builder.whereIn(field, array)

    return this
  }

  orderBy(...args: unknown[]): this {
    if (!this._builder) {
      throw new Error('Builder methods are not available after fetching data.')
    }

    this._builder.orderBy(...args)

    return this
  }

  page(value: number): this {
    if (!this._builder) {
      throw new Error('Builder methods are not available after fetching data.')
    }

    this._builder.page(value)

    return this
  }

  limit(value: number): this {
    if (!this._builder) {
      throw new Error('Builder methods are not available after fetching data.')
    }

    this._builder.limit(value)

    return this
  }

  params(payload: Record<string, unknown>): this {
    if (!this._builder) {
      throw new Error('Builder methods are not available after fetching data.')
    }

    this._builder.params(payload)

    return this
  }

  /**
   * Result
   */

  _applyInstance<T extends Model>(
    data: UnknownObject,
    model: Constructor<T> = this.constructor as Constructor<T>
  ): T {
    const item = new model(data)

    if (this._fromResource) {
      item._from(this._fromResource)
    }

    return item
  }

  _applyInstanceCollection<T extends Model>(
    data: UnknownObject | UnknownObject[],
    model: Constructor<T> = this.constructor as Constructor<T>
  ): T[] {
    let collection: UnknownObject | UnknownObject[] = data

    collection = Array.isArray(collection)
      ? collection
      : [collection?.data || collection]

    return collection.map((c: UnknownObject) => {
      return this._applyInstance(c, model)
    })
  }

  _applyRelations(model: this): void {
    const relations = model.relations()

    for (const relation of Object.keys(relations)) {
      if (!model[relation]) {
        return
      }

      if (
        Array.isArray(model[relation].data) ||
        Array.isArray(model[relation])
      ) {
        const collection = this._applyInstanceCollection(
          model[relation],
          relations[relation]
        )

        if (model[relation].data !== undefined) {
          model[relation].data = collection
        } else {
          model[relation] = collection
        }
      } else {
        model[relation] = this._applyInstance(
          model[relation],
          relations[relation]
        )
      }
    }
  }

  first(): Promise<this | WrappedModel<this>> {
    return this.get().then((response) =>
      Array.isArray(response) ? response[0] : response.data[0] || {}
    )
  }

  $first(): Promise<this> {
    return this.first().then((response) =>
      'data' in response ? response.data : response
    )
  }

  find(identifier: number | string): Promise<this | WrappedModel<this>> {
    if (identifier === undefined) {
      throw new Error('You must specify the param on find() method.')
    }

    if (!this._builder) {
      throw new Error('Builder methods are not available after fetching data.')
    }

    const base = this._fromResource || `${this.baseURL()}/${this.resource()}`
    const url = `${base}/${identifier}${this._builder.query()}`

    return this.request<this | WrappedModel<this>>({
      url,
      method: 'GET'
    }).then((response) => {
      if ('data' in response.data) {
        return response.data
      }

      return this._applyInstance<this>(response.data)
    })
  }

  $find(identifier: number | string): Promise<this> {
    if (identifier === undefined) {
      throw new Error('You must specify the param on $find() method.')
    }

    return this.find(identifier).then((response) =>
      this._applyInstance<this>('data' in response ? response.data : response)
    )
  }

  get(): Promise<this[] | WrappedModel<this>[] | WrappedCollection<this>> {
    if (!this._builder) {
      throw new Error('Builder methods are not available after fetching data.')
    }

    let base = this._fromResource || `${this.baseURL()}/${this.resource()}`
    base = this._customResource
      ? `${this.baseURL()}/${this._customResource}`
      : base
    const url = `${base}${this._builder.query()}`

    return this.request<
      this[] | WrappedModel<this>[] | WrappedCollection<this>
    >({
      url,
      method: 'GET'
    }).then((response) => {
      const collection = this._applyInstanceCollection<this>(response.data)

      if (Array.isArray(response.data)) {
        response.data = collection
      } else {
        response.data.data = collection
      }

      return response.data
    })
  }

  $get(): Promise<this[] | WrappedModel<this>[]> {
    return this.get().then((response) =>
      Array.isArray(response) ? response : response.data
    )
  }

  /**
   * Common CRUD operations
   */

  delete(): Promise<AxiosResponse<unknown>> {
    if (!this.hasId()) {
      throw new Error('This model has a empty ID.')
    }

    return this.request<unknown>({
      url: this.endpoint(),
      method: 'DELETE'
    }).then((response) => response)
  }

  save(): Promise<this | WrappedModel<this>> {
    return this.hasId() ? this._update() : this._create()
  }

  _create(): Promise<this | WrappedModel<this>> {
    return this.request<this>({
      method: 'POST',
      url: this.endpoint(),
      data: this
    }).then((response) => {
      return this._applyInstance<this>(response.data)
    })
  }

  _update(): Promise<this | WrappedModel<this>> {
    return this.request<this>({
      method: 'PUT',
      url: this.endpoint(),
      data: this
    }).then((response) => {
      return this._applyInstance<this>(response.data)
    })
  }

  /**
   * Relationship operations
   */

  attach(params: unknown): Promise<AxiosResponse<unknown>> {
    return this.request<unknown>({
      method: 'POST',
      url: this.endpoint(),
      data: params
    }).then((response) => response)
  }

  sync(params: unknown): Promise<AxiosResponse<unknown>> {
    return this.request<unknown>({
      method: 'PUT',
      url: this.endpoint(),
      data: params
    }).then((response) => response)
  }

  /**
   * Static
   */

  static instance<T extends Model>(this: ThisClass<T>): T {
    return new this()
  }

  static include<T extends Model>(this: ThisClass<T>, ...args: unknown[]): T {
    const self = this.instance<T>()
    self.include(...args)

    return self
  }

  static append<T extends Model>(this: ThisClass<T>, ...args: unknown[]): T {
    const self = this.instance<T>()
    self.append(...args)

    return self
  }

  static select<T extends Model>(
    this: ThisClass<T>,
    ...fields: (string[] | { [p: string]: string[] })[]
  ): T {
    const self = this.instance<T>()
    self.select(...fields)

    return self
  }

  static where<T extends Model>(
    this: ThisClass<T>,
    field: string,
    value: unknown
  ): T {
    const self = this.instance<T>()
    self.where(field, value)

    return self
  }

  static whereIn<T extends Model>(
    this: ThisClass<T>,
    field: string,
    array: unknown[]
  ): T {
    const self = this.instance<T>()
    self.whereIn(field, array)

    return self
  }

  static orderBy<T extends Model>(this: ThisClass<T>, ...args: unknown[]): T {
    const self = this.instance<T>()
    self.orderBy(...args)

    return self
  }

  static page<T extends Model>(this: ThisClass<T>, value: number): T {
    const self = this.instance<T>()
    self.page(value)

    return self
  }

  static limit<T extends Model>(this: ThisClass<T>, value: number): T {
    const self = this.instance<T>()
    self.limit(value)

    return self
  }

  static custom<T extends Model>(this: ThisClass<T>, ...args: unknown[]): T {
    const self = this.instance<T>()
    self.custom(...args)

    return self
  }

  static params<T extends Model>(
    this: ThisClass<T>,
    payload: Record<string, unknown>
  ): T {
    const self = this.instance<T>()
    self.params(payload)

    return self
  }

  static first<T extends Model>(
    this: ThisClass<T>
  ): Promise<T | WrappedModel<T>> {
    const self = this.instance<T>()

    return self.first()
  }

  static $first<T extends Model>(this: ThisClass<T>): Promise<T> {
    const self = this.instance<T>()

    return self.$first()
  }

  static find<T extends Model>(
    this: ThisClass<T>,
    identifier: number | string
  ): Promise<T | WrappedModel<T>> {
    const self = this.instance<T>()

    return self.find(identifier)
  }

  static $find<T extends Model>(
    this: ThisClass<T>,
    identifier: number | string
  ): Promise<T> {
    const self = this.instance<T>()

    return self.$find(identifier)
  }

  static get<T extends Model>(
    this: ThisClass<T>
  ): Promise<T[] | WrappedModel<T>[] | WrappedCollection<T>> {
    const self = this.instance<T>()

    return self.get()
  }

  static $get<T extends Model>(
    this: ThisClass<T>
  ): Promise<T[] | WrappedModel<T>[]> {
    const self = this.instance<T>()

    return self.$get()
  }
}
