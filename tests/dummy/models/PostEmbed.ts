import BasePost from './BasePost'
import Comment from './Comment'

export default class Post extends BasePost<false, true>() {
  comments() {
    return this.hasMany(Comment)
  }
}
