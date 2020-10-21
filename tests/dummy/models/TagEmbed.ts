import BaseModel from './BaseModel'

export default class Tag extends BaseModel<true, false>() {
  public name?: string
}
