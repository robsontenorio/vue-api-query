type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'

export interface HTTPRequestConfig {
  method?: Method
  url?: string
  data?: Record<string, any> | any
  headers?: any
  [key: string]: any
}

export interface HTTPResponse<T> {
  data: T
  [key: string]: any
}

export type HTTPPromise<T = any> = Promise<HTTPResponse<T>>

export interface WrappedResponse<T> {
  data: T,
  [key: string]: any
}

export type QueryPromise<T> = Promise<T | WrappedResponse<T>>

declare class StaticModel {
  /**
   * Create an instance of itself.
   */
  static instance<M extends typeof Model> (this: M): InstanceType<M>

  /**
   * Query
   */

  /**
   * Configuration of HTTP Instance.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#config|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#configuring-the-request|Building the Query}
   */
  static config<M extends typeof Model> (this: M, config: HTTPRequestConfig): InstanceType<M>

  /**
   * Eager load relationships.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#include|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#including-relationships|Building the Query}
   */
  static include<M extends typeof Model> (this: M, ...relationships: string[]): InstanceType<M>

  /**
   * Eager load relationships.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#include|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#including-relationships|Building the Query}
   */
  static include<M extends typeof Model> (this: M, relationships: string[]): InstanceType<M>

  /**
   * Eager load relationships.
   *
   * Alias for the [include()]{@link include} method.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#include|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#including-relationships|Building the Query}
   */
  static with<M extends typeof Model> (this: M, ...relationships: string[]): InstanceType<M>

  /**
   * Eager load relationships.
   *
   * Alias for the [include()]{@link include} method.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#include|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#including-relationships|Building the Query}
   */
  static with<M extends typeof Model> (this: M, relationships: string[]): InstanceType<M>

  /**
   * Append attributes.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#append|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#appending-attributes|Building the Query}
   */
  static append<M extends typeof Model> (this: M, ...attributes: string[]): InstanceType<M>

  /**
   * Append attributes.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#append|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#appending-attributes|Building the Query}
   */
  static append<M extends typeof Model> (this: M, attributes: string[]): InstanceType<M>

  /**
   * Set the columns to be selected.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#select|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#selecting-fields|Building the Query}
   */
  static select<M extends typeof Model> (this: M, ...columns: string[]): InstanceType<M>

  /**
   * Set the columns to be selected.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#select|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#selecting-fields|Building the Query}
   */
  static select<M extends typeof Model> (this: M, columns: string[]): InstanceType<M>

  /**
   * Set the columns to be selected.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#select|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#selecting-fields|Building the Query}
   */
  static select<M extends typeof Model> (this: M, columns: {
    [related: string]: string[]
  }): InstanceType<M>

  /**
   * Add a basic where clause to the query.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#where|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#evaluating-a-single-value|Building the Query}
   */
  static where<M extends typeof Model> (
    this: M,
    field: string | string[],
    value: string | number | boolean
  ): InstanceType<M>

  /**
   * Add a "where in" clause to the query.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#wherein|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#evaluating-multiple-values|Building the Query}
   */
  static whereIn<M extends typeof Model> (
    this: M,
    field: string | string[],
    values: (string | number | boolean)[]
  ): InstanceType<M>

  /**
   * Add an "order by" clause to the query.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#orderby|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#sorting|Building the Query}
   */
  static orderBy<M extends typeof Model> (this: M, ...columns: string[]): InstanceType<M>

  /**
   * Add an "order by" clause to the query.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#orderby|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#sorting|Building the Query}
   */
  static orderBy<M extends typeof Model> (this: M, columns: string[]): InstanceType<M>

  /**
   * Set the current page.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#page|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#paginating|Building the Query}
   */
  static page<M extends typeof Model> (this: M, number: number): InstanceType<M>

  /**
   * Set the page limit.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#limit|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#paginating|Building the Query}
   */
  static limit<M extends typeof Model> (this: M, number: number): InstanceType<M>

  /**
   * Add custom parameters to the query.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#params|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#applying-custom-parameters|Building the Query}
   */
  static params<M extends typeof Model> (this: M, payload: Record<string, string | number | boolean>): InstanceType<M>

  /**
   * Build custom endpoints.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#custom|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#calling-a-custom-resource|Building the Query}
   */
  static custom<M extends typeof Model> (this: M, ...endpoint: (Model | string)[]): InstanceType<M>

  /**
   * Results
   */

  /**
   * Execute the query and get the first result.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#first|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#getting-the-first-record|Building the Query}
   */
  static first<M extends typeof Model> (this: M): QueryPromise<InstanceType<M>>

  /**
   * Execute the query and get the first result.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#first-1|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#getting-the-first-record|Building the Query}
   */
  static $first<M extends typeof Model> (this: M): Promise<InstanceType<M>>

