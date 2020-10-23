/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { QueryResponseModel } from '../../../src/types'
import BaseModel from './BaseModel'

export default class Comment extends BaseModel<false, false> {
  public id?: number
  public post_id?: number
  public someId?: string
  public text?: string
  public replies?: QueryResponseModel<Comment>[]

  relations() {
    return {
      replies: Comment
    }
  }
}
