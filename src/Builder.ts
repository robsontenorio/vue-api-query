/**
 * Prepare attributes to be parsed
 */

import Model from './Model'
import Parser from './Parser'

export default class Builder {
  public model: Model<boolean, boolean>
  public includes: unknown[]
  public appends: unknown[]
  public sorts: unknown[]
  public pageValue: number | null
  public limitValue: number | null
  public payload: Record<string, unknown> | null
  public fields: Record<string, unknown>
  public filters: Record<string, unknown>
  public parser: Parser

  constructor(model: Model<boolean, boolean>) {
    this.model = model
    this.includes = []
    this.appends = []
    this.sorts = []
    this.pageValue = null
    this.limitValue = null
    this.payload = null

    this.fields = {}
    this.filters = {}

    this.parser = new Parser(this)
  }

  // query string parsed
  query(): string {
    return this.parser.query()
  }

  /**
   * Query builder
   */

  include(...args: unknown[]): this {
    this.includes = args

    return this
  }

  append(...args: unknown[]): this {
    this.appends = args

    return this
  }

  select(...fields: (string | { [p: string]: string[] })[]): this {
    if (fields.length === 0) {
      throw new Error('You must specify the fields on select() method.')
    }

    // single entity .select(['age', 'firstname'])
    if (typeof fields[0] === 'string' || Array.isArray(fields[0])) {
      this.fields[this.model.resource()] = fields.join(',')
    }

    // related entities .select({ posts: ['title', 'content'], user: ['age', 'firstname']} )
    if (typeof fields[0] === 'object') {
      Object.entries(fields[0]).forEach(([key, value]) => {
        this.fields[key] = value.join(',')
      })
    }

    return this
  }

  where(key: string, value: unknown): this {
    if (key === undefined || value === undefined)
      throw new Error('The KEY and VALUE are required on where() method.')

    if (Array.isArray(value) || value instanceof Object)
      throw new Error('The VALUE must be primitive on where() method.')

    this.filters[key] = value

    return this
  }

  whereIn(key: string, array: unknown[]): this {
    if (!Array.isArray(array))
      throw new Error(
        'The second argument on whereIn() method must be an array.'
      )

    this.filters[key] = array.join(',')

    return this
  }

  orderBy(...args: unknown[]): this {
    this.sorts = args

    return this
  }

  page(value: number): this {
    if (!Number.isInteger(value)) {
      throw new Error('The VALUE must be an integer on page() method.')
    }

    this.pageValue = value

    return this
  }

  limit(value: number): this {
    if (!Number.isInteger(value)) {
      throw new Error('The VALUE must be an integer on limit() method.')
    }

    this.limitValue = value

    return this
  }

  params(payload: Record<string, unknown>): this {
    if (payload === undefined || payload.constructor !== Object) {
      throw new Error('You must pass a payload/object as param.')
    }

    this.payload = payload

    return this
  }
}
