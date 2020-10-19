---
title: Options
description: 'Options.'
position: 5
category: API
---

## `$http`
- Returns: `Axios Instance`

See [Installation](/installation)

## `baseURL`
- Returns: `string`

Define a base url for a REST API.

See [Configuration](/configuration)

```js
baseURL() {
  return 'http://my-api.com'
}
```

## `request`
- Arguments: `(config)`
- Returns: `Axios Request`

Implement a default request method.

See [Configuration](/configuration)

```js
request(config) {
  return this.$http.request(config)
}
```

## `parameterNames`
- Returns: `object`

Configure the parameter names.

See [Configuration](/configuration)

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

### `include`
- Default: `include`
- Returns: `string`

### `filter`
- Default: `filter`
- Returns: `string`

### `sort`
- Default: `sort`
- Returns: `string`

### `fields`
- Default: `fields`
- Returns: `string`

### `append`
- Default: `append`
- Returns: `string`

### `page`
- Default: `page`
- Returns: `string`

### `limit`
- Default: `limit`
- Returns: `string`

## `resource`
- Returns: `string`

Set the resource route of the model.

See [Configuration](/configuration#define-your-domain-models)

```js
resource() {
  return 'resource'
}
```

## `primaryKey`
- Returns: `string`

Set the default primary key.

See [Configuration](/configuration#define-your-domain-models)

```js
primaryKey() {
  return 'id'
}
```

## `relations`
- Returns: `string`

Configure the model relations.

```js
relations() {
  return {
    nested: Model
  }
}
```
