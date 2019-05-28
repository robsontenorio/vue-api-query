import BaseModel from './BaseModel'
import Comment from './Comment'

export default class Post extends BaseModel {
  comments (args) {
    return this.hasMany(Comment, args)
  }
}
