<p align="center">
  <img src="bird.png">  
</p>
<p align="center">
  <a href="https://codecov.io/gh/robsontenorio/vue-api-query">
      <img src="https://codecov.io/gh/robsontenorio/vue-api-query/branch/master/graph/badge.svg" />
    </a>
  <a href="https://www.npmjs.com/package/vue-api-query">
    <img src="https://img.shields.io/npm/dt/vue-api-query.svg" />
    </a>
  <a href="https://www.npmjs.com/package/vue-api-query">
    <img src="https://img.shields.io/npm/v/vue-api-query.svg" />
  </a> 
   <a href="https://github.com/robsontenorio/vue-api-query/blob/master/LICENSE">
      <img src="https://img.shields.io/apm/l/vim-mode.svg" />
    </a>     
</p>

# Elegant and simple way to build requests for REST API

This package helps you quickly to build requests for REST API. Move your logic and backend requests to dedicated classes. Keep your code clean and elegant.

🔥 If you use Laravel, this package matches perfectly with [spatie/laravel-query-builder](https://github.com/spatie/laravel-query-builder).

# Basic usage

Give me the result for a given criteria, include some entities, append extra fields and order the result!

```js
// GET /posts?filter[status]=ACTIVE&include=user,category&append=likes&orderBy=-created_at,category_id

let posts = await Post.where('status', 'ACTIVE')
  .include('user', 'category')
  .append('likes')
  .orderBy('-created_at', 'category_id')
  .get()
```

Just give me the first occurrence from response:

```js
// GET /posts?filter[status]=ACTIVE

let post = await Post.where('status', 'ACTIVE').first()
```

Nice! Now I want a specific object:

```js
// GET /posts/1

let post = await Post.find(1)
```

Edit this and send it back:

```js
// PUT /posts/1

post.title = 'Awsome!'
post.save()
```

Ops, delete it!

```js
// DELETE /posts/1

post.delete()
```

Let's create a new object and post it:

```js
let post = new Post({ title: 'Cool!' })

// or

let post = new Post({})
post.title = 'Another one'

// POST /post

post.save()
```

We can use relationships:

```js
// GET /users/1
let user = await User.find(1)

// GET users/1/posts
let posts = await user.posts().get()
```

# Installation

```js
yarn add vue-api-query
```

## NUXT

Create a plugin `~/plugins/vue-api-query.js`

```js
// inject global axios instance as http client to Model

import { Model } from 'vue-api-query'

export default function (ctx, injext) {
  Model.$http = ctx.$axios
}
```

And register it on `nuxt.config.js`

```js
plugins: ['~plugins/vue-api-query']
```

## VUE

Set up on `src/main.js`

```js
[...]

import axios from 'axios'
import { Model } from 'vue-api-query'

// inject global axios instance as http client to Model
Model.$http = axios

[...]
```

# Configuration

## Define a base model

Your base model should extend from `vue-api-query` Model. Use base models is good practice in order to abstract configurations from your domain models.

**models/Model.ts**

```js
import { Model as BaseModel } from 'vue-api-query'

export default class Model extends BaseModel {
  // define a base url for a REST API
  baseURL() {
    return 'http://my-api.com'
  }

  // implement a default request method
  request(config) {
    return this.$http.request(config)
  }
}
```

## Define your domain models

Just extends from your base model, implement the `resource()` method... and done!

**models/User.ts**

```js
import Model from './Model'

export default class User extends Model {
  resource() {
    return 'users'
  }
}
```

But, if your model does not work with default primary key ('id'),you need to override the `primaryKey()` method:

```js
import Model from './Model'

export default class User extends Model {
  primaryKey() {
    return 'someId'
  }
}
```

Of course you can add extra methods and computed properties like this:

```js
import Model from './Model'

export default class User extends Model {
  // computed properties are reactive -> user.fullname
  // make sure to use "get" prefix
  get fullname() {
    return `${this.firstname} ${this.lastname}`
  }

  // method -> user.makeBirthday()
  makeBirthday() {
    this.age += 1
  }
}
```

You can set up relationships:

```js
import Model from './Model'
import Post from './Post'

export default class User extends Model {
  posts() {
    return this.hasMany(Post)
  }
}
```

It's ok if in some situations you need to call a custom resource from a already defined model. You can override dynamically the default resource calling `custom()` method.

```js
// GET /posts
let posts = await Post.get()

// GET /posts/latest
let latest = await Post.custom('posts/latest').first()
```

The `custom()` method can be called with multiple arguments to build
resource endpoints and hierarchies. Simply supply them in the correct order.
Any combination of strings and models is possible.

```js
let user = new User({ id: 1 })
let post = new Post()

// GET /users/1/posts/latest
const result = await Post.custom(user, post, 'latest').get()
```

# Full example

**/models/Post.ts**

```js
import Model from './Model'

export default class Post extends Model {
  // done :)
  resource() {
    return 'posts'
  }
}
```

**/models/User.ts**

```js
import Model from './Model'
import Post from './Post'

export default class User extends Model {
  resource() {
    return 'users'
  }

  posts() {
    return this.hasMany(Post)
  }

  // computed properties :)
  get fullname() {
    return `${this.firstname} ${this.lastname}`
  }

  // methods :)
  makeBirthday() {
    this.age += 1
  }
}
```

If the backend responds with ...

```js
// response from API for /users/1
{
  id: 1,
  firstname: "John",
  lastname: "Doe",
  age: 25
}
```

We can do this:

```js
//GET /users/1
let user = await User.find(1)

console.log(user.fullname) // John Doe

user.makeBirthday()
user.save()
```

Then `save()` method will send back the new payload:

```js
// PUT /users/1
{
  firstname: "John",
  lastname: "Doe",
  age: 26 //<--- changed
}
```

You also can do that:

```js
//GET /posts?filter[status]=ACTIVE,ARCHIVED

let posts = await Post.whereIn('status', ['ACTIVE', 'ARCHIVED']).get()
```

If you like the "promise way" just do it like this:

```js
// single object

let user

User.where('status', 'ACTIVE')
  .first()
  .then((response) => {
    user = response
  })

// array of objects

let users

User.where('status', 'ACTIVE')
  .get()
  .then((response) => {
    users = response

    // or (depending on backend response)

    users = response.data
  })
```

And in some page/component:

```js
<template>
  User:
  <code>
    {{ user }}
  </code>

  Posts from user:
  <code>
    {{ posts }}
  </code>
</template>
<script>
import User from '@/models/User'

export default {
  data()
  {
    return {
      user: {},
      posts: {}
    }
  },
  async mounted()
  {
    this.user = await User.find(1)
    this.posts = await this.user.posts().get()
  }
}
</script>

```

# Relationships

```js
// GET /users/1
let user = await User.find(1)

// GET /users/1/posts
let posts = await user.posts().get()

// Yes, you can do that before getting the posts
let posts = await user
  .posts()
  .where(...)
  .append(...)
  .include(...)
  .orderBy(...)
  .get()
```

If you like nested relationships ...

```js
// GET /posts/{id_post}/comments

let comments = await this.post.comments().get()

// Pick any comment from list and edit it

let comment = comments[0]
comment.text = 'Changed!'

// PUT /posts/{id_post}/comments/{id_comment}

await comment.save()

// DELETE /posts/{id_post}/comments/{id_comment}

await comment.delete()
```

Creating new related objects is easy. Just use the `for()` method, passing the related object.

```js
let post = new Post({ title: 'Woo!' })

// POST /posts
await post.save()

let comment = new Comment({ text: 'New one for this post' }).for(post)

// POST /posts/1/comments
await comment.save()
```

The `for()` method can take multiple objects to build hierarchy levels.

```js
let user = new User({ id: 1 })
let post = await user.posts().first()

// Related objects go in order of their appearance in the URL.
let comment = new Comment({ text: 'for() takes multiple objects.' }).for(
  user,
  post
)

// POST /users/1/posts/1/comments
await comment.save()
```

If you need to get a nested resource, without getting the parent model at first, you can do something like this.

```js
// GET /users/1/posts

let User = new User({ id: 1 })
let Post = await User.posts().get()

// GET /users/1/posts/2
let User = new User({ id: 1 })
let Post = await User.posts().find(2)
```

And just for convenience you can POST or PUT with any payload to backend:

```js
// POST /posts/{id_post}/comments

await this.posts.comments().attach(payload)

// PUT /posts/{id_post}/comments

await this.posts.comments().sync(payload)
```

You can also apply a model instance to a nested object by setting the key and the model in `relations` method. It supports nested keys.

If the backend responds with:

```js
// response from API for /posts/1
{
  title: 'My title'
  body: 'Some text here',
  user: {
    firstName: 'John',
    lastName: 'Doe'
  },
  relationships: {
    tag: {
      name: 'awesome'
    }
  }
}
```

We just need to set `user` to User model and `relationships.tag`to Tag model:

**/models/Post.ts**

```js
class Post extends Model {
  relations() {
    return {
      // Apply User model to `user` object
      user: User,
      // Apply Tag model to `relationships.tag` object
      'relationships.tag': Tag
    }
  }
}
```

It also works for collections. So if the backend responds with:

```js
// response from API for /comments
{
  text: 'Some text here',
  user: {
    firstName: 'John',
    lastName: 'Doe'
  },
  replies: [
    {
      text: 'A reply here',
      user: {
        firstName: 'Joe',
        lastName: 'Doe'
      }
    },
    {
      text: 'Another reply here',
      user: {
        firstName: 'Mary',
        lastName: 'Doe'
      },
      replies: [
        {
          text: 'Yes, this is the reply of the reply!',
          user: {
            firstName: 'Max',
            lastName: 'Doe'
          }
        }
      ]
    }
  ]
}
```

Then we just need to set `user` to User model and `replies` to Comment model:

**/models/Comment.ts**

```js
class Comment extends Model {
  relations() {
    return {
      // Apply User model to `user` object
      user: User,
      // Apply Comment model to each object of `replies` array
      replies: Comment
    }
  }
}
```

# Pagination

```js
// GET /users?sort=firstname&page=1&limit=20

let users = await User.orderBy('firstname').page(1).limit(20).get()
```

# Selecting fields

Just want only some fields?

```js
// GET posts?fields[posts]=title,content

let post = await Post.select(['title', 'content']).get()
```

With related entities:

```js
// GET posts?include=user&fields[posts]=title,content&fields[user]=firstname,age

let post = await Post.select({
  posts: ['title', 'content'],
  user: ['age', 'firstname']
})
  .include('user')
  .get()
```

**TIP:** If you are using spatie/laravel-query-builder, when using related entities, you must pass extra fields:

```js
// GET posts?include=user&fields[posts]=title,content,user_id&fields[user]=id,firstname,age

let post = await Post.select({
  posts: ['title', 'content', 'user_id'], //user_id
  user: ['id', 'age', 'firstname'] //id
})
  .include('user')
  .get()
```

# Custom params

If you need to pass any extra param not provided by `vue-api-query` pattern, just use the `params()` method while querying:

```js
// GET /users?doSomething=yes&process=no

let users = await User.params({
  doSomething: 'yes',
  process: 'no'
}).get()
```

Of course you can chain it with other methods, including on relationships.

```js
// GET /posts/1/comments?include=user&blah=123

let comments = await post.comments().include('user').params({ blah: 123 }).get()
```

# Customize query parameters name

If you need to change default values just override `parametersName()` on your Base Model. So, the generated query string will use this new values.

**models/Model.ts**

```js
import { Model as BaseModel } from 'vue-api-query'

export default class Model extends BaseModel {
  parameterNames() {
    return {
      include: 'include_custom',
      filter: 'filter_custom',
      sort: 'sort_custom',
      fields: 'fields_custom',
      append: 'append_custom',
      page: 'page_custom',
      limit: 'limit_custom'
    }
  }
}
```

# Response from backend

This package automatically handles the response from backend and convert it into an instance of a such Model.

## Single object

If your backend responds with the following response...

```js
// Note: the response data is the root element with no 'data' wrapper
{
  id: 1,
  firstname: 'John',
  lastname: 'Doe',
  age: 25
}
```

Then using `find()` and `first()` will work as expected and will hydrate the response into the `User` Model.

```js
let user = await User.find(1)

// or

let user = await User.first()

// will work - an instance of User was created from response

user.makeBirthday()
```

However, if the backend sends a response like this...

```js
// Note: the response is wrapped with 'data' attribute...
data: {
  {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    age: 25
  }
}
```

...then the above would fail. If your backend wraps single objects with a data attribute too then you should use the fetch method of find (which is `$find()`) instead to automatically hydrate the Model with the response data:

```js
let user = await User.$find(1)

// or

let user = await User.$first()

// will work, because an instance of User was created from response

user.makeBirthday()
```

This **WILL NOT** be converted into `User` model, because the main data is not the root element or it is not wrapped by `data` attribute.

```js
user: {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    age: 25
}
```

## Array of objects

An array of items from backend would be converted in the same way, **ONLY** if it responds in these formats:

```js
let users = await User.get()
```

```js
// works - array of object is the root element
;[
  {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    age: 25
  },
  {
    id: 2,
    firstname: 'Mary',
    lastname: 'Doe',
    age: 22
  }
]
```

```js
// works - `data` exists in the root and contains the array of objects
{
  data: [
    {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      age: 25
      },
    {
      id: 2,
      firstname: 'Mary',
      lastname: 'Doe',
      age: 22
    }
  ],
  someField: '',
  anotherOne: '',
}

// Normally you would handle the response like this

let response = User.get()
let users = response.data


// or like this

const { data } = User.get()
let users  = data

// but you can use the "fetch style request" with "$get()"

let users = await User.$get()
```

This **WILL NOT** be converted into an array of `User` model.

```js
{
  users: [
    {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      age: 25
      },
    {
      id: 2,
      firstname: 'Mary',
      lastname: 'Doe',
      age: 22
    }
  ],
  someField: '',
  anotherOne: '',
}

```

# Thanks

- Inspiration from [milroyfraser/sarala](https://github.com/milroyfraser/sarala).

- Elegancy from [DavidDuwaer/coloquent](https://github.com/DavidDuwaer/Coloquent).

Why another package if we have those? Because currently (march, 2018) they restricted backend response to JSON API specification.

# Contact

Twitter [@robsontenorio](https://twitter.com/robsontenorio)
