---
title: Query Methods
description: 'Query methods.'
position: 2
category: API
---

## `include`
- Arguments: `(...args)`
- Returns: `self`

```js
await Model.include('user', 'category')
```

## `append`
- Arguments: `(...args)`
- Returns: `self`

```js
await Model.include('likes')
```

## `select`
- Arguments: `(...fields)`
- Returns: `self`

Single entity:
```js
await Model.select(['title', 'content'])
```

Related entities:
```js
await Model.select({
  posts: ['title', 'content'],
  user: ['age', 'firstName']
})
```

## `where`
- Arguments: `(field, value)`
- Returns: `self`

```js
await Model.where('status', 'active')
```

## `whereIn`
- Arguments: `(field, array)`
- Returns: `self`

```js
await Model.whereIn('id', [1, 2, 3])
```

## `orderBy`
- Arguments: `(...args)`
- Returns: `self`

```js
await Model.orderBy('-created_at', 'category_id')  
```

## `page`
- Arguments: `(value)`
- Returns: `self`

```js
await Model.page(1)
```

## `limit`
- Arguments: `(value)`
- Returns: `self`

```js
await Model.limit(20)
```

## `params`
- Arguments: `(payload)`
- Returns: `self`

<code-group>
  <code-block Label="Request" active>

  ```js
  await Model.params({
    foo: 'bar',
    baz: true
  })
  ```

  </code-block>
  <code-block Label="Query">

  ```http request
  GET /resource?foo=bar&baz=true
  ```

  </code-block>
</code-group>

## `custom`
- Arguments: `(...args)`
- Returns: `self`

<code-group>
  <code-block Label="Simple Request" active>

  ```js
  await Model.custom('resource/latest')
  ```

  </code-block>
  <code-block Label="Simple Query">

  ```http request
  GET /resource/latest
  ```

  </code-block>
  <code-block Label="Complex Request">

  ```js
  const user = new User({ id: 1 })
  const post = new Post()

  await Post.custom(user, post, 'latest')
  ```

  </code-block>
  <code-block Label="Complex Query">

  ```http request
  GET /users/1/posts/latest
  ```

  </code-block>
</code-group>
