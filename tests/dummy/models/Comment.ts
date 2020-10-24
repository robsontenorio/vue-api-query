/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { QueryResponseCollection } from '../../../src'
import BaseModel from './BaseModel'

export default class Comment extends BaseModel<false, false> {
  public id?: number
  public post_id?: number
  public someId?: string
  public text?: string
  public replies?: QueryResponseCollection<Comment>

  relations() {
    return {
      replies: Comment
    }
  }
}
