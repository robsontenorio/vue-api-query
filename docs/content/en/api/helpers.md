---
title: Helpers
description: 'Helpers available.'
position: 9
category: API
---

## `getPrimaryKey`
- Returns: `string | number`

Get the primary key of the model using the [primaryKey](/api/model-options#primarykey) method defined in the model.

```js
Model.getPrimaryKey()
```

## `isValidId`
- Arguments: `(identifier)`
- Returns: `boolean`

Check whether the ID is valid or not.

```js
Model.isValidId(id)
```

## `hasId`
- Returns: `boolean`

Check whether the model has an ID or not. It gets the ID using [getPrimaryKey](/api/helpers#getprimarykey) and
validates it using [isValidId](/api/helpers#isvalidid).

```js
Model.hasId()
```

## `endpoint`
- Returns: `string`

Get the endpoint of the model. Can be used to get the endpoint of relationships as well. 
If the model has an ID, it will be included in the endpoint.

**Simple**

<code-group>
  <code-block Label="Usage" active>

  ```js
  Post.endpoint()
  ```

  </code-block>
  <code-block Label="Return">

  ```
  /posts
  ```

  </code-block>
</code-group>

**With ID**

<code-group>
  <code-block Label="Usage" active>

  ```js
  new Post({ id: 1 }).endpoint()
  ```

  </code-block>
  <code-block Label="Return">

  ```
  /posts/1
  ```

  </code-block>
</code-group>

**Relationship**

<code-group>
  <code-block Label="Usage" active>

  ```js
  new Post({ id: 1 }).comments().endpoint()
  ```

  </code-block>
  <code-block Label="Return">

  ```
  /posts/1/comments
  ```

  </code-block>
</code-group>
