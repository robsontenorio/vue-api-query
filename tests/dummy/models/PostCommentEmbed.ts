import BasePost from './BasePost'
import CommentWrapped from './CommentWrapped'

export default class Post extends BasePost<false, false>() {
  comments() {
    return this.hasMany(CommentWrapped)
  }
}
