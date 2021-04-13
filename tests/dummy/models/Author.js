import BaseModel from './BaseModel'

export default class Author extends BaseModel {
  resource() {
    return 'authors'
  }
}
