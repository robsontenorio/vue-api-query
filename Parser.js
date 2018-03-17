import qs from 'qs'

export default class Parser {

  constructor(builder) {
    this.builder = builder
  }

  uri () {
    let includes = this.includes()
    let filters = this.filters()
    let sorts = this.sorts()

    return `${includes}${filters}${sorts}`
  }

  prepend () {
    return (this.builder.includes.length) ? '&' : '?'
  }

  includes () {
    if (this.builder.includes.length === 0) {
      return ''
    }

    return '?include=' + this.builder.includes
  }

  sorts () {
    if (this.builder.sorts.length === 0) {
      return ''
    }

    return this.prepend() + 'sort=' + this.builder.sorts
  }

  filters () {
    if (Object.keys(this.builder.filters.filter).length === 0) {
      return ''
    }

    return this.prepend() + qs.stringify(this.builder.filters)
  }
}