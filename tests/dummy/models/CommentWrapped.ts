import { ModelData } from '../../../src/Model'
import BaseModel from './BaseModel'

export default class Comment extends BaseModel<true, false>() {
  public replies?: { data: ModelData<Comment>[] }

  relations() {
    return {
      replies: Comment
    }
  }
}
