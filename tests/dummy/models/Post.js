import BaseModel from './BaseModel'
import Comment from './Comment'
import User from './User'
import Tag from './Tag'

export default class Post extends BaseModel {
  comments () {
    return this.hasMany(Comment)
  }

  relations () {
    return {
      user: User,
      'relationships.tags': Tag
    }
  }
}
