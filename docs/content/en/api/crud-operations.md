---
title: CRUD Operations
description: 'CRUD Operations.'
position: 7
category: API
---

## `delete`

Delete the model from the database.

```js
await Model.find(1).delete()
```

## `save`
- Returns: `Model | { data: Model }`

Save or update a model in the database, then return the instance.

### create

<code-group>
  <code-block Label="Request 1" active>

  ```js
  const model = new Model({ foo: 'bar' })

  model.save()
  ```

  </code-block>
  <code-block Label="Request 2">

  ```js
  const model = new Model()

  model.foo = 'bar'
  
  model.save()
  ```

  </code-block>
  <code-block Label="Query">

  ```http request
  POST /resource/1
  ```

  </code-block>
</code-group>

### update

<code-group>
  <code-block Label="Request" active>

  ```js
  const model = await Model.find(1)
  
  model.foo = 'bar'
  
  model.save()
  ```

  </code-block>
  <code-block Label="Query">

  ```http request
  PUT /resource/1
  ```

  </code-block>
</code-group>
