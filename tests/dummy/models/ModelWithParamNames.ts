import BaseModel from './BaseModel'

export default class ModelWithParamNames extends BaseModel {
  parameterNames() {
    return {
      include: 'include_custom',
      filter: 'filter_custom',
      sort: 'sort_custom',
      fields: 'fields_custom',
      append: 'append_custom',
      page: 'page_custom',
      limit: 'limit_custom',
    }
  }
}
