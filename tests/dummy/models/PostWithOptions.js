import BaseModel from './BaseModel'
import Comment from './Comment'
import Tag from './Tag'
import User from './User'

export default class PostWithOptions extends BaseModel {
  comments() {
    return this.hasMany(Comment)
  }

  relations() {
    return {
      user: User,
      'relationships.tags': Tag
    }
  }

  parserOptions() {
    return {
      arrayFormat: 'indices'
    }
  }
}
