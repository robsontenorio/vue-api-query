/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { QueryResponseModel } from '../../../src/types'
import BaseModel from './BaseModel'
import Comment from './Comment'
import Tag from './Tag'
import User from './User'

export default class Post extends BaseModel<false, false>() {
  public id?: number
  public someId?: string
  public text?: string
  public user?: QueryResponseModel<User>
  public relationships?: {
    tags: QueryResponseModel<Tag>[]
  }

  comments() {
    return this.hasMany(Comment)
  }

  relations() {
    return {
      user: User,
      'relationships.tags': Tag
    }
  }
}
