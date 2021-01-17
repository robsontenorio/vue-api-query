---
title: Query Builder Methods
description: 'Query Builder methods.'
position: 7
category: API
---

## `include`
- Arguments: `(...args)`
- Returns: `self`

Eager load relationships.

```js
await Model.include('user', 'category')
```

#### Array

<alert type="success">Available in version >= v1.8.0</alert>

```js
await Model.include(['user', 'category'])
```

<alert type="info">`with` is an alias of this method.</alert>

## `append`
- Arguments: `(...args)`
- Returns: `self`

Append attributes.

```js
await Model.append('likes', 'shares')
```

#### Array

<alert type="success">Available in version >= v1.8.0</alert>

```js
await Model.append(['likes', 'shares'])
```

## `select`
- Arguments: `(...fields)`
- Returns: `self`

Set the columns to be selected.

#### Single entity
```js
await Model.select(['title', 'content'])
```

#### Related entities
```js
await Post.select({
  posts: ['title', 'content'],
  user: ['age', 'firstName']
})
```

## `where`
- Arguments: `(field, value)`
- Returns: `self`

Add a basic where clause to the query.

```js
await Model.where('status', 'active')
```

#### Nested

<alert type="success">Available in version >= v1.8.0</alert>

```js
await Model.where(['user', 'status'], 'active')
```

## `whereIn`
- Arguments: `(field, array)`
- Returns: `self`

Add a "where in" clause to the query.

```js
await Model.whereIn('id', [1, 2, 3])
```

#### Nested

<alert type="success">Available in version >= v1.8.0</alert>

```js
await Model.whereIn(['user', 'id'], [1, 2, 3])
```

## `orderBy`
- Arguments: `(...args)`
- Returns: `self`

Add an "order by" clause to the query.

```js
await Model.orderBy('-created_at', 'category_id')  
```

#### Array

<alert type="success">Available in version >= v1.8.0</alert>

```js
await Model.orderBy(['-created_at', 'category_id'])  
```

## `page`
- Arguments: `(value)`
- Returns: `self`

Set the current page.

```js
await Model.page(1)
```

## `limit`
- Arguments: `(value)`
- Returns: `self`

Set the page limit.

```js
await Model.limit(20)
```

## `params`
- Arguments: `(payload)`
- Returns: `self`

Add custom parameters to the query.

<code-group>
  <code-block Label="Query" active>

  ```js
  await Model.params({
    foo: 'bar',
    baz: true
  })
  ```

  </code-block>
  <code-block Label="Request">

  ```http request
  GET /resource?foo=bar&baz=true
  ```

  </code-block>
</code-group>

## `custom`
- Arguments: `(...args)`
- Returns: `self`

Build custom endpoints.

<code-group>
  <code-block Label="Simple Query" active>

  ```js
  await Post.custom('posts/latest')
  ```

  </code-block>
  <code-block Label="Simple Request">

  ```http request
  GET /posts/latest
  ```

  </code-block>
  <code-block Label="Complex Query">

  ```js
  const user = new User({ id: 1 })
  const post = new Post()

  await Post.custom(user, post, 'latest')
  ```

  </code-block>
  <code-block Label="Complex Request">

  ```http request
  GET /users/1/posts/latest
  ```

  </code-block>
</code-group>

## `config`
<alert type="success">Available in version >= v1.8.0</alert>

- Arguments: `(config)`
- Returns: `self`

Configuration of HTTP Instance.

```js
await Model.config({
  method: 'PATCH',
  header: { /* ... */ },
  data: { foo: 'bar' }
}).save()
```

## `get`
- Returns: `Collection | { data: Collection }`

Execute the query and get all results.

```js
await Model.get()
```

<alert type="info">`all` is an alias of this method.</alert>

## `first`
- Returns: `Model | { data: Model }`

Execute the query and get the first result.

```js
await Model.first()
```

## `find`
- Arguments: `(identifier)`
- Returns: `Model | { data: Model }`

Find a model by its primary key.

```js
await Model.find(1)
```

## `$get`
- Returns: `Collection`

Execute the query and get all results.

```js
await Model.$get()
```

<alert type="info">These `$`-prefixed convenience methods always return the requested content.
They handle and unwrap responses within "data".</alert>

<alert type="info">`$all` is an alias of this method.</alert>

## `$first`
- Returns: `Model`

Execute the query and get the first result.

```js
await Model.$first()
```

<alert type="info">These `$`-prefixed convenience methods always return the requested content. 
They handle and unwrap responses within "data".</alert>

## `$find`
- Arguments: `(identifier)`
- Returns: `Model`

Find a model by its primary key.

```js
await Model.$find(1)
```

<alert type="info">These `$`-prefixed convenience methods always return the requested content. 
They handle and unwrap responses within "data".</alert>
