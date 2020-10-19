---
title: Configuration
description: 'How to configure this package.'
position: 3
category: Getting Started
---

## Define a base model

Your base model should extend from `vue-api-query` Model. Use base models is good practice in order to abstract configurations from your domain models.

```js{}[models/Model.js]
import { Model as BaseModel } from 'vue-api-query'

export default class Model extends BaseModel {

  // Define a base url for a REST API
  baseURL () {
    return 'http://my-api.com'
  }

  // Implement a default request method 
  request (config) {
    return this.$http.request(config)
  }
}

```

## Define your domain models

Just extends from your base model, implement the `resource()` method... and done! 

```js{}[models/User.js]
import Model from './Model'

export default class User extends Model {
  resource() {
    return 'users'
  }
}
```

But, if your model does not work with default primary key ('id'), you need to override the `primaryKey()` method:

```js{}[models/User.js]
import Model from './Model'

export default class User extends Model {
  primaryKey() {
    return 'someId'
  }
}
```

Of course you can add extra methods and computed properties like this:

```js{}[models/User.js]
import Model from './Model'

export default class User extends Model {
  
  // Computed properties are reactive -> user.fullname
  // Make sure to use "get" prefix 
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

```js{}[models/User.js]
import Model from './Model'
import Post from './Post'

export default class User extends Model {

  posts () {
    return this.hasMany(Post)
  }
}
```

It's ok if in some situations you need to call a custom resource from an already defined model. You can override dynamically the default resource calling `custom()` method.

```js
// GET /posts
let posts = await Post.get()

// GET /posts/latest
let latest = await Post
  .custom('posts/latest')
  .first()  
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
