---
title: Relationship Operations
description: 'Relationship Operations.'
position: 8
category: API
---

## `attach`
- Arguments: `(payload)`
- Returns: `Model | { data: Model }`

Attach a model to the parent.

<code-group>
  <code-block Label="Request" active>

  ```js
  const model = await Model.find(1)
  model.nested().attach({ foo: bar })
  ```

  </code-block>
  <code-block Label="Query">

  ```http request
  POST /resource/1/nested
  ```

  </code-block>
</code-group>

## `sync`
- Arguments: `(payload)`
- Returns: `Model | { data: Model }`

Sync a model to the parent.

<code-group>
  <code-block Label="Request" active>

  ```js
  const model = await Model.find(1)
  model.nested().sync({ foo: bar })
  ```

  </code-block>
  <code-block Label="Query">

  ```http request
  PUT /resource/1/nested
  ```

  </code-block>
</code-group>

## `for`
- Arguments: `(...args)`
- Returns: `self`

Attach a model to the parent.

<code-group>
  <code-block Label="Simple Request" active>

  ```js
  const post = await Post.find(1)
  const comment = new Comment({
    text: 'New one for this post'
  }).for(post)

  await comment.save()
  ```

  </code-block>
  <code-block Label="Simple Query">

  ```http request
  POST /posts/1/comments
  ```

  </code-block>
  <code-block Label="Complex Request">

  ```js
  const user = new User({ id: 1 })
  const post = await user.posts().first()
  const comment = new Comment({
    text: 'for() takes multiple objects'
  }).for(user, post)

  await comment.save()
  ```

  </code-block>
  <code-block Label="Complex Query">

  ```http request
  POST /users/1/posts/1/comments
  ```

  </code-block>
</code-group>
