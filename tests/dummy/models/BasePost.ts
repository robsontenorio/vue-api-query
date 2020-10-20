import { ModelData } from '../../../src/Model'
import BaseModel from './BaseModel'
import Comment from './Comment'
import User from './User'

export default function BasePost<
  isWrappedCollection extends boolean = false,
  isWrappedModel extends boolean = false
>() {
  return class BasePost extends BaseModel<
    isWrappedCollection,
    isWrappedModel
  >() {
    public id?: number
    public someId?: string
    public text?: string
    public user?: ModelData<User>

    constructor(...attributes: unknown[]) {
      super(...attributes)
    }

    comments() {
      return this.hasMany(Comment)
    }

    relations() {
      return {
        user: User
      }
    }
  }
}