  /**
   * Find a model by its primary key.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#find|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#finding-a-specific-record|Building the Query}
   */
  static find<M extends typeof Model> (this: M, id: number | string): QueryPromise<InstanceType<M>>

  /**
   * Find a model by its primary key.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#find-1|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#finding-a-specific-record|Building the Query}
   */
  static $find<M extends typeof Model> (this: M, id: number | string): Promise<InstanceType<M>>

  /**
   * Execute the query and get all results.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#get|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#retrieving-a-list-of-records|Building the Query}
   */
  static get<M extends typeof Model> (this: M): QueryPromise<InstanceType<M>[]>

  /**
   * Execute the query and get all results.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#get-1|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#retrieving-a-list-of-records|Building the Query}
   */
  static $get<M extends typeof Model> (this: M): Promise<InstanceType<M>[]>

  /**
   * Execute the query and get all results.
   *
   * Alias for the [get()]{@link get} method.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#get|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#retrieving-a-list-of-records|Building the Query}
   */
  static all<M extends typeof Model> (this: M): QueryPromise<InstanceType<M>[]>

  /**
   * Execute the query and get all results.
   *
   * Alias for the [$get()]{@link $get} method.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#get-1|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#retrieving-a-list-of-records|Building the Query}
   */
  static $all<M extends typeof Model> (this: M): Promise<InstanceType<M>[]>
}

export class Model extends StaticModel {
  /**
   * Instance of the HTTP client which is used to make requests.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/model-options#http|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/installation|Installation}
   */
  static $http: any

  constructor (...args: any[])

  /**
   * Settings
   */

  /**
   * Instance of the HTTP client which is used to make requests.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/model-options#http|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/installation|Installation}
   */
  get $http (): any

  /**
   * This method can be overridden in the model to configure
   * [object-to-formdata]{@link https://github.com/therealparmesh/object-to-formdata#usage|object-to-formdata}.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/model-options#http|API Reference}
   * @see {@link https://github.com/therealparmesh/object-to-formdata#usage|object-to-formdata}
   */
  formData (): {
    indices: boolean,
    nullsAsUndefineds: boolean,
    booleansAsIntegers: boolean,
    allowEmptyArrays: boolean,
  }

  /**
   * Resource route of the model which is used to build the query.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/model-options#resource|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/configuration#creating-the-domain-models|Configuration}
   */
  resource (): string

  /**
   * Primary key of the model which is used to build the query.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/model-options#primarykey|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/configuration#changing-the-primary-key|Configuration}
   */
  primaryKey (): string

  /**
   * This method can be used to lazy load relationships of a model and apply model instances to them.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/model-options#hasmany|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/configuration#lazy-loading-relationships|Configuration}
   */
  hasMany<T extends typeof Model> (model: T): InstanceType<T>

  /**
   * This method can be implemented in the model to apply model instances to eager loaded relationships.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/model-options#relations|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/configuration#eager-loaded-relationships|Configuration}
   */
  relations (): Record<string, typeof Model>

  /**
   * Base URL which is used and prepended to make requests.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/model-options#baseurl|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/configuration#creating-a-base-model|Configuration}
   */
  baseURL (): string

  /**
   * Request method which is used to make requests.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/model-options#request|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/configuration#creating-a-base-model|Configuration}
   */
  request (config: HTTPRequestConfig): HTTPPromise

  /**
   * From resource.
   */
  private _from (url: string): void

  /**
   * Helpers
   */

  /**
   * Get the primary key of the model.
   */
  private getPrimaryKey (): string | number

  /**
   * Determines whether the model has an ID.
   */
  private hasId (): boolean

  /**
   * Determines whether the ID is valid.
   */
  private isValidId (id: string | number): boolean

  /**
   * The model's endpoint.
   */
  private endpoint (): string

  /**
   * This method can be overridden in the model to customize the name of the query parameters.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/model-options#parameternames|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/configuration#customizing-query-parameters|Configuration}
   */
  protected parameterNames (): {
    include: string,
    filter: string,
    sort: string,
    fields: string,
    append: string,
    page: string,
    limit: string
  }

  /**
   * Query
   */

  /**
   * Configuration of HTTP Instance.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#config|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#configuring-the-request|Building the Query}
   */
  config (config: HTTPRequestConfig): this

  /**
   * Eager load relationships.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#include|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#including-relationships|Building the Query}
   */
  include (...relationships: string[]): this

  /**
   * Eager load relationships.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#include|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#including-relationships|Building the Query}
   */
  include (relationships: string[]): this

  /**
   * Eager load relationships.
   *
   * Alias for the [include()]{@link include} method.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#include|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#including-relationships|Building the Query}
   */
  with (...relationships: string[]): this

  /**
   * Eager load relationships.
   *
   * Alias for the [include()]{@link include} method.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#include|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#including-relationships|Building the Query}
   */
  with (relationships: string[]): this

