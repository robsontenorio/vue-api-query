import BaseModel from './BaseModel'
import Comment from './Comment'

export default class Post extends BaseModel {
  comments () {
    return this.hasMany(Comment)
  }
}