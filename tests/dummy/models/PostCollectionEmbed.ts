import { ModelData } from '../../../src/Model'
import BaseModel from './BaseModel'
import Comment from './Comment'
import TagEmbed from './TagEmbed'
import User from './User'

export default class Post extends BaseModel<true, false>() {
  public id?: number
  public someId?: string
  public text?: string
  public user?: ModelData<User>
  public relationships?: {
    tags: { data: ModelData<TagEmbed>[] }
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
