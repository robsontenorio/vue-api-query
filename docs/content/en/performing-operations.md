---
title: Performing CRUD and Relationship Operations
menuTitle: Performing Operations
description: 'How to create, update and delete models.'
position: 5
category: Getting Started
---

Ok, we already know how to build a query, so now it's time to perform operations!

## CRUD
See the [API reference](/api/crud-operations) for a list of available operation methods.

Let's start performing CRUD operations.

There are two CRUD operation methods:

- `save` - Create and update models.
- `delete` - Delete a model.

### Saving a Model

See the [API reference](/api/crud-operations#save).

We can create and update models using the `save` method. If the model doesn't have an ID, 
the model will be created, otherwise it will be updated.

We can create a new **Post**:

<code-group>
  <code-block Label="Query 1" active>

  ```js
  const post = new Post({
    title: 'My Super Post!',
    text: 'Some text here... yay!'
  })

  await post.save()
  ```

  </code-block>
  <code-block Label="Query 2">

  ```js
  const post = new Post()

  post.title = 'My Super Post!'
  post.text = 'Some text here... yay!'
  
  await post.save()
  ```

  </code-block>
  <code-block Label="Request">

  ```http request
  POST /posts
  ```

  </code-block>
</code-group>

<alert type="info">When uploading files, the `Content-Type` will be set to `multipart/form-data`.</alert>

Then we can update our newly created **Post**:

<code-group>
  <code-block Label="Query" active>

  ```js
  const post = await Post.find(1)
  
  post.text = 'An updated text for our Post!'
  
  await post.save()
  ```

  </code-block>
  <code-block Label="Find Request">

  ```http request
  GET /posts/1
  ```

  </code-block>
  <code-block Label="Save Request">

  ```http request
  PUT /posts/1
  ```

  </code-block>
</code-group>

And if we want to use `PATCH`, we can easily do that using [patch](/api/crud-operations#patch).

<code-group>
  <code-block Label="Query" active>

  ```js
  const post = await Post.find(1)
  
  post.text = 'An updated text for our Post!'
  
  await post.patch()
  ```

  </code-block>
  <code-block Label="Find Request">

  ```http request
  GET /posts/1
  ```

  </code-block>
  <code-block Label="Save Request">

  ```http request
  PATCH /posts/1
  ```

  </code-block>
</code-group>

<alert type="info">You can safely use `PATCH` with `save()`. The `POST` method will not be overridden, only `PUT`.</alert>

### Deleting a Model

See the [API reference](/api/crud-operations#delete).

We can use the `delete` method to delete a model. It's really simple!

Time to delete our newly created **Post**:

<code-group>
  <code-block Label="Query" active>

  ```js
  const post = await Post.find(1)
  
  await post.delete()
  ```

  </code-block>
  <code-block Label="Find Request">

  ```http request
  GET /posts/1
  ```

  </code-block>
  <code-block Label="Delete Request">

  ```http request
  DELETE /posts/1
  ```

  </code-block>
</code-group>

## Relationship

See the [API reference](/api/relationship-operations) for a list of available operation methods.

Now let's perform relationship operations.

There are three relationship operation methods:

- `for` - Create a new related model.
- `attach` - Also create a new related model.
- `sync` - Update a related model.

### Creating Related Models

See the [API reference](/api/relationship-operations#for).

When creating a new model, we can use the `for` method to make it related to another model. 
The `for` method will build a hierarchical resource endpoint for that.

The arguments are models. The model's resource will be used, as well as its primary key's value.

We can create a **Comment** for a **Post**:

<code-group>
  <code-block Label="Query" active>

  ```js
  const post = await Post.find(1)
  const comment = new Comment({
    text: 'Awesome post!'
  }).for(post) 

  await comment.save()
  ```

  </code-block>
  <code-block Label="Find Request">

  ```http request
  GET /posts/1
  ```

  </code-block>
  <code-block Label="Save Request">

  ```http request
  POST /posts/1/comments
  ```

  </code-block>
</code-group>

Or we can create a **Comment** for a **Post** of an **User**, by building hierarchy levels:

<code-group>
  <code-block Label="Query" active>

  ```js
  const user = await User.find(1)
  const post = await user.posts().first()
  const comment = new Comment({
    text: 'Awesome post!'
  }).for(user, post) 

  await comment.save()
  ```

  </code-block>
  <code-block Label="Find Request">

  ```http request
  GET /users/1
  ```

  </code-block>
  <code-block Label="First Request">

  ```http request
  GET /users/1/posts
  ```

  </code-block>
  <code-block Label="Save Request">

  ```http request
  POST /users/1/posts/1/comments
  ```

  </code-block>
</code-group>

### Attaching a Model

See the [API reference](/api/relationship-operations#attach).

Another way to create a model related to another model is using the `attach` method. 
It will make a `POST` request to the resource endpoint of the relation.

The argument is an object, which is the data to be created.

We can create a **Comment** for a **Post**:

<code-group>
  <code-block Label="Query" active>

  ```js
  const post = await Post.find(1)
  const comment = await post.comments().attach({
    text: 'Awesome post!'
  })
  ```

  </code-block>
  <code-block Label="Find Request">

  ```http request
  GET /posts/1
  ```

  </code-block>
  <code-block Label="Attach Request">

  ```http request
  POST /posts/1/comments
  ```

  </code-block>
</code-group>

### Syncing a Model

See the [API reference](/api/relationship-operations#sync).

The `sync` method is very similar to `attach`, but it's used to update a model. 
It makes a `PUT` request to the resource endpoint of the relation.

The argument is an object, which is the data to be updated.

We can update a `Comment` of a **Post**:

<code-group>
  <code-block Label="Query" active>

  ```js
  const post = await Post.find(1)
  const comment = await post.comments().sync({
    text: 'Awesome post!'
  })
  ```

  </code-block>
  <code-block Label="Find Request">

  ```http request
  GET /posts/1
  ```

  </code-block>
  <code-block Label="Sync Request">

  ```http request
  PUT /posts/1/comments
  ```

  </code-block>
</code-group>
