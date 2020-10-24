/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { QueryResponseCollection, QueryResponseModel } from '../../../src'
import BaseModel from './BaseModel'
import Comment from './Comment'
import TagEmbed from './TagEmbed'
import User from './User'

export default class Post extends BaseModel<true, false> {
  public id?: number
  public someId?: string
  public text?: string
  public user?: QueryResponseModel<User>
  public relationships?: {
    tags: QueryResponseCollection<TagEmbed, true>
  }

  comments() {
    return this.hasMany(Comment)
  }

  relations() {
    return {
      user: User,
      'relationships.tags': TagEmbed
    }
  }
}
