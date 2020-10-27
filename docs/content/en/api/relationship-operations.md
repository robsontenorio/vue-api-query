---
title: Relationship Operations
description: 'Relationship Operations.'
position: 9
category: API
---

## `for`
- Arguments: `(...args)`
- Returns: `self`

Create a new related model.

<code-group>
  <code-block Label="Simple Query" active>

  ```js
  const post = await Post.find(1)
  const comment = new Comment({
    text: 'New comment for this post!'
  }).for(post)

  await comment.save()
  ```

  </code-block>
  <code-block Label="Simple Request">

  ```http request
  POST /posts/1/comments
  ```

  </code-block>
  <code-block Label="Complex Query">

  ```js
  const user = new User({ id: 1 })
  const post = await user.posts().first()
  const comment = new Comment({
    text: 'New comment for this post!'
  }).for(user, post)

  await comment.save()
  ```

  </code-block>
  <code-block Label="Complex Request">

  ```http request
  POST /users/1/posts/1/comments
  ```

  </code-block>
</code-group>


## `attach`
- Arguments: `(payload)`
- Returns: `Model | { data: Model }`

Another way to create a new related model.

<code-group>
  <code-block Label="Query" active>

  ```js
  const post = await Post.find(1)
  const comment = post.comments().attach({
    text: 'New comment for this post!'
  })
  ```

  </code-block>
  <code-block Label="Request">

  ```http request
  POST /posts/1/comments
  ```

  </code-block>
</code-group>

## `sync`
- Arguments: `(payload)`
- Returns: `Model | { data: Model }`

Update a related model.

<code-group>
  <code-block Label="Query" active>

  ```js
  const post = await Post.find(1)
  const comment = await post.comments().sync({
    text: 'Updated comment!'
  })
  ```

  </code-block>
  <code-block Label="Request">

  ```http request
  PUT /posts/1/comments
  ```

  </code-block>
</code-group>
