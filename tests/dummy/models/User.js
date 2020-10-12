import BaseModel from './BaseModel'
import Post from './Post'

export default class User extends BaseModel {

  get fullname () {
    return `${this.firstname} ${this.lastname}`
  }

  posts () {
    return this.hasMany(Post)
  }
}
