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


🔥  If you use Laravel, this package matches perfectly with [spatie/laravel-query-builder](https://github.com/spatie/laravel-query-builder).


# Basic usage

Give me the result for a given criteria, include some entities, append extra fields and order the result!

```js
// GET /posts?filter[status]=ACTIVE&include=user,category&append=likes&orderBy=-created_at,category_id

let posts = await Post
  .where('status', 'ACTIVE')
  .include('user', 'category')
  .append('likes')
  .orderBy('-created_at', 'category_id')  
  .get()

```
Just give me the first occurrence from response:

```js
// GET /posts?filter[status]=ACTIVE

let post = await Post
  .where('status', 'ACTIVE')
  .first()
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
let post = new Post()
post.title = 'Another one'

// or

let post = new Post({title: 'Cool!'})


// POST /post

post.save()
```

We can use relationships:

```js

// GET /users/1
let user = await User.find(1)

// GET users/1/posts
let posts = await user
  .posts()
  .get()

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
plugins: [
  '~plugins/vue-api-query'
]
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

**models/Model.js**

```js
import { Model as BaseModel } from 'vue-api-query'

export default class Model extends BaseModel {

  // define a base url for a REST API
  baseURL () {
    return 'http://my-api.com'
  }

  // implement a default request method 
  request (config) {
    return this.$http.request(config)
  }
}

```

## Define your domain models

Just extends from your base model... and done! 

It automatically pluralizes based on class name. So, REST API base resource for `User` class would be `/users`.


**models/User.js**

```js
import Model from './Model'

export default class User extends Model {

}
```

If you need to customize the resource name just implement the `resource()` method.

```js
import Model from './Model'

export default class User extends Model {

  resource()
  {
    return 'userz'
  }

}
```

Of course you can add extra methods and computed properties like this:

```js
import Model from './Model'

export default class User extends Model {
  
  // computed properties are reactive -> user.fullname
  // make sure to use "get" prefix 
  get fullname()
  {
    return `${this.firstname} ${this.lastname}`
  }

  // method -> user.makeBirthday()
  makeBirthday()
  {
    this.age += 1
  }

}
```

You can set up relationships:

```js
import Model from './Model'
import Post from './Post'

export default class User extends Model {

  posts () {
    return this.hasMany(Post)
  }
}
```

It's ok if in some situations you need to call a custom resource from a already defined model. You can override dynamically the default resource calling `custom()` method.

```js
// GET /posts
let posts = await Post.get()

// GET /posts/latest
let latest = await Post
  .custom('posts/latest')
  .first()  
```

# Full example

**/models/Post.js**
```js
import Model from './Model'

export default class Post extends Model {
  // done :)
}
```
**/models/User.js**

```js
import Model from './Model'
import Post from './Post'

export default class User extends Model {  
  posts () {
    return this.hasMany(Post)
  }

  // computed properties :)
  get fullname()
  {
    return `${this.firstname} ${this.lastname}`
  }

  // methods :)
  makeBirthday()
  {
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

let posts = await Post
  .whereIn('status', ['ACTIVE', 'ARCHIVED'])
  .get()

```

If you like the "promise way" just do it like this:

```js

// single object

let user

User
  .where('status', 'ACTIVE')
  .first()
  .then(response => {
    user = response
  })

// array of objects

let users

User
  .where('status', 'ACTIVE')
  .get()
  .then(response => {
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
// Pick any comment from list and edit it

this.comments = await this.post.comments()
let comment = this.comments[0]
comment.text = 'Changed!'

// PUT /posts/{id_post}/comments/{id_comment}

await comment.save() 

// DELETE /posts/{id_post}/comments/{id_comment}

await comment.delete() 
```

And just for convenience you can POST or PUT with any payload to backend:

```js
// POST /posts/{id_post}/comments

await this.posts.comments().attach(payload) 

// PUT /posts/{id_post}/comments

await this.posts.comments().sync(payload) 
```


# Pagination

```js
// GET /users?sort=firstname&page=1&limit=20

let users = await User        
        .orderBy('firstname')
        .page(1) 
        .limit(20)
        .get()

```

# Selecting fields

Just want only some fields?

```js
// GET posts?fields[posts]=title,content

let post = await Post
   .select(['title', 'content'])
   .get() 
```

With related entities:

```js
// GET posts?include=user&fields[posts]=title,content&fields[user]=firstname,age

let post = await Post
   .select({
      posts: ['title', 'content'],
      user: ['age', 'firstname']
    })
   .include('user')
   .get() 
```

**TIP:** If you are using spatie/laravel-query-builder, when using related entities, you must pass extra fields:

```js
// GET posts?include=user&fields[posts]=title,content,user_id&fields[user]=id,firstname,age

let post = await Post
   .select({
      posts: ['title', 'content', 'user_id'],  //user_id
      user: ['id', 'age', 'firstname']         //id
    })
   .include('user')
   .get() 
```


# Response from backend

This package automatically handles the response from backend and convert it into an instance of a such Model.

## Single object

If your backend responds with a single object as a **ROOT ELEMENT**  like this:

```js
{
  id: 1,
  firstname: 'John',
  lastname: 'Doe',
  age: 25
}
```

So, `find()` and `first()` methods automatically will convert the backend response into an instace of `User` model. 

```js
let user = await User.find(1)

//or

let user = await User.first()

// will work, because an instance of User was created from response

user.makeBirthday()
```

This **WILL NOT** be converted into `User` model, because the main data is not the root element.

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
let user = await User.get()
```

```js
// works - array of object is the root element
[
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

* Inspiration from [milroyfraser/sarala](https://github.com/milroyfraser/sarala).

* Elegancy from [DavidDuwaer/coloquent](https://github.com/DavidDuwaer/Coloquent). 


Why another package if we have those? Because currently (march, 2018) they restricted backend response to JSON API specification.

# Contact

Twitter [@robsontenorio](https://twitter.com/robsontenorio)

