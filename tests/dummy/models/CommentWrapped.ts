/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { QueryResponseModel } from '../../../src/types'
import BaseModel from './BaseModel'

export default class Comment extends BaseModel<true, false> {
  public replies?: { data: QueryResponseModel<Comment>[] }

  relations() {
    return {
      replies: Comment
    }
  }
}
