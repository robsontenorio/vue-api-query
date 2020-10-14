import BaseModel from './BaseModel'

export default class Comment extends BaseModel<true, false>() {
  relations() {
    return {
      replies: Comment
    }
  }
}
