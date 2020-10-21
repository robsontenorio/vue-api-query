/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { QueryResponseModel } from '../../../src/types'
import BaseModel from './BaseModel'
import CommentWrapped from './CommentWrapped'
import TagEmbed from './TagEmbed'
import User from './User'

export default class Post extends BaseModel<false, false>() {
  public id?: number
  public someId?: string
  public text?: string
  public user?: QueryResponseModel<User>
  public relationships?: {
    tags: { data: QueryResponseModel<TagEmbed>[] }
  }

  comments() {
    return this.hasMany(CommentWrapped)
  }

  relations() {
    return {
      user: User,
      'relationships.tags': TagEmbed
    }
  }
}
