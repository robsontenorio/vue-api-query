/**
 * Parse attributes from Builder into query string
 */

import qs from 'qs'

export default class Parser {

  constructor(builder) {
    this.builder = builder
    this.uri = ''
  }

  // final query string
  query () {
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

  /**
   * Helpers
   */

  hasIncludes () {
    return this.builder.includes.length > 0
  }

  hasAppends () {
    return this.builder.appends.length > 0
  }

  hasFields () {
    return Object.keys(this.builder.fields).length > 0
  }

  hasFilters () {
    return Object.keys(this.builder.filters).length > 0
  }

  hasSorts () {
    return this.builder.sorts.length > 0
  }

  hasPage () {
    return this.builder.pageValue !== null
  }

  hasLimit () {
    return this.builder.limitValue !== null
  }

  hasPayload () {
    return this.builder.payload !== null
  }

  prepend () {
    return (this.uri === '') ? '?' : '&'
  }

  parameterNames () {
    return this.builder.model.parameterNames()
  }

  /**
   * Parsers
   */

  includes () {
    if (!this.hasIncludes()) {
      return
    }

    this.uri += this.prepend() + this.parameterNames().include + '=' + this.builder.includes
  }

  appends () {
    if (!this.hasAppends()) {
      return
    }

    this.uri += this.prepend() + this.parameterNames().append + '=' + this.builder.appends
  }

  fields () {
    if (!this.hasFields()) {
      return
    }

    let fields = { [this.parameterNames().fields]: this.builder.fields }
    this.uri += this.prepend() + qs.stringify(fields, { encode: false })
  }

  filters () {
    if (!this.hasFilters()) {
      return
    }

    let filters = { [this.parameterNames().filter]: this.builder.filters }
    this.uri += this.prepend() + qs.stringify(filters, { encode: false })
  }

  sorts () {
    if (!this.hasSorts()) {
      return
    }

    this.uri += this.prepend() + this.parameterNames().sort + '=' + this.builder.sorts
  }

  page () {
    if (!this.hasPage()) {
      return
    }

    this.uri += this.prepend() + this.parameterNames().page + '=' + this.builder.pageValue
  }

  limit () {
    if (!this.hasLimit()) {
      return
    }

    this.uri += this.prepend() + this.parameterNames().limit + '=' + this.builder.limitValue
  }

  payload () {
    if (!this.hasPayload()) {
      return
    }

    this.uri += this.prepend() + qs.stringify(this.builder.payload, { encode: false })
  }
}
