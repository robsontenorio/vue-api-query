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
    return Object.keys(this.builder.fields.fields).length > 0
  }

  hasFilters () {
    return Object.keys(this.builder.filters.filter).length > 0
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

  prepend () {
    return (this.uri === '') ? '?' : '&'
  }

  /**
   * Parsers
   */

  includes () {
    if (!this.hasIncludes()) {
      return
    }

    this.uri += this.prepend() + 'include=' + this.builder.includes
  }

  appends () {
    if (!this.hasAppends()) {
      return
    }

    this.uri += this.prepend() + 'append=' + this.builder.appends
  }

  fields () {
    if (!this.hasFields()) {
      return
    }

    this.uri += this.prepend() + qs.stringify(this.builder.fields, { encode: false })
  }

  filters () {
    if (!this.hasFilters()) {
      return
    }

    this.uri += this.prepend() + qs.stringify(this.builder.filters, { encode: false })
  }

  sorts () {
    if (!this.hasSorts()) {
      return
    }

    this.uri += this.prepend() + 'sort=' + this.builder.sorts
  }

  page () {
    if (!this.hasPage()) {
      return
    }

    this.uri += this.prepend() + 'page=' + this.builder.pageValue
  }

  limit () {
    if (!this.hasLimit()) {
      return
    }

    this.uri += this.prepend() + 'limit=' + this.builder.limitValue
  }
}
