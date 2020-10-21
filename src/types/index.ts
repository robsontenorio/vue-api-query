import Model from '../Model'

type ModelKeys = Omit<Model, 'delete' | 'save' | 'attach' | 'sync' | 'for'>

type DerivedClass<T extends Model<boolean, boolean>> = Omit<T, keyof ModelKeys>

export type ModelData<T extends Model<boolean, boolean>> = Required<
  DerivedClass<T>
>

export type WModel<T extends Model<boolean, boolean>> = {
  data: ModelData<T>
}

export type TModel<T extends Model<boolean, boolean>> = ModelData<T> | WModel<T>

export type WCollection<T extends Model<boolean, boolean>> = {
  data: TModel<T>[]
}

export type TCollection<T extends Model<boolean, boolean>> =
  | WCollection<T>
  | TModel<T>[]

export type RModel<
  T extends Model<boolean, boolean>,
  isWrappedModel
> = isWrappedModel extends true ? WModel<T> : ModelData<T>

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
