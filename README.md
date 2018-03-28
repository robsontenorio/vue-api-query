<p align="center">
  <img src="bird.jpg">
</p>

# Elegant and easy way to build requests for REST APIs. 

This package helps you quickly to build requests for REST APIs. Keep your code clean and elegant.


🔥  If you use Laravel, this package matchs perfectly with [spatie/laravel-query-builder](https://github.com/spatie/laravel-query-builder).

# WARNING ❗️ 
This is a draft. Do not use it yet. Stable release soon.

# Basic usage

Give me the result for a given criteria, include some entities, append extra fields and order the result!

```js
// GET /posts?filter[status]=ACTIVE&include=user,category&append=likes&&orderBy=-created_at,category_id

let posts = await Post
  .where('status', 'ACTIVE')
  .include('user', 'category')
  .append('likes')
  .orderBy('-created_at')  
  .orderBy('category_id')  
  .get()

```
Just give me the first occurrence from response:

```js
// GET /posts?filter[status]=ACTIVE

let post = await Post
  .where('status', 'ACTIVE')
  .first()
```

Nice! Now i want a specific object:

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

Lets create a new object and post it:

```js
let post = new Post()

// POST /post

post.title = 'Another one'
post.save()
```

We can use relationships:

```js

// GET /users/1
let user = await User.find(1)

// GET users/1/posts
let posts = user
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
// TODO

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

  // implement a defult request method 
  request (config) {
    return this.$http.request(config)
  }
}

```

## Define your domain models

Just extends from your base model... and done! 

It automatically pluralizes based on class name. So REST API base resource for `User` class would be `/users`.


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

## Full example

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
// POST /users/1
{
  firstname: "John",
  lastname: "Doe",
  age: 26 //<--- changed
}
```

Play with relationships:

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


# Thanks

* Inspiration from [milroyfraser/sarala](https://github.com/milroyfraser/sarala).

* Elegancy from [DavidDuwaer/coloquent](https://github.com/DavidDuwaer/Coloquent). 


Why another package if we have those ... Because currently (march, 2018) they restricted backend response to JSON API Specification :(

# Contact

Twitter @robsontenorio

