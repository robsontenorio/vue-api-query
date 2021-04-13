import Author from './Author'
import BaseModel from './BaseModel'
import Comment from './Comment'

export default class Article extends BaseModel {
  resource() {
    return 'articles'
  }

  relations() {
    return {
      author: Author,
      comments: Comment
    }
  }
}
