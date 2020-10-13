/**
 * Parse attributes from Builder into query string
 */

import qs from 'qs'

import Builder from './Builder'

export default class Parser {
  private builder: Builder
  private uri: string

  constructor(builder: Builder) {
    this.builder = builder
    this.uri = ''
  }

  // final query string
  query(): string {
    this.reset()
    this.includes()
    this.appends()
    this.fields()
    this.filters()
    this.sorts()
    this.page()
    this.limit()
    this.payload()

    return this.uri
  }

  reset(): void {
    this.uri = ''
  }

  /**
   * Helpers
   */

  hasIncludes(): boolean {
    return this.builder.includes.length > 0
  }

  hasAppends(): boolean {
    return this.builder.appends.length > 0
  }

  hasFields(): boolean {
    return Object.keys(this.builder.fields).length > 0
  }

  hasFilters(): boolean {
    return Object.keys(this.builder.filters).length > 0
  }

  hasSorts(): boolean {
    return this.builder.sorts.length > 0
  }

  hasPage(): boolean {
    return this.builder.pageValue !== null
  }

  hasLimit(): boolean {
    return this.builder.limitValue !== null
  }

  hasPayload(): boolean {
    return this.builder.payload !== null
  }

  prepend(): string {
    return this.uri === '' ? '?' : '&'
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
    return this.builder.model.parameterNames()
  }

  /**
   * Parsers
   */

  includes(): void {
    if (!this.hasIncludes()) {
      return
    }

    this.uri +=
      this.prepend() +
      this.parameterNames().include +
      '=' +
      this.builder.includes
  }

  appends(): void {
    if (!this.hasAppends()) {
      return
    }

    this.uri +=
      this.prepend() + this.parameterNames().append + '=' + this.builder.appends
  }

  fields(): void {
    if (!this.hasFields()) {
      return
    }

    const fields = { [this.parameterNames().fields]: this.builder.fields }
    this.uri += this.prepend() + qs.stringify(fields, { encode: false })
  }

  filters(): void {
    if (!this.hasFilters()) {
      return
    }

    const filters = { [this.parameterNames().filter]: this.builder.filters }
    this.uri += this.prepend() + qs.stringify(filters, { encode: false })
  }

  sorts(): void {
    if (!this.hasSorts()) {
      return
    }

    this.uri +=
      this.prepend() + this.parameterNames().sort + '=' + this.builder.sorts
  }

  page(): void {
    if (!this.hasPage()) {
      return
    }

    this.uri +=
      this.prepend() + this.parameterNames().page + '=' + this.builder.pageValue
  }

  limit(): void {
    if (!this.hasLimit()) {
      return
    }

    this.uri +=
      this.prepend() +
      this.parameterNames().limit +
      '=' +
      this.builder.limitValue
  }

  payload(): void {
    if (!this.hasPayload()) {
      return
    }

    this.uri +=
      this.prepend() + qs.stringify(this.builder.payload, { encode: false })
  }
}
