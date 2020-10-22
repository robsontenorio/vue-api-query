---
title: Model Options
description: 'Model Options.'
position: 5
category: API
---

## Global Options

It's recommended to define the global options in your [Base Model](/configuration#creating-a-base-model), 
in order to abstract configuration from your models.

### `$http`
- Returns: `HTTP Client Instance`

Instance of the HTTP client which is used to make requests.

See [Installation](/installation)

### `baseURL`
- Returns: `string`

Base URL which is used and prepended to make requests.

See [Configuration](/configuration#creating-a-base-model)

```js
baseURL() {
  return 'http://my-api.com'
}
```

### `request`
- Arguments: `(config)`
- Returns: `HTTP Client Request`

Request method which is used to make requests.

See [Configuration](/configuration#creating-a-base-model)

```js
request(config) {
  return this.$http.request(config)
}
```

### `parameterNames`
- Returns: `object`

This method can be overridden in the model to customize the name of the query parameters.

See [Configuration](/configuration#customizing-query-parameters)

```js
parameterNames() {
  return {
    include: 'include',
    filter: 'filter',
    sort: 'sort',
    fields: 'fields',
    append: 'append',
    page: 'page',
    limit: 'limit'
  }
}
```

#### `include`
- Default: `include`
- Returns: `string`

#### `filter`
- Default: `filter`
- Returns: `string`

#### `sort`
- Default: `sort`
- Returns: `string`

#### `fields`
- Default: `fields`
- Returns: `string`

#### `append`
- Default: `append`
- Returns: `string`

#### `page`
- Default: `page`
- Returns: `string`

#### `limit`
- Default: `limit`
- Returns: `string`

## Model Options

These are model-related options.

### `resource`
- Returns: `string`

Resource route of the model which is used to build the query.

See [Configuration](/configuration#creating-the-domain-models)

```js
resource() {
  return 'resource'
}
```

### `primaryKey`
- Default: `id`
- Returns: `string`

Primary key of the model which is used to build the query.

See [Configuration](/configuration#changing-the-primary-key)

```js
primaryKey() {
  return 'id'
}
```

### `relations`
- Returns: `object`

This method can be implemented in the model to apply model instances to eager loaded relationships.

It must return an object, which the key is the property of the relationship, and the value is the
model instance.

See [Configuration](/configuration#eager-loaded-relationships)

```js
relations() {
  return {
    relationKey: RelationModel
  }
}
```

### `hasMany`
- Arguments: `(model)`
- Returns: `Model`

This method can be used to lazy load relationships of a model and apply model instances to them.

It must receive a model instance as argument.

See [Configuration](/configuration#lazy-loading-relationships)

```js
customMethod() {
  return this.hasMany(RelationModel)
}
```
