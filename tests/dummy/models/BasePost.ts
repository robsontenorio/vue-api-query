import BaseModel from './BaseModel'
import Comment from './Comment'
import User from './User'

export default function BasePost<
  isWrappedCollection extends boolean,
  isWrappedModel extends boolean
>() {
  return class BasePost extends BaseModel<
    isWrappedCollection,
    isWrappedModel
  >() {
    public user?: User

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
