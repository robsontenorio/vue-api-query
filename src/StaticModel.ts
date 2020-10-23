import Model from './Model'
import { QueryResponseModel, RCollection, RModel } from './types'

type ThisClass<InstanceType extends Model<boolean, boolean>> = {
  instance<T extends Model<boolean, boolean>>(this: ThisClass<T>): T
  new (...args: unknown[]): InstanceType
}

export default abstract class StaticModel {
  static instance<T extends Model<boolean, boolean>>(this: ThisClass<T>): T {
    return new this()
  }

  static include<T extends Model<boolean, boolean>>(
    this: ThisClass<T>,
    ...args: unknown[]
  ): T {
    const self = this.instance<T>()
    self.include(...args)

    return self
  }

  static append<T extends Model<boolean, boolean>>(
    this: ThisClass<T>,
    ...args: unknown[]
  ): T {
    const self = this.instance<T>()
    self.append(...args)

    return self
  }

  static select<T extends Model<boolean, boolean>>(
    this: ThisClass<T>,
    ...fields: (string | { [p: string]: string[] })[]
  ): T {
    const self = this.instance<T>()
    self.select(...fields)

    return self
  }

  static where<T extends Model<boolean, boolean>>(
    this: ThisClass<T>,
    field: string,
    value: unknown
  ): T {
    const self = this.instance<T>()
    self.where(field, value)

    return self
  }

  static whereIn<T extends Model<boolean, boolean>>(
    this: ThisClass<T>,
    field: string,
    array: unknown[]
  ): T {
    const self = this.instance<T>()
    self.whereIn(field, array)

    return self
  }

  static orderBy<T extends Model<boolean, boolean>>(
    this: ThisClass<T>,
    ...args: unknown[]
  ): T {
    const self = this.instance<T>()
    self.orderBy(...args)

    return self
  }

  static page<T extends Model<boolean, boolean>>(
    this: ThisClass<T>,
    value: number
  ): T {
    const self = this.instance<T>()
    self.page(value)

    return self
  }

  static limit<T extends Model<boolean, boolean>>(
    this: ThisClass<T>,
    value: number
  ): T {
    const self = this.instance<T>()
    self.limit(value)

    return self
  }

  static custom<T extends Model<boolean, boolean>>(
    this: ThisClass<T>,
    ...args: unknown[]
  ): T {
    const self = this.instance<T>()
    self.custom(...args)

    return self
  }

  static params<T extends Model<boolean, boolean>>(
    this: ThisClass<T>,
    payload: Record<string, unknown>
  ): T {
    const self = this.instance<T>()
    self.params(payload)

    return self
  }

  static first<T extends Model<boolean, boolean>>(
    this: ThisClass<T>
  ): Promise<RModel<T, boolean>> {
    const self = this.instance<T>()

    return self.first()
  }

  static $first<T extends Model<boolean, boolean>>(
    this: ThisClass<T>
  ): Promise<QueryResponseModel<T>> {
    const self = this.instance<T>()

    return self.$first()
  }

  static find<T extends Model<boolean, boolean>>(
    this: ThisClass<T>,
    identifier: number | string
  ): Promise<RModel<T, boolean>> {
    const self = this.instance<T>()

    return self.find(identifier)
  }

  static $find<T extends Model<boolean, boolean>>(
    this: ThisClass<T>,
    identifier: number | string
  ): Promise<QueryResponseModel<T>> {
    const self = this.instance<T>()

    return self.$find(identifier)
  }

  static get<T extends Model<boolean, boolean>>(
    this: ThisClass<T>
  ): Promise<RCollection<T, boolean, boolean>> {
    const self = this.instance<T>()

    return self.get()
  }

  static $get<T extends Model<boolean, boolean>>(
    this: ThisClass<T>
  ): Promise<RModel<T, boolean>[]> {
    const self = this.instance<T>()

    return self.$get()
  }
}
