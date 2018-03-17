import axios from 'axios'
import Builder from './Builder';


export default class Model {

  static get () {
    return new Builder(this).get()
  }

  static find (id) {
    return new Builder(this).find(id)
  }

  static with (...args) {
    return new Builder(this).with(args)
  }

  static where (field, value) {
    return new Builder(this).where(field, value)
  }

  static whereIn (field, array) {
    return new Builder(this).whereIn(field, array)
  }

  static orderBy (...args) {
    return new Builder(this).orderBy(args)
  }

  endpoint () {
    if (this.id === undefined || this.id === 0 || this.id === '') {
      return `${this.baseURL()}/${this.resource()}`
    } else {
      return `${this.baseURL()}/${this.resource()}/${this.id}`

    }
  }

  save () {
    if (this.id === undefined || this.id === 0 || this.id === '') {
      return this.create()
    } else {
      return this.update()
    }
  }

  create () {
    return axios.post(this.endpoint(), this).then(response => {
      let self = Object.assign(this, response.data)
      return self
    })
  }

  update () {
    return axios.put(this.endpoint(), this).then(response => {
      let self = Object.assign(this, response.data)
      return self
    })
  }
}