  /**
   * Append attributes.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#append|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#appending-attributes|Building the Query}
   */
  append (...attributes: string[]): this

  /**
   * Append attributes.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#append|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#appending-attributes|Building the Query}
   */
  append (attributes: string[]): this

  /**
   * Set the columns to be selected.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#select|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#selecting-fields|Building the Query}
   */
  select (...columns: string[]): this

  /**
   * Set the columns to be selected.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#select|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#selecting-fields|Building the Query}
   */
  select (columns: string[]): this

  /**
   * Set the columns to be selected.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#select|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#selecting-fields|Building the Query}
   */
  select (columns: {
    [related: string]: string[]
  }): this

  /**
   * Add a basic where clause to the query.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#where|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#evaluating-a-single-value|Building the Query}
   */
  where (field: string | string[], value: string | number | boolean): this

  /**
   * Add a "where in" clause to the query.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#wherein|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#evaluating-multiple-values|Building the Query}
   */
  whereIn (field: string | string[], array: (string | number | boolean)[]): this

  /**
   * Add an "order by" clause to the query.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#orderby|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#sorting|Building the Query}
   */
  orderBy (...columns: string[]): this

  /**
   * Add an "order by" clause to the query.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#orderby|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#sorting|Building the Query}
   */
  orderBy (columns: string[]): this

  /**
   * Set the current page.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#page|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#paginating|Building the Query}
   */
  page (number: number): this

  /**
   * Set the page limit.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#limit|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#paginating|Building the Query}
   */
  limit (number: number): this

  /**
   * Add custom parameters to the query.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#params|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#applying-custom-parameters|Building the Query}
   */
  params (payload: Record<string, string | number | boolean>): this

  /**
   * Build custom endpoints.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#custom|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#calling-a-custom-resource|Building the Query}
   */
  custom (...endpoint: (Model | string)[]): this

  /**
   * Results
   */

  /**
   * Execute the query and get the first result.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#first|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#getting-the-first-record|Building the Query}
   */
  first (): QueryPromise<this>

  /**
   * Execute the query and get the first result.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#first-1|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#getting-the-first-record|Building the Query}
   */
  $first (): Promise<this>

  /**
   * Find a model by its primary key.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#find|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#finding-a-specific-record|Building the Query}
   */
  find (identifier: number | string): QueryPromise<this>

  /**
   * Find a model by its primary key.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#find-1|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#finding-a-specific-record|Building the Query}
   */
  $find (identifier: number | string): Promise<this>

  /**
   * Execute the query and get all results.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#get|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#retrieving-a-list-of-records|Building the Query}
   */
  get (): QueryPromise<this[]>

  /**
   * Execute the query and get all results.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#get-1|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#retrieving-a-list-of-records|Building the Query}
   */
  $get (): Promise<this[]>

  /**
   * Execute the query and get all results.
   *
   * Alias for the [get()]{@link get} method.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#get|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#retrieving-a-list-of-records|Building the Query}
   */
  all (): QueryPromise<this[]>

  /**
   * Execute the query and get all results.
   *
   * Alias for the [$get()]{@link $get} method.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/query-builder-methods#get-1|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/building-the-query#retrieving-a-list-of-records|Building the Query}
   */
  $all (): Promise<this[]>

  /**
   * Common CRUD operations
   */

  /**
   * Delete the model from the database.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/crud-operations#delete|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/performing-operations#deleting-a-model|Performing Operations}
   */
  delete (): Promise<any>

  /**
   * Save or update a model in the database, then return the instance.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/crud-operations#save|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/performing-operations#saving-a-model|Performing Operations}
   */
  save (): Promise<this>

  /**
   * Save a model in the database, then return the instance.
   */
  private _create (): Promise<this>

  /**
   * Update a model in the database, then return the instance.
   */
  private _update (): Promise<this>

  /**
   * Make a `PATCH` request to update a model in the database, then return the instance.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/crud-operations#patch|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/performing-operations#saving-a-model|Performing Operations}
   */
  patch (): Promise<this>

  /**
   * Relationship operations
   */

  /**
   * Create a new related model.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/relationship-operations#for|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/performing-operations#creating-related-models|Performing Operations}
   */
  for (...models: Model[]): this

  /**
   * Create a new related model.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/relationship-operations#attach|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/performing-operations#attaching-a-model|Performing Operations}
   */
  attach (params: Record<string, any>): Promise<any>

  /**
   * Update a related model.
   *
   * @see {@link https://robsontenorio.github.io/vue-api-query/api/relationship-operations#sync|API Reference}
   * @see {@link https://robsontenorio.github.io/vue-api-query/performing-operations#syncing-a-model|Performing Operations}
   */
  sync (params: Record<string, any>): Promise<any>
}
