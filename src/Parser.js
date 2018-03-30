import qs from 'qs'

export default class Parser {

  constructor(builder) {
    this.builder = builder
    this.uri = ''
  }

  query () {
    this.includes()
    this.filters()
    this.appends()
    this.sorts()
    this.page()
    this.limit()

    return this.uri
  }

  hasFilters () {
    return Object.keys(this.builder.filters.filter).length > 0
  }

  hasIncludes () {
    return this.builder.includes.length > 0
  }

  hasAppends () {
    return this.builder.appends.length > 0
  }

  hasPage () {
    return this.builder.pageValue !== null
  }

  hasLimit () {
    return this.builder.limitValue !== null
  }

  hasSorts () {
    return this.builder.sorts.length > 0
  }

  prepend () {
    return (this.uri === '') ? '?' : '&'
  }

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

  sorts () {
    if (!this.hasSorts()) {
      return
    }

    this.uri += this.prepend() + 'sort=' + this.builder.sorts
  }

  filters () {
    if (!this.hasFilters()) {
      return
    }

    this.uri += this.prepend() + qs.stringify(this.builder.filters)
  }
}