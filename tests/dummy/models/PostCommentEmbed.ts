import { ModelData } from '../../../src/Model'
import BaseModel from './BaseModel'
import CommentWrapped from './CommentWrapped'
import TagEmbed from './TagEmbed'
import User from './User'

export default class Post extends BaseModel<false, false>() {
  public id?: number
  public someId?: string
  public text?: string
  public user?: ModelData<User>
  public relationships?: {
    tags: { data: ModelData<TagEmbed>[] }
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
