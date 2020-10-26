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

We can filter our **Posts** to only get results where `status` is `published`.

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

### Evaluating Multiple Values

See the [API reference](/api/query-builder-methods#wherein)

The `whereIn` method is similar to `where`, but it accepts multiple values instead of a single one.
The first argument is the name of the column, 
and the second argument is an array of values to evaluate.

We can filter our **Posts** to only get results where `status` is `published` or `archived`.

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

## Sorting

See the [API reference](/api/query-builder-methods#orderby)

We also need to sort our queries, so let's do this now!

The method we want to use now is `orderBy`. The arguments are the names of the properties we want to sort.
We can pass as many arguments as we want. 

**Single Sort**

We can sort our **Posts** by the `created_at` date.

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

**Multiple Sort**

And we can sort by their `title` too.

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

## Including Relationships

See the [API reference](/api/query-builder-methods#include)

Sometimes, we will want to eager load a relationship, and to do so, we can use the `include` method.
The arguments are the names of the relationships we want to include. We can pass as many arguments as we want.

Let's eager load the `category` relationship of our **Post**.

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.include('category').get()
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
        id: 1,
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
        id: 1,
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

Let's append the `likes` attribute of our **Post**.

<code-group>
  <code-block label="Query" active>

  ```js
  const posts = await Post.append('likes').get()
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
  <code-block label="Response">

  ```js
  [
    /* ... */
    {
      title: 'Post 1',
      text: 'Some text here...',
      user: {
        id: 1,
        firstName: 'Joe',
        lastName: 'Doe'
      }
    },
    {
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
  <code-block label="Response">

  ```js
  [
    /* ... */
    {
      title: 'Post 1',
      text: 'Some text here...',
      category: {
        name: 'Super Awesome!',
      },
    },
    {
      title: 'Post 2',
      text: 'Some text here...',
      category: {
        name: 'Super Awesome!',
      },
    }
    /* ... */
  ]
  ```

  </code-block>
</code-group>

## Applying Custom Parameters

## Paginating
