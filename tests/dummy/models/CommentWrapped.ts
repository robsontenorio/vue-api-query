import BaseModel from './BaseModel'

export default class Comment extends BaseModel<true, false>() {
  public replies?: { data: Comment[] }

  relations() {
    return {
      replies: Comment
    }
  }
}
