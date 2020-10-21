import type { ModelData } from '../../../src'
import BaseModel from './BaseModel'

export default class Comment extends BaseModel<false, false>() {
  public id?: number
  public post_id?: number
  public someId?: string
  public text?: string
  public replies?: ModelData<Comment>[]

  relations() {
    return {
      replies: Comment
    }
  }
}
