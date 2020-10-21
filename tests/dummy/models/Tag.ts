import BaseModel from './BaseModel'

export default class Tag extends BaseModel<false, false>() {
  public name?: string
}
