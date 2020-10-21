import BasePost from './BasePost'
import Comment from './Comment'

export default class Post extends BasePost<true, false>() {
  comments() {
    return this.hasMany(Comment)
  }
}
