import Model from './Model'
import { ModelData, RCollection, RModel } from './types'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function BaseModel<
  isWrappedCollection extends boolean = false,
  isWrappedModel extends boolean = false
>() {
  type ThisClass<
    InstanceType extends Model<isWrappedCollection, isWrappedModel>
  > = {
    instance<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>
    ): T
    new (...args: unknown[]): InstanceType
  }

  abstract class BaseModel extends Model<isWrappedCollection, isWrappedModel> {
    static instance<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>
    ): T {
      return new this()
    }

    static include<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>,
      ...args: unknown[]
    ): T {
      const self = this.instance<T>()
      self.include(...args)

      return self
    }

    static append<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>,
      ...args: unknown[]
    ): T {
      const self = this.instance<T>()
      self.append(...args)

      return self
    }

    static select<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>,
      ...fields: (string | { [p: string]: string[] })[]
    ): T {
      const self = this.instance<T>()
      self.select(...fields)

      return self
    }

    static where<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>,
      field: string,
      value: unknown
    ): T {
      const self = this.instance<T>()
      self.where(field, value)

      return self
    }

    static whereIn<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>,
      field: string,
      array: unknown[]
    ): T {
      const self = this.instance<T>()
      self.whereIn(field, array)

      return self
    }

    static orderBy<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>,
      ...args: unknown[]
    ): T {
      const self = this.instance<T>()
      self.orderBy(...args)

      return self
    }

    static page<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>,
      value: number
    ): T {
      const self = this.instance<T>()
      self.page(value)

      return self
    }

    static limit<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>,
      value: number
    ): T {
      const self = this.instance<T>()
      self.limit(value)

      return self
    }

    static custom<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>,
      ...args: unknown[]
    ): T {
      const self = this.instance<T>()
      self.custom(...args)

      return self
    }

    static params<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>,
      payload: Record<string, unknown>
    ): T {
      const self = this.instance<T>()
      self.params(payload)

      return self
    }

    static first<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>
    ): Promise<RModel<T, isWrappedModel>> {
      const self = this.instance<T>()

      return self.first()
    }

    static $first<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>
    ): Promise<ModelData<T>> {
      const self = this.instance<T>()

      return self.$first()
    }

    static find<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>,
      identifier: number | string
    ): Promise<RModel<T, isWrappedModel>> {
      const self = this.instance<T>()

      return self.find(identifier)
    }

    static $find<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>,
      identifier: number | string
    ): Promise<ModelData<T>> {
      const self = this.instance<T>()

      return self.$find(identifier)
    }

    static get<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>
    ): Promise<RCollection<T, isWrappedCollection, isWrappedModel>> {
      const self = this.instance<T>()

      return self.get()
    }

    static $get<T extends Model<isWrappedCollection, isWrappedModel>>(
      this: ThisClass<T>
    ): Promise<RModel<T, isWrappedModel>[]> {
      const self = this.instance<T>()

      return self.$get()
    }
  }

  return BaseModel
}
