import Model from '../Model'

type ModelOperations = 'delete' | 'save' | 'attach' | 'sync' | 'for'

type DerivedModel<T extends Model<boolean, boolean>> = Omit<
  T,
  keyof Omit<Model, ModelOperations>
>

export type QueryResponseModel<T extends Model<boolean, boolean>> = Required<
  DerivedModel<T>
>

export type WModel<T extends Model<boolean, boolean>> = {
  data: QueryResponseModel<T>
}

export type TModel<T extends Model<boolean, boolean>> =
  | QueryResponseModel<T>
  | WModel<T>

export type WCollection<T extends Model<boolean, boolean>> = {
  data: TModel<T>[]
}

export type TCollection<T extends Model<boolean, boolean>> =
  | WCollection<T>
  | TModel<T>[]

export type RModel<
  T extends Model<boolean, boolean>,
  isWrappedModel
> = isWrappedModel extends true ? WModel<T> : QueryResponseModel<T>

type WRCollection<T extends Model<boolean, boolean>, isWrappedModel> = {
  data: RModel<T, isWrappedModel>[]
}

export type RCollection<
  T extends Model<boolean, boolean>,
  isWrappedCollection,
  isWrappedModel
> = isWrappedCollection extends true
  ? WRCollection<T, isWrappedModel>
  : RModel<T, isWrappedModel>[]
