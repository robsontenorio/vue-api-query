---
title: CRUD Operations
description: 'CRUD Operations.'
position: 8
category: API
---

## `save`
- Returns: `Model | { data: Model }`

Save or update a model in the database, then return the instance.

<alert type="info">When uploading files, the `Content-Type` will be set to `multipart/form-data`.</alert>

### create

<code-group>
  <code-block Label="Query 1" active>

  ```js
  const model = new Model({ foo: 'bar' })

  model.save()
  ```

  </code-block>
  <code-block Label="Query 2">

  ```js
  const model = new Model()

  model.foo = 'bar'
  
  model.save()
  ```

  </code-block>
  <code-block Label="Request">

  ```http request
  POST /resource
  ```

  </code-block>
</code-group>

### update

<code-group>
  <code-block Label="Query" active>

  ```js
  const model = await Model.find(1)
  
  model.foo = 'bar'
  
  model.save()
  ```

  </code-block>
  <code-block Label="Request">

  ```http request
  PUT /resource/1
  ```

  </code-block>
</code-group>

## `patch`
- Returns: `Model | { data: Model }`

Make a `PATCH` request to update a model in the database, then return the instance.

<code-group>
  <code-block Label="Query" active>

  ```js
  const model = await Model.find(1)
  
  model.foo = 'bar'
  
  model.patch()
  ```

  </code-block>
  <code-block Label="Request">

  ```http request
  PATCH /resource/1
  ```

  </code-block>
</code-group>

Alias for:
```js
model.config({ method: 'PATCH' }).save()
```

<alert type="info">When uploading files, the `Content-Type` will be set to `multipart/form-data`.</alert>

## `delete`

Delete the model from the database.

<code-group>
  <code-block Label="Query" active>

  ```js
  const model = await Model.find(1)
  
  model.delete()
  ```

  </code-block>
  <code-block Label="Find Request">

  ```http request
  GET /resource/1
  ```

  </code-block>
  <code-block Label="Delete Request">

  ```http request
  DELETE /resource/1
  ```

  </code-block>
</code-group>
