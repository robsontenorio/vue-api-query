import qs from 'qs'

export default class Parser {

  constructor(builder) {
    this.builder = builder
    this.uri = ''
  }

  query () {
    this.includes()
    this.filters()
    this.sorts()

    return this.uri
  }

  hasFilters () {
    return Object.keys(this.builder.filters.filter).length > 0
  }

  hasIncludes () {
    return this.builder.includes.length > 0
  }

  hasSorts () {
    return this.builder.sorts.length > 0
  }

  prepend () {
    return (this.uri === '') ? '?' : '&'
  }

  includes () {
    if (!this.hasIncludes()) {
      return ''
    }

    this.uri = this.prepend() + 'include=' + this.builder.includes
  }

  sorts () {
    if (!this.hasSorts()) {
      return ''
    }

    this.uri = this.prepend() + 'sort=' + this.builder.sorts
  }

  filters () {
    if (!this.hasFilters()) {
      return ''
    }

    this.uri = this.prepend() + qs.stringify(this.builder.filters)
  }
}