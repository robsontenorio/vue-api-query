---
title: Building the Query
description: 'How to build queries using this package.'
position: 4
category: Getting Started
---

See the [API reference](/api/query-builder-methods) for a list of available query builder methods.

With our models already set up, it's time to start using them! 

## Retrieving a List of Records

See the [API reference](/api/query-builder-methods#get)

Let's start initializing a model and building a simple query that gets all records from the database. 
To achieve this, we can use the `get` method or its alias `all`.

We can get a list of posts using the **Post** model:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = new Post().get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts
  ```

  </code-block>
  <code-block label="Response">

  ```js
  [
    /* ... */
    {
      id: 1,
      title: 'Post 1',
      text: 'Some text here...',
      user: {
        id: 1,
        firstName: 'Joe',
        lastName: 'Doe'
      }
    },
    {
      id: 2,
      title: 'Post 2',
      text: 'Some text here...',
      user: {
        id: 2,
        firstName: 'John',
        lastName: 'Doe'
      }
    }
    /* ... */
  ]
  ```

  </code-block>
</code-group>

Just for convenience, it's possible to make Static calls. We are going to use this approach from now on:
 
<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts
  ```

  </code-block>
  <code-block label="Response">

  ```js
  [
    /* ... */
    {
      id: 1,
      title: 'Post 1',
      text: 'Some text here...',
      user: {
        id: 1,
        firstName: 'Joe',
        lastName: 'Doe'
      }
    },
    {
      id: 2,
      title: 'Post 2',
      text: 'Some text here...',
      user: {
        id: 2,
        firstName: 'John',
        lastName: 'Doe'
      }
    }
    /* ... */
  ]
  ```

  </code-block>
</code-group>

## Retrieving a Single Record

To retrieve a single record from the database, we can use two methods:

- `first` - Get the first record of a list of records.
- `find` - Find a specific record in the database.

### Getting the First Record

See the [API reference](/api/query-builder-methods#first)

Let's start using `first`. This method will internally use `get` to retrieve a list of records 
and then return the first one.

To get the first **Post** of a list:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.first()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts
  ```

  </code-block>
  <code-block label="Response">

  ```js
  {
    id: 1,
    title: 'Post 1',
    text: 'Some text here...',
    user: {
      id: 1,
      firstName: 'Joe',
      lastName: 'Doe'
    }
  }
  ```

  </code-block>
</code-group>

###  Finding a Specific Record

See the [API reference](/api/query-builder-methods#find)

Different from `first`, the `find` method wil request a specific record from the database. 
An identifier must be passed as argument.

To find a specific **Post**:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.find(1)
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts/1
  ```

  </code-block>
  <code-block label="Response">

  ```js
  {
    id: 1,
    title: 'Post 1',
    text: 'Some text here...',
    user: {
      id: 1,
      firstName: 'Joe',
      lastName: 'Doe'
    }
  }
  ```

  </code-block>
</code-group>

## Filtering

One of the most important parts when building a query is filtering, so let's get started!

There are two methods we can use to filter our queries:

- `where` - Evaluate a value against the column.
- `whereIn` - Evaluate multiple values against the column.

We can use these methods as many times as we want.

### Evaluating a Single Value

See the [API reference](/api/query-builder-methods#where)

The `where` method can be used to filter the query by evaluating a value against the column.
The first argument is the name of the column, and the second argument is the value to evaluate.

We can filter our **Posts** to only get results where `status` is `published`:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.where('status', 'published').get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?filter[status]=published
  ```

  </code-block>
</code-group>

#### Nested Filter

<alert type="success">Available in version >= v1.8.0</alert>

The first argument of `where` also accepts an array of keys, which are used to build a nested filter.

So we can filter our **Posts** to only get results where `status` of `user` is `active`:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.where([
    'user', 'status'
  ], 'active').get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?filter[user][status]=active
  ```

  </code-block>
</code-group>

### Evaluating Multiple Values

See the [API reference](/api/query-builder-methods#wherein)

The `whereIn` method is similar to `where`, but it accepts multiple values instead of a single one.
The first argument is the name of the column, 
and the second argument is an array of values to evaluate.

We can filter our **Posts** to only get results where `status` is `published` or `archived`:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.whereIn('status', [
    'published', 'archived'
  ]).get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?filter[status]=published,archived
  ```

  </code-block>
</code-group>

#### Nested Filter

<alert type="success">Available in version >= v1.8.0</alert>

The first argument of `whereIn` also accepts an array of keys, which are used to build a nested filter.

So we can filter our **Posts** to only get results where `status` of `user` is `active` or `inactive`:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.whereIn(['user', 'status'], [
    'active', 'inactive'
  ]).get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?filter[user][status]=active,inactive
  ```

  </code-block>
</code-group>

## Sorting

See the [API reference](/api/query-builder-methods#orderby)

We also need to sort our queries, so let's do this now!

The method we want to use now is `orderBy`. The arguments are the names of the properties we want to sort.
We can pass as many arguments as we want. 

#### Single Sort

We can sort our **Posts** by the `created_at` date:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.orderBy('-created_at').get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?sort=-created_at
  ```

  </code-block>
</code-group>

#### Multiple Sort

And we can sort by their `title` too:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.orderBy('-created_at', 'title').get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?sort=-created_at
  ```

  </code-block>
</code-group>

<alert type="info">
  Sorting is ascending by default and can be reversed by adding a hyphen (-) to the start of the property name.
</alert>

#### Using an Array

<alert type="success">Available in version >= v1.8.0</alert>

The first argument of `orderBy` also accepts an array of string.

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.orderBy(['-created_at', 'title']).get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?sort=-created_at
  ```

  </code-block>
</code-group>

## Including Relationships

See the [API reference](/api/query-builder-methods#include)

Sometimes, we will want to eager load a relationship, and to do so, we can use the `include` method or its alias `with`.
The arguments are the names of the relationships we want to include. We can pass as many arguments as we want.

Let's eager load the relationships `category` and `tags` of our **Post**:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.include('category', 'tags').get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?include=category,tags
  ```

  </code-block>
</code-group>

#### Using an Array

<alert type="success">Available in version >= v1.8.0</alert>

The first argument of `include` also accepts an array of string.

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.include(['category', 'tags']).get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?include=category,tags
  ```

  </code-block>
</code-group>

## Appending Attributes

See the [API reference](/api/query-builder-methods#append)

We can also append attributes to our queries using the `append` method.
The arguments are the names of the attributes we want to append. We can pass as many arguments as we want.

Let's append the attribute `likes` and `shares` of our **Post**:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.append('likes', 'shares').get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?append=likes,shares
  ```

  </code-block>
</code-group>

#### Using an Array

<alert type="success">Available in version >= v1.8.0</alert>

The first argument of `append` also accepts an array of string.

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.append(['likes', 'shares']).get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?append=likes,shares
  ```

  </code-block>
</code-group>

## Selecting Fields

See the [API reference](/api/query-builder-methods#select)

If we only need some fields of the model, we can easily select them using the `select` method.

If the fields we want to select only belongs to the model, we can pass a list of `strings` as the arguments.
But if we want to select fields of relationships as well, then we need to pass an object.

### Fields of the Model

The arguments are the names of the fields we want to select. We can pass as many arguments as we want.

We can select only the `title` and the `text` fields of our **Post** model:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.select('title', 'text').get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?fields[posts]=title,text
  ```

  </code-block>
</code-group>

### Fields of Relationships

The argument is an object, which the name of the first key is the `resource` defined in the model class, 
the name of the other keys are the included relationships, and the values are arrays of fields.

We can select only the `name` field of the category we have to eager loaded:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.include('category').select({
    posts: ['title', 'text'],
    category: ['name']
  }).get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?include=category&fields[posts]=title,text&fields[category]=name
  ```

  </code-block>
</code-group>

## Paginating

A very important feature is paginating, so let's do it now!

There are two methods we will be using here:

- `page` - Set the current page.
- `limit` -  Set the limit of records per page.

Both methods accept a number as an argument.

Let's say we are at page 1, and we want 20 **Posts** per page:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.page(1).limit(20).get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?page=1&limit=20
  ```

  </code-block>
</code-group>

## Applying Custom Parameters

See the [API reference](/api/query-builder-methods#params)

We may need to use parameters that are not provided by [vue-api-query](https://github.com/robsontenorio/vue-api-query),
and that's when the `params` method comes in to help.

The argument is an object of the parameters to add to the query.

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.params({
    doSomething: 'yes',
    process: false,
    multiple: ['awesome', 'amazing', 'super']
  }).get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?doSomething=yes&process=false&multiple=awesome,amazing,super
  ```

  </code-block>
</code-group>

## Calling a Custom Resource

See the [API reference](/api/query-builder-methods#custom)

In some situations we may also need to define a custom resource endpoint for our model directly in the query. We can override 
the default resource dynamically by calling the `custom` method.

### Defining a Static Resource

If the custom resource is static, you can simply pass the string as an argument.

We can change the **Post** resource to get the latest **Posts**:

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.custom('posts/latest').get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts/latest
  ```

  </code-block>
</code-group>

### Defining a Dynamic Resource

But it's also possible to build dynamic resource endpoints with hierarchies, by supplying the arguments 
in the correct order. It accepts models and strings as arguments. 
If a model is passed, the model's resource will be used, as well as its primary key's value if available.

We can build a resource to get the latest `Posts` that belongs to a **User**:

<code-group>
  <code-block label="Query" active>

  ```js
  const user = await User.find(1)
  const posts = await Post.custom(user, post, 'latest').get()
  ```

  </code-block>
  <code-block label="User Request">

  ```http request
  GET /users/1
  ```

  </code-block>
  <code-block label="Posts Request">

  ```http request
  GET /users/1/posts/latest
  ```

  </code-block>
</code-group>

## Configuring the Request

<alert type="success">Available in version >= v1.8.0</alert>

See the [API reference](/api/query-builder-methods#config)

The `config` method can be used to configure the current request at query builder. We can pass any config available 
from the HTTP Instance. If we are using [Axios](https://github.com/axios/axios), 
we should pass an [AxiosRequestConfig](https://github.com/axios/axios#request-config).

We can add headers, change the method, anything we want:

```js
await Post.config({ headers: { /*...*/ } }).get()
```

## Needless Parent Request

One thing to note is that in some cases we may not need to make a request to parent to build the query we want.
If we already know the model's ID, we just need to initialize the model instance with the ID, instead of use `find`.

We can get a list of **Posts** that belongs to an **User**:
 
<code-group>
  <code-block label="Query" active>

  ```js
  const user = new User({ id: 1 })
  const posts = user.posts().get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /users/1/posts
  ```

  </code-block>
</code-group>

And the same thing can be done if we want to define a 
[dynamic resource](/building-the-query#defining-a-dynamic-resource).

We can create a new **User** instance with the ID:
 
<code-group>
  <code-block label="Query" active>

  ```js
  const user = new User({ id: 1 })
  const posts = await Post.custom(user, post, 'latest').get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /users/1/posts/latest
  ```

  </code-block>
</code-group>

## Mixing Everything Up

Let's mix everything we have learned so far!

We can get a list of latest **Posts**, where `status` is `published`, include the `category` 
relation, append `likes` attribute, select `title` and `text` fields, order by `created_at`, 
paginate and custom parameters:

<code-group>
  <code-block label="Query" active>

  ```js
  const user = new User({ id: 1 })
  const posts = await Post
    .where('status', 'published')
    .include('category')
    .append('likes')
    .select('title', 'text')
    .orderBy('-created_at')
    .page(1)
    .limit(20)
    .params({ process: false })
    .custom(user, post, 'latest')
    .get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /users/1/posts/latest
  ?filter[status]=published
  &include=category
  &append=likes
  &fields[posts]=title,text
  &sort=-created_at
  &page=1
  &limit=20
  &process=false
  ```

  </code-block>
</code-group>
