---
title: Usage
description: 'How to use this package.'
position: 4
category: Getting Started
---

Give me the result for a given criteria, include some entities, append extra fields and order the result!

<code-group>
  <code-block label="Request" active>

  ```js
  let posts = await Post
    .where('status', 'ACTIVE')
    .include('user', 'category')
    .append('likes')
    .orderBy('-created_at', 'category_id')  
    .get()
  ```

  </code-block>
  <code-block label="Response">

  ```js
  [
    {
      id: 1,
      title: 'Post 1',
      text: 'Some text here...',
      user: {
        id: 1,
        firstName: 'Joe',
        lastName: 'Doe'
      },
      category: {
        name: 'Awesome'
      },
      status: 'ACTIVE',
      likes: 10,
    },
    {
      id: 2,
      title: 'Post 2',
      text: 'Some text here...',
      user: {
        id: 2,
        firstName: 'John',
        lastName: 'Doe'
      },
      category: {
        name: 'Amazing'
      },
      status: 'ACTIVE',
      likes: 5,
    } 
  ]
  ```

  </code-block>
  <code-block label="Query">

  ```
  GET /posts?filter[status]=ACTIVE&include=user,category&append=likes&orderBy=-created_at,category_id
  ```

  </code-block>
</code-group>

Just give me the first occurrence from response:

<code-group>
  <code-block Label="Request" active>

  ```js
  let post = await Post
    .where('status', 'ACTIVE')
    .first()
  ```

  </code-block>
  <code-block Label="Response">

  ```js
  {
    id: 1,
    title: 'Post 1',
    text: 'Some text here...',
    status: 'ACTIVE'
  }
  ```

  </code-block>
  <code-block Label="Query">

  ```
  GET /posts?filter[status]=ACTIVE
  ```

  </code-block>
</code-group>

Nice! Now I want a specific object:

<code-group>
  <code-block Label="Request" active>

  ```js
  let post = await Post.find(1)
  ```

  </code-block>
  <code-block Label="Response">

  ```js
  {
    id: 1,
    title: 'Post 1',
    text: 'Some text here...'
  }
  ```

  </code-block>
  <code-block Label="Query">

  ```
  GET /posts/1
  ```

  </code-block>
</code-group>

Edit this and send it back:

<code-group>
  <code-block Label="Request" active>

  ```js
  post.title = 'Awsome!'
  post.save()
  ```

  </code-block>
  <code-block Label="Response">

  ```js
  {
    id: 1,
    title: 'Awsome!',
    text: 'Some text here...'
  }
  ```

  </code-block>
  <code-block Label="Query">

  ```
  PUT /posts/1
  ```

  </code-block>
</code-group>

Ops, delete it!

<code-group>
  <code-block Label="Request" active>

  ```js
  post.delete()
  ```

  </code-block>
  <code-block Label="Query">

  ```
  DELETE /posts/1
  ```

  </code-block>
</code-group>

Let's create a new object and post it:

<code-group>
  <code-block Label="Request" active>

  ```js
  let post = new Post({title: 'Cool!'})
  
  // OR
  
  let post = new Post({})
  post.title = 'Another one'

  post.save()
  ```

  </code-block>
  <code-block Label="Response">

  ```js
  {
    id: 3,
    title: 'Cool!',
    text: 'Some text here...'
  }
  ```

  </code-block>
  <code-block Label="Query">

  ```
  POST /post
  ```

  </code-block>
</code-group>

We can use relationships:

<code-group>
  <code-block Label="Request" active>

  ```js
  let user = await User.find(1)

  let posts = await user
    .posts()
    .get()
  ```

  </code-block>
  <code-block Label="User Response">

  ```js
  {
    id: 1,
    firstName: 'Joe',
    lastName: 'Doe'
  }
  ```

  </code-block>
  <code-block Label="Posts Response">

  ```js
  [
    {
      id: 1,
      title: 'Post 1',
      text: 'Some text here...'
    },
    {
      id: 3,
      title: 'Post 3',
      text: 'Some text here...'
    } 
  ]
  ```

  </code-block>
  <code-block Label="Query">

  ```
  GET /users/1

  GET /users/1/posts
  ```

  </code-block>
</code-group>
