import BaseModel from './BaseModel'

export default class Comment extends BaseModel {
  relations () {
    return {
      replies: Comment
    }
  }
}
