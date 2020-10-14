import BaseModel from './BaseModel'

export default class Comment extends BaseModel<false, false> {
  relations() {
    return {
      replies: Comment
    }
  }
}
