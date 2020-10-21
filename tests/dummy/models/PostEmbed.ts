/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { ModelData } from '../../../src'
import BaseModel from './BaseModel'
import Comment from './Comment'
import Tag from './Tag'
import User from './User'

export default class Post extends BaseModel<false, true>() {
  public id?: number
  public someId?: string
  public text?: string
  public user?: ModelData<User>
  public relationships?: {
    tags: ModelData<Tag>[]
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
