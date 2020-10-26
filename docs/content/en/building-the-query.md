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
To achieve this, we can use the `get` method.

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

Just for convenience, it's possible to make Static calls. We are going to use this approach from now on.
 
<code-group>
  <code-block label="Query" active>

  ```js
  const posts = Post.get()
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

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = Post.first()
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

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = Post.find(1)
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

We can filter our **Posts** to only get results where `status` is `published`.

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = Post.where('status', 'published').get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?filter[status]=published
  ```

  </code-block>
</code-group>

### Evaluating Multiple Values

See the [API reference](/api/query-builder-methods#wherein)

The `whereIn` method is similar to `where`, but it accepts multiple values instead of a single one.
The first argument is the name of the column, 
and the second argument is an array of values to evaluate.

We can filter our **Posts** to only get results where `status` is `published` or `archived`.

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = Post.whereIn('status', [
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

## Sorting

See the [API reference](/api/query-builder-methods#orderby)

We also need to sort our queries, so let's do this now!

The method we want to use now is `orderBy`. The arguments are the names of the properties we want to sort.
We can pass as many arguments as we want. 

**Single Sort**

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = Post.orderBy('-created_at').get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?sort=-created_at
  ```

  </code-block>
</code-group>

**Multiple Sort**

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = Post.orderBy('-created_at', 'title').get()
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

## Including Relationships

See the [API reference](/api/query-builder-methods#include)

Sometimes, we will want to eager load a relationship, and to do so, we can use the `include` method.
The arguments are the names of the relationships we want to include. We can pass as many arguments as we want.

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = Post.include('category').get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?include=category
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
      },
      category: {
        name: 'Super Awesome!'
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
      },
      category: {
        name: 'Super Awesome!'
      }
    }
    /* ... */
  ]
  ```

  </code-block>
</code-group>

## Appending Attributes

See the [API reference](/api/query-builder-methods#append)

We can also append attributes to our queries using the `append` method.
The arguments are the names of the attributes we want to append. We can pass as many arguments as we want. 

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = Post.append('likes').get()
  ```

  </code-block>
  <code-block label="Request">

  ```http request
  GET /posts?append=like
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
      },
      likes: 10
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
      likes: 15
    }
    /* ... */
  ]
  ```

  </code-block>
</code-group>

## Selecting Fields

## Applying Custom Parameters

## Paginating
