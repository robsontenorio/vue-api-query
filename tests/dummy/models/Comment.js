import BaseModel from './BaseModel'

export default class Comment extends BaseModel {
  resource() {
    return 'comments'
  }

  relations() {
    return {
      replies: Comment
    }
  }
}
