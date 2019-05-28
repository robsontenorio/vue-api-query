import BaseModel from './BaseModel'
import Post from './Post'

export default class User extends BaseModel {

  posts (args) {
    return this.hasMany(Post, args)
  }
}
