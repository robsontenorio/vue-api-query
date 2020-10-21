import type { AxiosPromise } from 'axios'
import { AxiosInstance, AxiosRequestConfig } from 'axios'

import Builder from './Builder'
import type {
  QueryResponseModel,
  RCollection,
  RModel,
  TCollection,
  TModel,
  WCollection,
  WModel
} from './types'
import { getProp, hasProperty, setProp } from './utils'

type Constructor<T extends Model<boolean, boolean>> = new (
  ...args: unknown[]
) => T

export default abstract class Model<
  isWrappedCollection extends boolean = false,
  isWrappedModel extends boolean = false
> {
  public static $http: AxiosInstance
  private readonly _builder: Builder | undefined
  private _fromResource: string | undefined
  private _customResource: string | undefined

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
      throw new Error('You must set $http property.')
    }
  }

  /**
   *  Setup
   */

  abstract baseURL(): string

  abstract request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

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
    const key = this.primaryKey()

    return hasProperty(this, key) ? this[key] : ''
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

  hasMany<T extends Model<boolean, boolean>>(model: Constructor<T>): T {
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

  // @ts-ignore
  relations(): Record<string, InstanceType<typeof Model>> {
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

  isWrappedModel<T extends Model<boolean, boolean>>(
    model: TModel<T>
  ): model is WModel<T> {
    return 'data' in model
  }

  isWrappedCollection<T extends Model<boolean, boolean>>(
    collection: TCollection<T>
  ): collection is WCollection<T> {
    return !Array.isArray(collection) && 'data' in collection
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

  select(...fields: (string | { [p: string]: string[] })[]): this {
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

  _applyInstance<T extends Model<boolean, boolean>>(
    data: Record<string, any>,
    model: Constructor<T> = this.constructor as Constructor<T>
  ): QueryResponseModel<T> {
    const item = new model(data)

    if (this._fromResource) {
      item._from(this._fromResource)
    }

    return (item as unknown) as QueryResponseModel<T>
  }

  _applyInstanceCollection<T extends Model<boolean, boolean>>(
    data: Record<string, any> | Record<string, any>[],
    model: Constructor<T> = this.constructor as Constructor<T>
  ): TModel<T>[] {
    let collection = !Array.isArray(data) && 'data' in data ? data.data : data
    collection = Array.isArray(collection) ? collection : [collection]

    return collection.map((c: Record<string, any>) => {
      if ('data' in c) {
        return { data: this._applyInstance<T>(c.data, model) }
      } else {
        return this._applyInstance<T>(c, model)
      }
    })
  }

  _applyRelations(model: this): void {
    const relations = model.relations()

    for (const key of Object.keys(relations)) {
      const relation = getProp(model, key)

      if (!hasProperty(model, key) || !relation) {
        return
      }

      if (
        Array.isArray(relation) ||
        ('data' in relation && Array.isArray(relation.data))
      ) {
        const collection = this._applyInstanceCollection(
          relation,
          relations[key]
        )

        if ('data' in relation) {
          setProp(model, key + '.data', collection)
        } else {
          setProp(model, key, collection)
        }
      } else {
        setProp(model, key, this._applyInstance(relation, relations[key]))
      }
    }
  }

  first(): Promise<RModel<this, isWrappedModel>> {
    return this.get().then((response: TCollection<this>) => {
      const collection = response
      let model: TModel<this>

      if (this.isWrappedCollection<this>(collection)) {
        model = collection.data[0]
      } else {
        model = collection[0]
      }

      return (model || {}) as RModel<this, isWrappedModel>
    })
  }

  $first(): Promise<QueryResponseModel<this>> {
    return this.first().then((response: TModel<this>) => {
      let model = response

      if (this.isWrappedModel(model)) {
        model = model.data
      }

      return model
    })
  }

  find(identifier: number | string): Promise<RModel<this, isWrappedModel>> {
    if (identifier === undefined) {
      throw new Error('You must specify the param on find() method.')
    }

    if (!this._builder) {
      throw new Error('Builder methods are not available after fetching data.')
    }

    const base = this._fromResource || `${this.baseURL()}/${this.resource()}`
    const url = `${base}/${identifier}${this._builder.query()}`

    return this.request<TModel<this>>({
      url,
      method: 'GET'
    }).then((response) => {
      let model = response.data

      if (this.isWrappedModel(model)) {
        model.data = this._applyInstance<this>(model.data)
      } else {
        model = this._applyInstance<this>(model)
      }

      return model as RModel<this, isWrappedModel>
    })
  }

  $find(identifier: number | string): Promise<QueryResponseModel<this>> {
    if (identifier === undefined) {
      throw new Error('You must specify the param on $find() method.')
    }

    return this.find(identifier).then((response: TModel<this>) => {
      let model = response

      if (this.isWrappedModel(model)) {
        model = model.data
      }

      return model
    })
  }

  get(): Promise<RCollection<this, isWrappedCollection, isWrappedModel>> {
    if (!this._builder) {
      throw new Error('Builder methods are not available after fetching data.')
    }

    let base = this._fromResource || `${this.baseURL()}/${this.resource()}`
    base = this._customResource
      ? `${this.baseURL()}/${this._customResource}`
      : base
    const url = `${base}${this._builder.query()}`

    return this.request<TCollection<this>>({
      url,
      method: 'GET'
    }).then((response) => {
      let collection = response.data
      const instancedCollection = this._applyInstanceCollection<this>(
        collection
      )

      if (this.isWrappedCollection<this>(collection)) {
        collection.data = instancedCollection
      } else {
        collection = instancedCollection
      }

      return collection as RCollection<
        this,
        isWrappedCollection,
        isWrappedModel
      >
    })
  }

  $get(): Promise<RModel<this, isWrappedModel>[]> {
    return this.get().then((response: TCollection<this>) => {
      let collection = response

      if (this.isWrappedCollection<this>(collection)) {
        collection = collection.data
      }

      return collection as RModel<this, isWrappedModel>[]
    })
  }

  /**
   * Common CRUD operations
   */

  delete(): AxiosPromise<unknown> {
    if (!this.hasId()) {
      throw new Error('This model has a empty ID.')
    }

    return this.request<unknown>({
      url: this.endpoint(),
      method: 'DELETE'
    }).then((response) => response)
  }

  save(): Promise<RModel<this, isWrappedModel>> {
    return this.hasId() ? this._update() : this._create()
  }

  _create(): Promise<RModel<this, isWrappedModel>> {
    return this.request<TModel<this>>({
      method: 'POST',
      url: this.endpoint(),
      data: this
    }).then((response) => {
      let model = response.data

      if (this.isWrappedModel(model)) {
        model.data = this._applyInstance<this>(model.data)
      } else {
        model = this._applyInstance<this>(model)
      }

      return model as RModel<this, isWrappedModel>
    })
  }

  _update(): Promise<RModel<this, isWrappedModel>> {
    return this.request<TModel<this>>({
      method: 'PUT',
      url: this.endpoint(),
      data: this
    }).then((response) => {
      let model = response.data

      if (this.isWrappedModel(model)) {
        model.data = this._applyInstance<this>(model.data)
      } else {
        model = this._applyInstance<this>(model)
      }

      return model as RModel<this, isWrappedModel>
    })
  }

  /**
   * Relationship operations
   */

  attach(params: unknown): AxiosPromise<unknown> {
    return this.request<unknown>({
      method: 'POST',
      url: this.endpoint(),
      data: params
    }).then((response) => response)
  }

  sync(params: unknown): AxiosPromise<unknown> {
    return this.request<unknown>({
      method: 'PUT',
      url: this.endpoint(),
      data: params
    }).then((response) => response)
  }
}
