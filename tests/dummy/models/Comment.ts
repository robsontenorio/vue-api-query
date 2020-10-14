import BaseModel from './BaseModel'

export default class Comment extends BaseModel<false, false>() {
  public replies?: Comment[]

  relations() {
    return {
      replies: Comment
    }
  }
}
