import { ModelData } from '../../../src/Model'
import BaseModel from './BaseModel'

export default class Comment extends BaseModel<false, false>() {
  public replies?: ModelData<Comment>[]

  relations() {
    return {
      replies: Comment
    }
  }
}
