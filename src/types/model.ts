import Model from '../Model'

/**
 * Domain Model
 * ---
 *
 * The Domain Model type only returns the properties and methods that belongs to domain models,
 * with the addition of [Model Operations]{@link ModelOperations}.
 * All other methods from the base [Base Model]{@link Model} are stripped from this type.
 *
 * @property {Model }T - The model of the response.
 *
 */

export type DomainModel<T extends Model<boolean, boolean>> = Required<
  Omit<T, keyof Omit<Model, ModelOperations>>
>

/**
 * Model Operations
 * ---
 *
 * Operation methods that shouldn't be stripped from [Domain Model]{@link DomainModel} type.
 *
 */

type ModelOperations = 'delete' | 'save' | 'attach' | 'sync' | 'for'

/**
 * Model and Collection Types
 * ---
 *
 * Query Builder: [`first`]{@link Model#first}, [`find`]{@link Model#find}, [`get`]{@link Model#get},
 * [`$get`]{@link Model#$get} and [`save`]{@link Model#save}
 * ([`_create`]{@link Model#_create} and [`_update`]{@link Model#_update})
 *
 * These types should be used internally for type checking. They are Union types.
 * The type guards [`isWrappedModel`]{@link Model#isWrappedModel}
 * and [`isWrappedCollection`]{@link Model#isWrappedCollection}` in Model class can be used to predict the type.
 *
 * They shouldn't be used for response. They must be converted to the Conditional Types.
 *
 * {@link TModel} as {@link QueryResponseModel}
 *
 * {@link TCollection} as {@link QueryResponseCollection}
 *
 */

/**
 * Wrapped Model Type
 * ---
 *
 * A model inside `data` wrapper.
 *
 * @property {Model} T - The model of the response.
 *
 */
export type WrappedModel<T extends Model<boolean, boolean>> = {
  data: DomainModel<T>
}

/**
 * Model Type
 * ---
 *
 * A model that can be wrapped or not.
 *
 * @property {Model} T - The model of the response.
 *
 */
export type TModel<T extends Model<boolean, boolean>> =
  | DomainModel<T>
  | WrappedModel<T>

/**
 * Wrapped Collection Type
 * ---
 *
 * A collection of models inside `data` wrapper.
 *
 * @property {Model} T - The model of the response.
 *
 */
export type WrappedCollection<T extends Model<boolean, boolean>> = {
  data: TModel<T>[]
}

/**
 * Collection Type
 * ---
 *
 * A collection of models that can be wrapped or not.
 *
 * @property {Model} T - The model of the response.
 *
 */
export type TCollection<T extends Model<boolean, boolean>> =
  | WrappedCollection<T>
  | TModel<T>[]

/**
 * Model and Collection Response Types
 * ---
 *
 * Query Builder: [`first`]{@link Model#first}, [`find`]{@link Model#find}, [`get`]{@link Model#get},
 * [`$get`]{@link Model#$get} and [`save`]{@link Model#save}
 * ([`_create`]{@link Model#_create} and [`_update`]{@link Model#_update})
 *
 * These are types used for responses. Different from the types above, these are Conditional Types.
 * They use the arguments of the Model class (Generic Class) to define if the collection and the model
 * are wrapped in "data" property.
 *
 * These types can't be used internally for type checking, only for responses.
 * When using methods that returns these types internally, they must be converted to Union Types.
 *
 * {@link QueryResponseModel} as {@link TModel}
 *
 * {@link QueryResponseCollection} as {@link TCollection}
 *
 */

/**
 * Model Response Type
 * ---
 * A model that is wrapped or not, based on the **M** property.
 *
 * @property {Model} T - The model of the response.
 * @property {boolean} M = false - Is the model wrapped?
 *
 */
export type QueryResponseModel<
  T extends Model<boolean, boolean>,
  M extends boolean = false
> = M extends true ? WrappedModel<T> : DomainModel<T>

/**
 * Collection Response Type
 * ---
 *
 * A collection of models that are wrapped or not, based on the **C** property.
 * The models are wrapped or not, based on the **M** property.
 *
 * @property {Model} T - The model of the response.
 * @property {boolean} C = false - Is the collection of models wrapped?
 * @property {boolean} M = false - Is the model wrapped?
 *
 */
export type QueryResponseCollection<
  T extends Model<boolean, boolean>,
  C extends boolean = false,
  M extends boolean = false
> = C extends true
  ? { data: QueryResponseModel<T, M>[] }
  : QueryResponseModel<T, M>[]
