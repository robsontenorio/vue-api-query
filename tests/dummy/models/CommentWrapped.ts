/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { QueryResponseCollection } from '../../../src/types'
import BaseModel from './BaseModel'

export default class Comment extends BaseModel<true, false> {
  public replies?: QueryResponseCollection<Comment, true>

  relations() {
    return {
      replies: Comment
    }
  }
}
