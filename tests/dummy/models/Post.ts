import BaseModel from './BaseModel'
import Comment from './Comment'
import User from './User'

export default class Post extends BaseModel<false, false>() {
  public user?: User

  comments() {
    return this.hasMany(Comment)
  }

  relations() {
    return {
      user: User
    }
  }
}
