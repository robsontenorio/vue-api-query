import BaseModel from './BaseModel'
import Post from './Post'

export default class User extends BaseModel {

  posts () {
    return this.hasMany(Post)
  }
}